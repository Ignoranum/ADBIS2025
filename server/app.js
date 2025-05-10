const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db/sqlite.db');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;

const functions = require('./functions/functions.js');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static('files'));

app.use((req, res, next) => {
    // Middleware to log requests
    console.log(`${req.method} ${req.url}`);
    const username = req.cookies.username;

    if (username) {
        console.log('User:', username);
    }

    // Check if the user is logged in for protected routes
    const publicPaths = ['/login', '/kunde',];

    if (!publicPaths.some(path => req.url.startsWith(path)) && !username) {
        if (req.url === '/') {
            console.log('OK');
        } else {
            return res.redirect('/');
        }
    }
    next();
});

// Routes 
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/files/preLogin.html');
});

app.get('/kunde/kundeKalender', (req, res) => {
    res.sendFile(__dirname + '/files/kunde/kundeKalender.html')
})

app.get('/login', (req, res) => {
    const username = req.cookies.username;
    console.log(req.query.error);

    if (username) return res.redirect('/knap');
    else if (req.query.error) {
        res.send(`
            <!DOCTYPE html>
            <html>
              <head>
                <script>alert('Wrong credentials');</script>
                <meta http-equiv="refresh" content="0;url=/login">
              </head>
              <body>
                Redirecting...
              </body>
            </html>
          `);

    } else {
        res.sendFile(__dirname + '/files/login.html');
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('body:', req.body);
    

    db.serialize(() => {
        db.all("SELECT userId FROM Users WHERE name = ? AND password = ?", [username, password], function(err, rows) {
            if (err) {
                console.error(err.message);
                return res.status(401).redirect('/login?error=Invalid%20credentials');
            } else if (rows.length === 0) {
                console.log('Invalid credentials');
                return res.status(401).redirect('/login?error=Invalid%20credentials');
            }
            else {
                const row = rows[0];
                // Set a cookie or session here if needed
                res.cookie('username', row.userId, { maxAge: 60 * 60 * 1000, httpOnly: true });

                res.redirect('/knap');
            }
        }
        );
    });

});

app.get('/knap', (req, res) => {
    res.sendFile(__dirname + '/files/knap.html');
});


app.post('/knap', (req, res) => {
    let { longitude, latitude, checkingIn } = req.body;
    const userID = req.cookies.username;
    if (!userID) {
        res.status(400).send('User ID is required');
        return;
    }
    if (!longitude || !latitude) {
        res.status(400).send('Longitude and latitude are required');
        return;
    }

    let testUserIDs = [userID];

    functions.insertWorklog(longitude, latitude, testUserIDs, checkingIn);

    res.send('OK');
});

app.get('/medarbejderKalender', (req, res) => {
    res.sendFile(__dirname + '/files/medarbejderKalender.html');
});

app.get('/profil', (req, res) => {
    res.sendFile(__dirname + '/files/profil.html');
});

app.get('/faktura', (req, res) => {
    res.sendFile(__dirname + '/files/faktura.html');
});

app.get('/api/checkingState', (req, res) => {
    const userId = req.cookies.username;
    if (!userId) {
        res.status(400).send('User ID is required');
        return;
    }
    console.log('User ID:', userId);

    const sql = `
    SELECT w.checkingIn, w.checkInTime, w.checkOutTime
    FROM Worklog w
    JOIN UsersCheckedIn u ON w.worklogId = u.worklogId
    WHERE u.userId = ?
    ORDER BY 
        CASE 
            WHEN w.checkOutTime IS NULL OR w.checkOutTime < w.checkInTime 
            THEN w.checkInTime 
            ELSE w.checkOutTime 
        END DESC
    LIMIT 1;`;

    db.get(sql, [userId], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error retrieving checking state');
            db.get('SELECT name FROM Users WHERE userId = ?', [userId], (err, userRow) => {
                if (err) {
                    console.error(err.message);
                    res.status(500).send('Error retrieving user name');
                    return;
                }
                if (!userRow) {
                    res.status(404).send('User not found');
                    return;
                }
    
                res.json({userName: userRow.name });
            });
            
        }
        
        if (!row || row === undefined) {
            db.get('SELECT name FROM Users WHERE userId = ?', [userId], (err, userRow) => {
                if (err) {
                    console.error(err.message);
                    res.status(500).send('Error retrieving user name');
                    return;
                }
                if (!userRow) {
                    res.status(404).send('User not found');
                    return;
                }
    
                res.json({userName: userRow.name });
            });
        } else {

        let checkingState;
        if (row.checkInTime && row.checkOutTime) {
            checkingState = new Date(row.checkInTime) > new Date(row.checkOutTime) 
                ? row.checkingIn 
                : 0;
        } else if (row.checkInTime) {
            checkingState = 1;
        } else if (row.checkOutTime) {
            checkingState = 0;
        } else {
            checkingState = null;
        }
        
        db.get('SELECT name FROM Users WHERE userId = ?', [userId], (err, userRow) => {
            if (err) {
                console.error(err.message);
                res.status(500).send('Error retrieving user name');
                return;
            }
            if (!userRow) {
                res.status(404).send('User not found');
                return;
            }

            res.json({ checkingState, userName: userRow.name });
        });
        }
        
    });
});

app.get('/api/displayInformation', (req, res) => {
    // get checkInTime and checkOutTime for this month for the user
    const userId = req.cookies.username;
    if (!userId) {
        res.status(400).send('User ID is required');
        return;
    }
    console.log('User ID:', userId);

    const sql = `
    SELECT w.worklogId, w.checkInTime, w.checkOutTime, u.userId
    FROM Worklog w
    LEFT JOIN UsersCheckedIn u ON u.worklogId = w.worklogId
    WHERE u.userId = ? 
    AND (strftime('%Y-%m', checkInTime) = strftime('%Y-%m', 'now') OR strftime('%Y-%m', checkOutTime) = strftime('%Y-%m', 'now'))
    ORDER BY COALESCE(checkInTime, checkOutTime) DESC;`;

    db.all(sql, [userId], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error retrieving checking state');
            return;
        }
        if (!rows) {
            res.json({ checkingState: null });
            return;
        }
        const checkInTimes = rows.map(row => row.checkInTime);
        const checkOutTimes = rows.map(row => row.checkOutTime);
        console.log('CheckInTimes:', checkInTimes);
        console.log('CheckOutTimes:', checkOutTimes);
        res.json({ checkInTimes, checkOutTimes });
    });
});

app.get('/get-ip', (req, res) => {
    let serverIP = req.socket.localAddress;
    serverIP = serverIP.replace(/.:f.*:/, '');
    console.log('Server IP:', serverIP);
    res.json({ ip: serverIP });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
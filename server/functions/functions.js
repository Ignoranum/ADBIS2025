const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db/sqlite.db');

function works() {
  return "Works!";
}

function insertWorklog(longitude, latitude, testUserIDs, checkingIn) {

    console.log("checkingd", checkingIn);
    db.serialize(() => {
         // Use different INSERT statements based on checkingIn value
        if (checkingIn === 1) {
            db.run(
                `INSERT INTO Worklog (checkInTime, checkingIn, longitude, latitude) 
                VALUES (datetime('now', 'localtime'), ?, ?, ?)`,
                [checkingIn, longitude, latitude],
                function(err) {
                    if (err) {
                        console.error(err.message);
                        return;
                    } else {
                        const insertedId = this.lastID;
                        console.log(`Inserted into worklog: ID ${insertedId}, Longitude ${longitude}, Latitude ${latitude}`);
                        
                        let completedInserts = 0;
                        testUserIDs.forEach(testUserID => {
                            db.run("INSERT INTO UsersCheckedIn (worklogId, userId) VALUES (?, ?)", 
                            [insertedId, testUserID], 
                            function(err) {
                                if (err) {
                                    console.log("Error in users checked-in query: ", err);
                                } else {
                                    console.log(`Users checked-in insert successful with worklog ID ${insertedId}`);
                                }
                                
                                completedInserts++;
                                if (completedInserts === testUserIDs.length) {
                                    // db.close(); // Only close after all inserts are done
                                }
                            });
                        });
                    }
                }
            );
        } else if (checkingIn === 0) {
            db.run(
                `INSERT INTO Worklog (checkOutTime, checkingIn, longitude, latitude) 
                VALUES (datetime('now', 'localtime'), ?, ?, ?)`,
                [checkingIn, longitude, latitude],
                function(err) {
                    if (err) {
                        console.error(err.message);
                        return;
                    } else {
                        const insertedId = this.lastID;
                        console.log(`Inserted into worklog: ID ${insertedId}, Longitude ${longitude}, Latitude ${latitude}`);
                        
                        // Handle case where testUserIDs is empty
                        if (testUserIDs.length === 0) {
                            // db.close();
                            return;
                        }
                        testUserIDs.forEach(testUserID => {
                            db.run("INSERT INTO UsersCheckedIn (worklogId, userId) VALUES (?, ?)", 
                            [insertedId, testUserID], 
                            function(err) {
                                if (err) {
                                    console.log("Error in users checked-in query: ", err);
                                } else {
                                    console.log(`Users checked-in insert successful with worklog ID ${insertedId}`);
                                }
                                
                            });
                        });
                    }
                }
            );
        }

    });
}

module.exports = {
  works,
  insertWorklog
}
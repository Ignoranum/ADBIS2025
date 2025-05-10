var slider = document.getElementById("myRange");
var rangeText = document.getElementById("rangeText");
let stateText = document.getElementById("stateText");
let modal = document.querySelector(".modal-container");
let checkedIn = false;
const work = "start arbjede";
const work2 = "på arbejde";
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navMenu = document.getElementById('navMenu');

hamburgerBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent immediate close when clicking button
    hamburgerBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking anywhere else
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && e.target !== hamburgerBtn) {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Close menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

slider.onpointerleave = function() {
    if (checkedIn) {
        this.value = 99;
        stateText.innerHTML = work2;
    } else {
        this.value = 2;
        stateText.innerHTML = work;
    } 
}
// Update the current slider value (each time you drag the slider handle)
slider.oninput = async function() {
    stateText.innerHTML = "";
    
    if (this.value >= 99 && !checkedIn) {
        modal.style.display = "block";
        rangeText.innerHTML = "Checking in...";
        setThumb(1);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async function(position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
            
                await postLocationData(longitude, latitude, userIDs = null, checkingIn = 1);
                rangeText.innerHTML = work2;
                console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
                console.log('Geolocation is supported by this browser.');
                location.reload();

            }, async function(error) {
                const latitude = "N/A";
                const longitude = "N/A";
                
                await postLocationData(longitude, latitude, userIDs = null, checkingIn = 1);
                rangeText.innerHTML = 'At work without geolocation.';
                console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
                console.log('Geolocation error:', error.message);
                location.reload();
            }
            );
        } else {
            const latitude = "N/A";
            const longitude = "N/A";
            
            await postLocationData(longitude, latitude, userIDs = null, checkingIn = 1);
            rangeText.innerHTML = 'At work, but geolocation is not supported.';
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            console.log('Geolocation is not supported by this browser.');
            location.reload();
        }

    } else if (this.value <= 2 && checkedIn) {
        modal.style.display = "block";
        rangeText.innerHTML = "Checking out...";
        setThumb(0);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async function(position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
            
                await postLocationData(longitude, latitude, userIDs = null, checkingIn = 0);
                rangeText.innerHTML = work;
                console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
                console.log('Geolocation is supported by this browser.');
                location.reload();

            }, async function(error) {
                const latitude = "N/A";
                const longitude = "N/A";
                
                await postLocationData(longitude, latitude, userIDs = null, checkingIn = 0);
                rangeText.innerHTML = 'Work? without geolocation.';
                console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
                console.log('Geolocation error:', error.message);
                location.reload();
            }
            );
        } else {
            const latitude = "N/A";
            const longitude = "N/A";
            
            await postLocationData(longitude, latitude, userIDs = null, checkingIn = 0);
            rangeText.innerHTML = 'Work?, but geolocation is not supported.';
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            console.log('Geolocation is not supported by this browser.');
            location.reload();
        }


    }

}

async function setThumb(thumbState) {
    if (thumbState == 1) {
        slider.value = 99;
        stateText.innerHTML = work2;
        checkedIn = true;
        slider.style.setProperty('--thumb-color', '#cb2718');
        
        
    }
    else if (thumbState == 0) {
        slider.value = 2;
        stateText.innerHTML = work;
        checkedIn = false;
        slider.style.setProperty('--thumb-color', '#04AA6D');

    }
    else if (thumbState == null) {
        slider.value = 2;
        stateText.innerHTML = work;
        checkedIn = false;
        slider.style.setProperty('--thumb-color', '#04AA6D');
    
    }
    else {
        console.error('Invalid state:', thumbState);
        return;
    }
}

// Get the server's IP address
async function getServerIP() {
    let serverIP = await fetch('/get-ip')
    .then(response => response.json())
    .then(data => {
        const serverIP = data.ip;
        console.log("Server's IP:", serverIP);
        return serverIP;
    })
    .catch(error => console.error('Error fetching server IP:', error));

    if (serverIP == "::1") {
        serverIP = "localhost";
        console.log("Server's IP is instead:", serverIP);
        return serverIP;
    } else {
        return serverIP;
    }
    
}

// Post location data to the server
async function postLocationData(longitude, latitude, userIDs, checkingIn) {
    const serverIP = await getServerIP()
    .catch(error => console.error('Error fetching server IP:', error));
    const url = `http://${serverIP}:3000/knap`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                longitude,
                latitude,
                userIDs,
                checkingIn
            })
        });
        console.log(response);
    } catch (error) {
        console.error(error.message);
    }
}

// ----------------------------
// Function to update the state of the toggle switch
async function updateState() {
    // Get the selected coworker ID
    const select = document.getElementById('logged-in-id');

    const data = await fetch(`/api/checkingState`)
        .then(response => response.json())
        .then(data => {
            console.log('Checking state:', data);
            document.getElementById('name-signedin').innerHTML = data.userName;
            document.getElementById('standard-coworker').innerHTML = "";
            document.getElementById('standard-coworker').innerHTML = data.userName + " (dig selv)";

            const state = data.checkingState;

            // Update the state of the toggle switch
            if (state === 1) {
                slider.value = 99;
                stateText.innerHTML = work2;
                checkedIn = true;
            }
            else if (state === 0) {
                slider.value = 2;
                stateText.innerHTML = work;
                checkedIn = false;
            }
            else if (state === null) {
                slider.value = 2;
                stateText.innerHTML = work;
                checkedIn = false;
            }
            else {
                console.error('Invalid state');
                return;
            }
            // Update the color of the slider thumb
            if (checkedIn) {
                slider.style.setProperty('--thumb-color', '#cb2718');
            } else {
                slider.style.setProperty('--thumb-color', '#04AA6D');
            }
            // Log the updated state
            console.log('Updated state:', state);

            
        })
        .catch(error => {
            console.error('Error fetching checking state:', error);
            return null;
        });

    
}



// Sample data - in a real app, this would come from your database
const coworkers = [
    { id: 2, name: "Jane Smith", role: "Designer", department: "Creative", email: "jane@example.com", avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
    { id: 3, name: "Mike Johnson", role: "Manager", department: "Operations", email: "mike@example.com", avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
    { id: 4, name: "Sarah Williams", role: "HR Specialist", department: "Human Resources", email: "sarah@example.com", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
    { id: 5, name: "David Brown", role: "Accountant", department: "Finance", email: "david@example.com", avatar: "https://randomuser.me/api/portraits/men/3.jpg" }
];

// In a real application, you would fetch this from your database:
// fetch('/api/coworkers')
//     .then(response => response.json())
//     .then(data => {
//         coworkers = data;
//         populateDropdown();
//     });

// Populate the dropdown with coworkers
function populateDropdown() {
    const select = document.getElementById('coworker-select');
    
    // Clear existing options (except the first one)
    while (select.options.length > 1) {
        select.remove(1);
    }
    
    // Add coworkers to dropdown
    coworkers.forEach(coworker => {
        const option = document.createElement('option');
        option.value = coworker.id;
        option.textContent = `${coworker.name} (${coworker.department})`;
        select.appendChild(option);
    });
}

// Add selected coworker to the list
function addCoworker() {
    const select = document.getElementById('coworker-select');
    const selectedId = select.value;
    
    if (!selectedId) return;
    
    const coworker = coworkers.find(c => c.id == selectedId);
    if (!coworker) return;
    
    // Check if already selected
    if (document.querySelector(`.coworker-card[data-id="${selectedId}"]`)) {
        alert('This coworker is already selected');
        return;
    }
    
    // Create card for selected coworker
    const card = document.createElement('div');
    card.className = 'coworker-card';
    card.dataset.id = selectedId;
    
    card.innerHTML = `
        <img src="${coworker.avatar}" alt="${coworker.name}">
        <div class="coworker-info">
            <h3>${coworker.name}</h3>
            <p>${coworker.role} - ${coworker.department}</p>
            <p>${coworker.email}</p>
        </div>
        <button class="remove-btn">Remove</button>
    `;
    
    // Add remove functionality
    const removeBtn = card.querySelector('.remove-btn');
    removeBtn.addEventListener('click', () => {
        card.remove();
    });
    
    // Add to selected list
    document.getElementById('selected-list').appendChild(card);
    
    // Reset dropdown
    select.value = '';
}

async function getDisplayInformation() {
    const data = await fetch(`/api/displayInformation`)
        .then(response => response.json())
        .then(data => {
            // console.log('Display information:', data);
            return data;
        })
        .catch(error => {
            console.error('Error fetching display information:', error);
            return null;
        });
    
    
        if (!data) return;

        
    // Function to find the latest time from an array of date strings
     function findLatestTime(timeArray) {
        // Filter out null values and convert to Date objects
        const dates = timeArray
            .filter(time => time !== null)
            .map(time => new Date(time));
        
        // If no valid dates, return null
        if (dates.length === 0) return null;
        
        // Find the latest date
        return new Date(Math.max(...dates));
    }

    // Find latest check-in and check-out times
    const latestCheckIn = findLatestTime(data.checkInTimes);
    const latestCheckOut = findLatestTime(data.checkOutTimes);

    // console.log('Latest check-in time:', latestCheckIn);
    // console.log('Latest check-out time:', latestCheckOut);

    // Determine which one is more recent
    let lastShiftEnd;
    let checkInPeriode;
    let checkInPeriodeHours;
    let checkInPeriodeMinutes;
    if (latestCheckIn && latestCheckOut) {
        lastShiftEnd = latestCheckIn > latestCheckOut ? "arbejder..." : latestCheckOut;
        checkInPeriode = latestCheckIn > latestCheckOut ? "arbejder..." : latestCheckOut - latestCheckIn;
        if (typeof checkInPeriode != "string") {
            checkInPeriodeHours = Math.floor(checkInPeriode / (1000 * 60 * 60));
            checkInPeriodeMinutes = Math.floor((checkInPeriode % (1000 * 60 * 60)) / (1000 * 60));
        }
    } else if (latestCheckIn) {
        lastShiftEnd = latestCheckIn;
        checkInPeriode = "Du skal checke ud en gang før beregning";
    } else if (latestCheckOut) {
        lastShiftEnd = latestCheckOut;
        checkInPeriode = "Du har ikke checked ind i denne periode"
    } else {
        console.log('No valid check-in or check-out times found');
        return;
    }

    // Function to filter out nulls and sort dates in ascending order (oldest first)
    function processTimes(timeArray) {
        return timeArray
            .filter(time => time !== null)
            .map(time => new Date(time))
            .sort((a, b) => b - a); // Sort from oldest to newest
    }

    const sortedCheckIns = processTimes(data.checkInTimes);
    const sortedCheckOuts = processTimes(data.checkOutTimes);

    let hours;
    let minutes;
    let seconds;
    if (sortedCheckIns.length == sortedCheckOuts.length) {
            
        let totalTime = 0; // Total checked-in time in milliseconds
        let checkInIndex = 0;
        let checkOutIndex = 0;

        // Pair the newest check-in with the newst check-out, and so on
        while (checkInIndex < sortedCheckIns.length && checkOutIndex < sortedCheckOuts.length) {
            const checkIn = sortedCheckIns[checkInIndex];
            const checkOut = sortedCheckOuts[checkOutIndex];
            
            // Ensure check-out happens after check-in (valid shift)
            if (checkOut > checkIn) {
                totalTime += checkOut - checkIn;
                checkInIndex++;
                checkOutIndex++;
            } else {
                // If check-out is before check-in, skip this check-out (invalid pair)
                checkOutIndex++;
            }
        }

        // Convert total time to hours, minutes, seconds
        hours = Math.floor(totalTime / (1000 * 60 * 60));
        minutes = Math.floor((totalTime % (1000 * 60 * 60)) / (1000 * 60));
        seconds = Math.floor((totalTime % (1000 * 60)) / 1000);
    }


    // console.log('Last shift ended at:', lastShiftEnd);

    // Calculate how long ago the last shift was
    let hoursSinceLastShift
    if (typeof lastShiftEnd != "string") {
        const now = new Date();
        const timeSinceLastShift = now - lastShiftEnd; // in milliseconds
        hoursSinceLastShift = timeSinceLastShift / (1000 * 60 * 60);
        lastShiftEnd = hoursSinceLastShift.toFixed(0)
    }

    // console.log(`Last shift was ${hoursSinceLastShift.toFixed(2)} hours ago`);

    if (typeof checkInPeriode != "string") {
        document.getElementById('hours-worked').innerHTML = checkInPeriodeHours + "t " + checkInPeriodeMinutes + "min";
    } else {
        document.getElementById('hours-worked').innerHTML = checkInPeriode;
    }
    document.getElementById('last-worked').innerHTML = lastShiftEnd;
    if (typeof hours == "undefined") {
        document.getElementById('total-hours').innerHTML = "arbejder...";
    } else {
        document.getElementById('total-hours').innerHTML = hours + "t " + minutes + "min";
    }
}


// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    updateState();
    populateDropdown();
    getDisplayInformation();
    
    // Add button click handler
    //document.getElementById('add-btn').addEventListener('click', addCoworker);
    
    // Also allow adding by pressing Enter in the dropdown
    /* document.getElementById('coworker-select').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addCoworker();
        }
    }); */
});




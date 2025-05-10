const hamburgerBtn = document.getElementById('hamburgerBtn');
const navMenu = document.getElementById('navMenu');

// Hamburger button

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

async function updateState() {

    const data = await fetch(`/api/checkingState`)
        .then(response => response.json())
        .then(data => {
            console.log('Checking state:', data);
            return data;
        })
        .catch(error => {
            console.error('Error fetching checking state:', error);
            return null;
        });

    document.getElementById('name-signedin').innerHTML = data.userName;

    
}

// Page specific scripts
async function faktura() {
    const data = [
        { fakturaId: 1, fakturaDate: '2025-01-01', fakturaAmount: 100, fakturaStatus: 'Paid' },
        { fakturaId: 2, fakturaDate: '2025-02-01', fakturaAmount: 200, fakturaStatus: 'Unpaid' },
        { fakturaId: 3, fakturaDate: '2025-03-01', fakturaAmount: 300, fakturaStatus: 'Paid' },
        { fakturaId: 4, fakturaDate: '2025-04-01', fakturaAmount: 400, fakturaStatus: 'Unpaid' },
        { fakturaId: 5, fakturaDate: '2025-01-01', fakturaAmount: 100, fakturaStatus: 'Paid' },
        { fakturaId: 6, fakturaDate: '2025-02-01', fakturaAmount: 200, fakturaStatus: 'Unpaid' },
        { fakturaId: 7, fakturaDate: '2025-03-01', fakturaAmount: 300, fakturaStatus: 'Paid' },
        { fakturaId: 8, fakturaDate: '2025-04-01', fakturaAmount: 400, fakturaStatus: 'Unpaid' }
    ]

    if (data) {
        // Populate the table with the fetched data
        const tableBody = document.getElementById("list-container");
        tableBody.innerHTML = ''; // Clear existing rows

        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.classList.add('table-row');
            tr.innerHTML = `
                <td>${row.fakturaId}</td>
                <td>${row.fakturaDate}</td>
                <td>${row.fakturaAmount}</td>
                <td>${row.fakturaStatus}</td>
                <td>
                    <button class="fbtn btn-see">📖</button>
                    <button class="fbtn btn-send">✉️</button>
                <td>
            `;
            tableBody.appendChild(tr);
        });
    }
}

// pop up
function addPopUp() {
    // Get DOM elements
    const openPopupBtn = document.querySelectorAll('.btn-see');
    const closePopupBtn = document.getElementById('closePopupBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const popupOverlay = document.getElementById('popupOverlay');

    // Open popup
    openPopupBtn.forEach((item) => {
        item.addEventListener('click', () => {
            popupOverlay.classList.add('active');
        });
    });

    // Close popup (multiple ways)
    [closePopupBtn, cancelBtn, popupOverlay].forEach(element => {
        element.addEventListener('click', (e) => {
            // Only close if clicking overlay (not the popup itself) or the close buttons
            if(e.target === popupOverlay || e.target === closePopupBtn || e.target === cancelBtn) {
                popupOverlay.classList.remove('active');
            }
        });
    });
}


// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    updateState();
    faktura();
    addPopUp();
});
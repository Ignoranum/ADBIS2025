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


// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    updateState();
});
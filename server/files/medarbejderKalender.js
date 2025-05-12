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


// ----------------------------
// Function to update the state of the toggle switch
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

/* kalender */
const calendarDays = document.getElementById('calendar-days');
const monthYear = document.querySelector('.month-year');
const prevMonthBtn = document.querySelector('.prev-month');
const nextMonthBtn = document.querySelector('.next-month');

let currentDate = new Date();

// Dummy events data
const events = {
    '2025-4-25': [
        { title: 'Reservation', location: 'København H', medarbejdere: ["hans", "jens"], type: 'event-1', name: 'Henrik', id: '111', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', priceCategory: 'Let Samlet &copy;'},
        { title: 'Reservation', location: 'Frideriksberg', medarbejdere: ["hans", "jens"], type: 'event-1', name: 'Susanne', id: '222', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', priceCategory: 'Time Pris Plus &copy;'},
        { title: 'Reservation', location: 'Hellerup', medarbejdere: ["hans"], type: 'event-1', name: 'Paul', id: '333', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', priceCategory: 'Let Samlet &copy;'}
    ],
    '2025-5-15': [
        { title: 'Reservation', location: 'København H', medarbejdere: ["hans", "jens"], type: 'event-1', name: 'Henrik', id: '111', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', priceCategory: 'Let Samlet &copy;'},
        { title: 'Reservation', location: 'Frideriksberg', medarbejdere: ["hans", "jens"], type: 'event-1', name: 'Susanne', id: '222', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', priceCategory: 'Time Pris Plus &copy;'},
        { title: 'Forespørgsel', location: 'Hellerup', medarbejdere: ["hans"], type: 'event-3', name: 'Paul', id: '333', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', priceCategory: 'Let Samlet &copy;'}
    ],
    '2025-6-4': [
        { title: 'Forespørgsel', location: 'Hellerup', medarbejdere: ["hans"], type: 'event-3', name: 'Paul', id: '333', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', priceCategory: 'Let Samlet &copy;'}
    ],
    '2025-6-17': [
        { title: 'Forespørgsel', location: 'Frideriksberg', medarbejdere: ["hans", "jens"], type: 'event-3', name: 'Susanne', id: '222', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', priceCategory: 'Time Pris Plus &copy;'},
        { title: 'Forespørgsel', location: 'Hellerup', medarbejdere: ["hans"], type: 'event-3', name: 'Paul', id: '333', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', priceCategory: 'Let Samlet &copy;'}
    ]
};

function renderCalendar() {
    calendarDays.innerHTML = '';
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    monthYear.textContent = new Date(year, month).toLocaleDateString('da-DK', {
        month: 'long',
        year: 'numeric'
    });
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    
    const firstDayIndex = firstDay.getDay();
    const lastDayIndex = lastDay.getDay();
    const lastDate = lastDay.getDate();
    const prevLastDate = prevLastDay.getDate();
    
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
    
    // Previous month days
    for (let i = firstDayIndex; i > 0; i--) {
        const day = document.createElement('div');
        day.classList.add('day', 'other-month');
        day.innerHTML = `
            <div class="day-number">${prevLastDate - i + 1}</div>
        `;
        calendarDays.appendChild(day);
    }
    
    // Current month days
    for (let i = 1; i <= lastDate; i++) {
        const day = document.createElement('div');
        day.classList.add('day');
    
        
        if (isCurrentMonth && i === today.getDate()) {
            day.classList.add('today');
        }
        
        const dateKey = `${year}-${month + 1}-${i}`;
        const dayEvents = events[dateKey] || [];
        
        let eventsHTML = '';
        let popupHTML = '';
        
        if (dayEvents.length > 0) {
            eventsHTML = '<div class="events">';
            popupHTML = '<div class="event-popup">';
            
            dayEvents.forEach(event => {
                eventsHTML += `<div class="event ${event.type}"></div>`;
                popupHTML += `
                    <div class="event-popup-item">
                        <div class="event-popup-title">${event.title}</div>
                        <div class="event-popup-time">${event.location}</div>
                    </div>
                `;
            });
            
            eventsHTML += '</div>';
            popupHTML += '</div>';
        }
        
        day.innerHTML = `
            <div class="day-number">${i}</div>
            ${eventsHTML}
            ${popupHTML}
        `;
        
        calendarDays.appendChild(day);
    }
    
    // Next month days
    for (let i = lastDayIndex; i < 6; i++) {
        const day = document.createElement('div');
        day.classList.add('day', 'other-month');
        day.innerHTML = `
            <div class="day-number">${i - lastDayIndex + 1}</div>
        `;
        calendarDays.appendChild(day);
    }
}

document.addEventListener('click', function(event) {
    const target = event.target.closest('.day');
    if (target) {
        target.style.transform = 'scale(1.1)';
        target.style.transition = 'transform 0.2s ease-in-out';

        const dateNumber = target.querySelector('.day-number');
        let monthYear = document.querySelector('.month-year');
        const selectedDate = document.getElementById('selected-date');
        selectedDate.value = dateNumber.textContent + ' ' + monthYear.textContent;

        const prevEvent = document.querySelector('.nav-prev-event');
        const nextEvent = document.querySelector('.nav-prev-event');
        const eventName = document.getElementById('eventName');
        const customerName = document.getElementById('customerName');
        const customerID = document.getElementById('customerID');
        const description = document.getElementById('description');
        const priceCategory = document.getElementById('priceCategory');

        customerName.value = '';
        customerID.value = '';
        description.innerHTML = '';
        priceCategory.value = '';

        monthYear = monthYear.textContent.split(' ');
        const month = 4 //monthYear[0];
        const year = monthYear[1];

        console.log(events[`${year}-${month}-${dateNumber.textContent}`][0].title);
        eventName.value = 32123;
        customerName.value = events[`${year}-${month}-${dateNumber.textContent}`][0].name;
        customerID.value = events[`${year}-${month}-${dateNumber.textContent}`][0].id;
        description.innerHTML = events[`${year}-${month}-${dateNumber.textContent}`][0].description;
        priceCategory.value = events[`${year}-${month}-${dateNumber.textContent}`][0].priceCategory;

        setTimeout(() => {
            target.style.transform = 'scale(1)';
        }, 200);
    }
});
    
    

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    updateState();
    renderCalendar();

    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
});
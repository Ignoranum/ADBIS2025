document.addEventListener('DOMContentLoaded', function() {
    const calendarDays = document.getElementById('calendar-days');
    const monthYear = document.querySelector('.month-year');
    const prevMonthBtn = document.querySelector('.prev-month');
    const nextMonthBtn = document.querySelector('.next-month');
    
    let currentDate = new Date();
    
    // Dummy events data
    const events = {
        '2025-4-25': [
            { title: 'Høj belastning', time: 'især overmiddag', type: 'event-1' }
        ],
        '2025-4-26': [
            { title: 'Høj belastning', time: 'især overmiddag', type: 'event-1' }
        ],
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
            
            const dayDate = new Date(year, month, i);
            const fewDatesFuture = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3);
            if (dayDate < fewDatesFuture && !(dayDate.getDate() === today.getDate() && dayDate.getMonth() === today.getMonth() && dayDate.getFullYear() === today.getFullYear())) {
                day.classList.add('past-day');
            }
            
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
                            <div class="event-popup-time">${event.time}</div>
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
    
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
    
    renderCalendar();
});
document.addEventListener('click', function(event) {
    const target = event.target.closest('.day');
    if (target) {
        target.style.transform = 'scale(1.1)';
        target.style.transition = 'transform 0.2s ease-in-out';

        const dateNumber = target.querySelector('.day-number');
        const monthYear = document.querySelector('.month-year');
        const selectedDate = document.getElementById('selected-date');
        selectedDate.value = dateNumber.textContent + ' ' + monthYear.textContent;

        setTimeout(() => {
            target.style.transform = 'scale(1)';
        }, 200);
    }
});
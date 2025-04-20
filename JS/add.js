document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('eventForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const event = {
            id: Date.now().toString(),
            title: document.getElementById('eventTitle').value,
            date: document.getElementById('eventDate').value,
            category: document.getElementById('eventCategory').value,
            description: document.getElementById('eventDescription').value
        };
        
        saveEvent(event);
        window.location.href = '/HTML/main.html';
    });
});

function saveEvent(event) {
    let events = JSON.parse(localStorage.getItem('events')) || [];
    events.push(event);
    localStorage.setItem('events', JSON.stringify(events));
}
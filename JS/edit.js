document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');
    
    if (!eventId) {
        window.location.href = '/HTML/main.html';
        return;
    }
    
    let events = JSON.parse(localStorage.getItem('events')) || [];
    const event = events.find(e => e.id === eventId);
    
    if (!event) {
        window.location.href = '/HTML/main.html';
        return;
    }
    
    document.getElementById('eventId').value = event.id;
    document.getElementById('editTitle').value = event.title;
    document.getElementById('editDate').value = event.date;
    document.getElementById('editCategory').value = event.category;
    document.getElementById('editDescription').value = event.description || '';
    
    // Обработчик сохранения
    const form = document.getElementById('editForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const updatedEvent = {
            id: eventId,
            title: document.getElementById('editTitle').value,
            date: document.getElementById('editDate').value,
            category: document.getElementById('editCategory').value,
            description: document.getElementById('editDescription').value
        };
        
        updateEvent(updatedEvent);
        window.location.href = '/HTML/main.html';
    });
    
    // Обработчик удаления
    document.getElementById('deleteBtn').addEventListener('click', function() {
        if (confirm('Вы уверены, что хотите удалить это событие?')) {
            deleteEvent(eventId);
            window.location.href = '/HTML/main.html';
        }
    });
});

function updateEvent(updatedEvent) {
    let events = JSON.parse(localStorage.getItem('events')) || [];
    events = events.map(event => event.id === updatedEvent.id ? updatedEvent : event);
    localStorage.setItem('events', JSON.stringify(events));
}

function deleteEvent(eventId) {
    let events = JSON.parse(localStorage.getItem('events')) || [];
    events = events.filter(event => event.id !== eventId);
    localStorage.setItem('events', JSON.stringify(events));
}
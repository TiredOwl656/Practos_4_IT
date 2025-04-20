document.addEventListener('DOMContentLoaded', function() {
    loadEvents();
    
    // Обработчики для фильтров
    document.getElementById('categoryFilter').addEventListener('change', filterAndSortEvents);
    document.getElementById('dateSort').addEventListener('change', filterAndSortEvents);
});

function loadEvents() {
    const eventsContainer = document.getElementById('eventsContainer');
    eventsContainer.innerHTML = '';
    
    let events = JSON.parse(localStorage.getItem('events')) || [];
    
    if (events.length === 0) {
        eventsContainer.innerHTML = '<p class="no-events">Нет событий. Добавьте первое событие!</p>';
        return;
    }
    
    events.forEach(event => {
        const eventCard = createEventCard(event);
        eventsContainer.appendChild(eventCard);
    });
}

function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.dataset.id = event.id;
    
    const categoryClass = event.category || 'personal';
    
    card.innerHTML = `
        <h3>${event.title}</h3>
        <div class="date">${formatDate(event.date)}</div>
        <span class="category ${categoryClass}">${getCategoryName(event.category)}</span>
        ${event.description ? `<div class="description">${event.description}</div>` : ''}
    `;
    
    card.addEventListener('click', () => {
        window.location.href = `/HTML/edit.html?id=${event.id}`;
    });
    
    return card;
}

function filterAndSortEvents() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const dateSort = document.getElementById('dateSort').value;
    
    let events = JSON.parse(localStorage.getItem('events')) || [];
    
    // Фильтрация по категории
    if (categoryFilter !== 'all') {
        events = events.filter(event => event.category === categoryFilter);
    }
    
    // Сортировка по дате
    events.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateSort === 'newest' ? dateB - dateA : dateA - dateB;
    });
    
    animateCardsReordering(events);
}

function animateCardsReordering(filteredEvents) {
    const eventsContainer = document.getElementById('eventsContainer');
    const existingCards = Array.from(eventsContainer.querySelectorAll('.event-card'));
    const existingNoEvents = eventsContainer.querySelector('.no-events');
    
    if (filteredEvents.length === 0) {
        if (existingNoEvents) return;
        
        existingCards.forEach(card => {
            card.style.transition = 'opacity 0.3s ease';
            card.style.opacity = '0';
        });
        
        setTimeout(() => {
            eventsContainer.innerHTML = '<p class="no-events">Событий не найдено</p>';
        }, 300);
        return;
    }
    
    if (existingNoEvents) {
        eventsContainer.removeChild(existingNoEvents);
    }
    
    const existingCardsMap = {};
    existingCards.forEach(card => {
        existingCardsMap[card.dataset.id] = card;
    });
    
    // Массив карточек в новом порядке
    const newCardsOrder = [];
    filteredEvents.forEach(event => {
        if (existingCardsMap[event.id]) {
            newCardsOrder.push(existingCardsMap[event.id]);
        } else {
            const newCard = createEventCard(event);
            newCard.style.opacity = '0';
            newCardsOrder.push(newCard);
        }
    });
    
    // Текущие позиции
    const oldPositions = {};
    existingCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        oldPositions[card.dataset.id] = {
            top: rect.top,
            left: rect.left
        };
    });
    
    // Переупорядочиваем карточки в DOM
    eventsContainer.innerHTML = '';
    newCardsOrder.forEach(card => {
        eventsContainer.appendChild(card);
    });
    
    // Новые позиции
    requestAnimationFrame(() => {
        newCardsOrder.forEach(card => {
            const newRect = card.getBoundingClientRect();
            const oldPos = oldPositions[card.dataset.id];
            
            if (oldPos) {
                const ox = oldPos.left - newRect.left;
                const oy = oldPos.top - newRect.top;
                
                card.style.transition = 'none';
                card.style.transform = `translate(${ox}px, ${oy}px)`;
                card.style.opacity = '0.5';
                
                requestAnimationFrame(() => {
                    card.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
                    card.style.transform = 'translate(0, 0)';
                    card.style.opacity = '1';
                });
            } else {
                card.style.transition = 'opacity 0.5s ease';
                card.style.opacity = '1';
            }
        });
    });
}

function formatDate(dateString) {
    return new Date(dateString)
    .toLocaleDateString('ru-RU', 
        { year: 'numeric', 
        month: 'long', 
        day: 'numeric' });
}

function getCategoryName(category) {
    const names = {
        'personal': 'Личное',
        'work': 'Рабочее',
        'public': 'Общественное'
    };
    return names[category] || 'Личное';
}
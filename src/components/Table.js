const fakeTasksData = [
    {
        uuid: "a1b2c3d4",
        section: "blockers",
        categoryUuid: "cat-1",
        title: "Оновити ОС на робочому ПК",
        description: "Виправлення вразливостей та підвищення стабільності.",
        benefit: "Усунення дрібних помилок, що гальмують роботу.",
        repeatInterval: 168, // раз на тиждень
        minCompletionTime: 10,
        estimatedTime: 30,
        lastCompletedAt: null,
        completionCount: 0,
        isArchived: false,
        lastUpdatedAt: Date.now() - 3600000,
    },
    {
        uuid: "e5f6g7h8",
        section: "drivers",
        categoryUuid: "cat-2",
        title: "Прочитати главу книги про JS",
        description: "Засвоєння нового матеріалу для підвищення кваліфікації.",
        benefit: "Довгостроковий ріст знань.",
        repeatInterval: 24, // щодня
        minCompletionTime: 20,
        estimatedTime: 45,
        lastCompletedAt: Date.now() - 86400000,
        completionCount: 15,
        isArchived: false,
        lastUpdatedAt: Date.now() - 100000,
    },
    {
        uuid: "i9j0k1l2",
        section: "accelerators",
        categoryUuid: "cat-3",
        title: "Написати пост у блог",
        description: "Створення контенту для залучення аудиторії.",
        benefit: "Особистий бренд та репутація.",
        repeatInterval: 0,
        minCompletionTime: 60,
        estimatedTime: 120,
        lastCompletedAt: Date.now() - 259200000, // 3 дні тому
        completionCount: 3,
        isArchived: false,
        lastUpdatedAt: Date.now() - 7200000,
    },
    {
        uuid: "m3n4o5p6",
        section: "blockers",
        categoryUuid: "cat-1",
        title: "Резервне копіювання файлів",
        description: "Переконатися, що всі важливі дані збережені.",
        benefit: "Спокій і безпека даних.",
        repeatInterval: 72, // раз на 3 дні
        minCompletionTime: 5,
        estimatedTime: 10,
        lastCompletedAt: Date.now() - 7200000,
        completionCount: 42,
        isArchived: false,
        lastUpdatedAt: Date.now() - 1800000,
    },
    {
        uuid: "q7r8s9t0",
        section: "drivers",
        categoryUuid: "cat-2",
        title: "Аналіз метрик проєкту",
        description: "Перевірка прогресу та коригування плану.",
        benefit: "Ефективне управління часом.",
        repeatInterval: 48, // раз на 2 дні
        minCompletionTime: 15,
        estimatedTime: 25,
        lastCompletedAt: Date.now(),
        completionCount: 8,
        isArchived: true, // Архівний елемент
        lastUpdatedAt: Date.now(),
    }
];

/**
 * Утиліта для форматування Unix-timestamp у зрозумілий рядок
 * @param {number|null} timestamp - Часова мітка (або null)
 * @returns {string} Відформатований рядок дати
 */
function formatTime(timestamp) {
    if (!timestamp) return '—';
    // Використовуємо Intl API для локалізованого формату
    return new Date(timestamp).toLocaleString('uk-UA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
/**
 * Створює DOM-таблицю Bootstrap та повертає кореневий елемент 
 * і масив згенерованих елементів рядків.
 * * @param {Array<object>} tasks - Масив об'єктів завдань.
 * @returns {{root: HTMLElement, elements: Array<HTMLElement>}} Об'єкт з коренем DOM та масивом елементів.
 */
function TasksTable(tasks) {
    // Масив для збору згенерованих елементів рядків (<tr>)
    const generatedElements = [];

    if (!Array.isArray(tasks) || tasks.length === 0) {
        const p = document.createElement('p');
        p.textContent = "Немає завдань для відображення.";
        p.classList.add('alert', 'alert-info', 'mt-3');
        // Повертаємо, але коренем буде <p>, а elements — пустий масив
        return { root: p, elements: [] }; 
    }

    // 1. Створення елементів таблиці
    const table = document.createElement('table');
    table.classList.add('table', 'table-hover', 'table-striped', 'table-bordered', 'mt-3');
    
    const thead = document.createElement('thead');
    thead.classList.add('table-dark');
    const headerRow = document.createElement('tr');
    
    // Заголовки, які ми відображаємо
    const headers = {
        title: 'Завдання',
        section: 'Розділ',
        estimatedTime: 'Час (хв)',
        completionCount: 'Виконано',
        lastCompletedAt: 'Останнє виконання',
        isArchived: 'Архів'
    };
    
    // Додавання колонок заголовка
    Object.values(headers).forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // 2. Створення тіла таблиці та рядків
    const tbody = document.createElement('tbody');
    const fragment = document.createDocumentFragment();

    tasks.forEach(task => {
        const row = document.createElement('tr');
        row.dataset.uuid = task.uuid; // Додаємо UUID як data-атрибут для зручного пошуку
        
        // Стилізація рядків
        if (task.isArchived) {
            row.classList.add('table-secondary');
        } else if (task.section === 'blockers') {
             row.classList.add('table-danger');
        }

        // Заповнення комірок
        Object.keys(headers).forEach(key => {
            const cell = document.createElement('td');
            let cellValue = task[key];

            switch (key) {
                case 'section':
                    cellValue = cellValue.charAt(0).toUpperCase() + cellValue.slice(1);
                    break;
                case 'lastCompletedAt':
                    cellValue = formatTime(cellValue);
                    break;
                case 'isArchived':
                    cellValue = task.isArchived ? '✅' : '—';
                    break;
                case 'title':
                    cell.style.fontWeight = 'bold';
                    break;
            }
            
            cell.textContent = cellValue;
            row.appendChild(cell);
        });
        
        fragment.appendChild(row);
        // ЗБІР ЗГЕНЕРОВАНИХ ЕЛЕМЕНТІВ
        generatedElements.push(row); 
    });

    tbody.appendChild(fragment); 
    table.appendChild(tbody);

    // 3. Повернення об'єкта
    return {
        root: table,
        elements: generatedElements
    };
}

// ====================================================================
// ВИКЛИК ФУНКЦІЇ ТА ВИКОРИСТАННЯ
// ====================================================================

const tableComponent = TasksTable(fakeTasksData);

// a) Вставка в DOM через ключ 'root'
document.body.appendChild(tableComponent.root);
console.log(tableComponent.elements)

// b) Додавання слухача подій до всіх рядків через ключ 'elements'
tableComponent.elements.forEach(row => {
    // Додаємо слухача кліку, щоб, наприклад, відкрити деталі задачі
    row.addEventListener('click', (event) => {
        const uuid = event.currentTarget.dataset.uuid;
        console.log(`Клік по завданню з UUID: ${uuid}`);
        // Тут можна додати логіку для виділення рядка
        event.currentTarget.classList.toggle('table-warning');
    });
});


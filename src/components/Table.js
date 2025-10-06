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




/////////////////

/**
 * Створює основну структуру таблиці (<thead>, <tbody>) 
 * використовуючи універсальну функцію createDomElement.
 * * @param {Array<string>} headers - Масив назв колонок для заголовка.
 * @returns {HTMLElement} Кореневий елемент <table>.
 */
function createTableStructure(headers) {
    // Параметри для всіх елементів
    const baseOptions = { scope: 'table-comp', class: 'table' };

    // 1. Створення елемента <table>
    const table = createDomElement('table', {
        ...baseOptions, // Копіюємо базові параметри
        class: ['table', 'table-hover', 'table-striped', 'mt-4'], // Додаємо класи Bootstrap
        id: 'main-data-table'
    });

    // 2. Створення елемента <thead>
    const thead = createDomElement('thead', {
        ...baseOptions,
        class: 'table-dark'
    });

    // 3. Створення рядка заголовка <tr>
    const headerRow = createDomElement('tr', baseOptions);

    // 4. Створення колонок заголовка <th> (цикл)
    headers.forEach((headerText, index) => {
        const th = createDomElement('th', {
            scope: 'header-col',
            id: `col-${index}`,
            textContent: headerText
        });
        headerRow.appendChild(th);
    });

    // Вкладення заголовка: <thead> -> <tr> -> [<th>, <th>...]
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // 5. Створення елемента <tbody>
    // Ми не додаємо нічого всередину tbody, він залишається порожнім для подальшого наповнення
    const tbody = createDomElement('tbody', baseOptions);
    table.appendChild(tbody);

    return table;
}

// ====================================================================
// ПРИКЛАД ВИКОРИСТАННЯ
// ====================================================================

// Визначення заголовків
const tableHeaders = ['Завдання', 'Розділ', 'Час (хв)', 'Виконано'];

// Створення всієї структури
const myTable = createTableStructure(tableHeaders);

// Додавання таблиці до DOM
document.body.appendChild(myTable);

console.log('Створено базову структуру таблиці з <thead> та порожнім <tbody>.');
console.log(myTable.outerHTML);


/**
 * Додає рядки до тіла (<tbody>) існуючої таблиці.
 * * @param {HTMLElement} tableElement - Кореневий елемент <table>, створений раніше.
 * @param {Array<object>} tasks - Масив об'єктів завдань для відображення.
 * @param {function} createDomElement - Ваша універсальна функція-будівельник DOM.
 * @returns {Array<HTMLElement>} Масив згенерованих елементів рядків (<tr>).
 */
function addRowsToTable(tableElement, tasks, createDomElement) {
    if (!tableElement || tableElement.tagName !== 'TABLE') {
        console.error("Помилка: Необхідно передати валідний елемент <table>.");
        return [];
    }
    if (!Array.isArray(tasks) || tasks.length === 0) {
        console.warn("Попередження: Немає даних для додавання рядків.");
        return [];
    }

    // Знаходимо <tbody>, щоб додати до нього рядки
    const tbody = tableElement.querySelector('tbody');
    if (!tbody) {
        console.error("Помилка: Таблиця не містить елемента <tbody>.");
        return [];
    }

    const generatedRows = [];
    // Використовуємо DocumentFragment для пакетної вставки (ефективність!)
    const fragment = document.createDocumentFragment();

    // Визначаємо ключі даних, які відповідають порядку в заголовку (як було раніше)
    const dataKeys = ['title', 'section', 'estimatedTime', 'completionCount', 'lastCompletedAt', 'isArchived'];

    tasks.forEach(task => {
        // 1. Створення рядка <tr>
        const row = createDomElement('tr', {
            scope: 'task-row',
            id: task.uuid,
            // Додаємо data-атрибут для ідентифікації
            // У чистій функції це потребує додаткової логіки, але ID достатньо
        });

        // Стилізація рядків
        if (task.isArchived) {
            row.classList.add('table-secondary');
        } else if (task.section === 'blockers') {
            row.classList.add('table-danger');
        }

        // 2. Створення комірок <td> (цикл)
        dataKeys.forEach(key => {
            let value = task[key];
            
            // Логіка форматування, як у попередньому прикладі
            if (key === 'section') {
                value = value.charAt(0).toUpperCase() + value.slice(1);
            } else if (key === 'lastCompletedAt') {
                value = formatTime(value); // Використовуємо функцію formatTime, визначену раніше
            } else if (key === 'isArchived') {
                value = value ? '✅' : '—';
            }
            
            // Створення комірки <td>
            const cell = createDomElement('td', {
                scope: `${task.uuid}_col`,
                class: `col-${key}`,
                textContent: value
            });
            
            // Якщо комірка містить назву, зробимо її інтерактивною
            if (key === 'title') {
                cell.style.fontWeight = 'bold';
                cell.style.cursor = 'pointer'; 
                // Додаємо простий слухач подій
                cell.addEventListener('click', () => {
                    console.log(`Натиснуто завдання: ${task.title} (UUID: ${task.uuid})`);
                    row.classList.toggle('table-info'); // Виділення рядка
                });
            }
            
            row.appendChild(cell);
        });

        // Додаємо ряд до фрагмента та масиву результатів
        fragment.appendChild(row);
        generatedRows.push(row);
    });

    // Фінальна дія: пакетна вставка в DOM (один Reflow/Repaint)
    tbody.appendChild(fragment);

    return generatedRows;
}

// ====================================================================
// ПРИКЛАД ВИКОРИСТАННЯ
// ====================================================================

document.body.appendChild(myTable);

// 2. Додаємо рядки, використовуючи функцію та фейкові дані
const newRows = addRowsToTable(myTable, fakeTasksData, createDomElement);

console.log(`Додано ${newRows.length} нових рядків до таблиці.`);
// Тепер можна працювати з масивом нових рядків, наприклад:
// newRows[0].style.backgroundColor = 'yellow';
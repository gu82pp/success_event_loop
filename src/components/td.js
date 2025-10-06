/**
 * Генерує DOM-елемент <td> з розширеними параметрами та обробкою подій.
 *
 * @param {object} options - Об'єкт параметрів комірки.
 * @param {string} options.scope - Обов'язковий префікс для формування ID.
 * @param {string} [options.id] - Унікальний ідентифікатор комірки (буде об'єднаний з scope).
 * @param {string|Array<string>} [options.classNames] - Масив класів CSS для елемента
 * @param {string} [options.textContent] - Текстовий вміст комірки.
 * @param {object} [options.actions] - Об'єкт, де ключ — назва події, а значення — функція-обробник.
 * @returns {HTMLTableCellElement|null} Створений елемент <td> або null у разі критичної помилки.
 */
function createTableCell(options) {
    // 1. ПЕРЕВІРКА ОБОВ'ЯЗКОВИХ ПАРАМЕТРІВ ТА ЗАХИСТ
    if (!options || typeof options !== 'object') {
        console.error("Помилка: Функція createTableCell вимагає об'єкт параметрів.");
        return null;
    }

    const { scope, id, classNames, textContent, actions } = options;

    if (!scope || typeof scope !== 'string') {
        console.error("Помилка: Параметр 'scope' є обов'язковим і має бути рядком.");
        return null;
    }

    // 2. СТВОРЕННЯ ЕЛЕМЕНТА
    const cell = document.createElement('td');

    // 3. ФОРМУВАННЯ ТА ВСТАНОВЛЕННЯ ID
    let finalId;
    if (id && typeof id === 'string') {
        finalId = `${scope}_${id}`;
    } else {
        // Використовуємо Math.random для генерації простого UUID-подібного рядка
        const randomPart = generateSafeID();
        finalId = `${scope}_${randomPart}`;
        if (id !== undefined) {
            //  console.warn(`Попередження: Параметр 'id' має бути рядком, згенеровано випадковий ID: ${finalId}`);
        }
    }
    cell.id = finalId;

    // 4. ВСТАНОВЛЕННЯ КЛАСІВ
    if (classNames) {
        if (typeof classNames === 'string') {
            // Якщо рядок, додаємо його
            cell.classList.add(...classNames.split(' ').filter(c => c));
        } else if (Array.isArray(classNames)) {
            // Якщо масив, додаємо всі елементи
            cell.classList.add(...classNames);
        } else {
            console.warn("Попередження: Параметр 'class' має бути рядком або масивом рядків. Класи не встановлено.", options);
        }
    }

    // 5. ВСТАНОВЛЕННЯ ТЕКСТОВОГО ВМІСТУ
    if (textContent !== undefined && textContent !== null) {
        cell.textContent = String(textContent);
    }

    // 6. ПРИКРІПЛЕННЯ СЛУХАЧІВ ПОДІЙ (ACTIONS)
    if (actions && typeof actions === 'object') {
        Object.entries(actions).forEach(([eventName, handler]) => {
            // Перевірка: назва події має бути рядком, а обробник — функцією
            if (typeof eventName === 'string' && typeof handler === 'function') {
                cell.addEventListener(eventName, handler);
            } else {
                console.error(`Помилка Actions: Обробник для події '${eventName}' не є функцією або назва події не є рядком.`);
            }
        });
    }

    // 7. ПОВЕРНЕННЯ СТВОРЕНОГО ЕЛЕМЕНТА
    return cell;
}

// ====================================================================
// ПРИКЛАДИ ВИКОРИСТАННЯ
// ====================================================================

// 1. Базова комірка з текстом та обов'язковим scope
// const simpleCell = createTableCell({
//     scope: 'task',
//     textContent: 'Task Title'
// });
// console.log('1. Проста комірка:', simpleCell.outerHTML, `ID: ${simpleCell.id}`);


// // 2. Комірка з усіма параметрами та діями
// function handleCellClick(event) {
//     console.log(`Клік по комірці з ID: ${event.currentTarget.id}`);
// }

// const actionCell = createTableCell({
//     scope: 'data',
//     id: 'status-cell',
//     class: ['status-active', 'col-md-2'],
//     textContent: 'Active',
//     actions: {
//         'click': handleCellClick,
//         'mouseenter': () => console.log('Наведення миші')
//     }
// });
// console.log('2. Комірка з діями:', actionCell.outerHTML, `ID: ${actionCell.id}`);

// // 3. Комірка, що генерує помилку (відсутній scope)
// const errorCell = createTableCell({
//     textContent: 'Missing Scope'
//     // scope відсутній
// });
// console.log('3. Комірка з помилкою:', errorCell); 

// // 4. Комірка з неправильним ID (генерується випадковий ID)
// const randomIdCell = createTableCell({
//     scope: 'list',
//     id: 12345, // Число замість рядка
//     textContent: 'Random ID Test'
// });
// console.log('4. Комірка з випадковим ID:', randomIdCell.outerHTML, `ID: ${randomIdCell.id}`);

// // Додавання елементів до DOM для тестування (якщо ви запускаєте в браузері)
// document.body.appendChild(simpleCell);
// document.body.appendChild(actionCell);
// document.body.appendChild(randomIdCell);       
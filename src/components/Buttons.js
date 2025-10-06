/**
 * Створює універсальний елемент кнопки з інтегрованим лічильником (Badge) 
 * та слухачем події 'click'.
 *
 * @param {object} options - Об'єкт параметрів.
 * @param {string} options.title - Основний текст кнопки. (Обов'язковий)
 * @param {number} [options.count=0] - Число для бейджа. (Необов'язковий, за замовчуванням 0)
 * @param {function} [options.click] - Посилання на функцію-обробник події кліку. (Необов'язковий)
 * @returns {HTMLButtonElement} Створений елемент кнопки.
 */
function Button(options) {
    // 1. Деструктуризація та надання значень за замовчуванням
    // Захист від відсутності полів:
    // - Якщо title відсутній, використовуємо 'Unnamed Button'.
    // - Якщо count відсутній, використовуємо 0.
    const { 
        title = 'Unnamed Button', 
        count = 0, 
        click 
    } = options || {}; // 'options || {}' захищає від виклику без параметрів

    // 2. Створення основного елемента <button>
    const button = document.createElement('button');
    button.type = 'button'; 
    button.classList.add('btn', 'btn-success', 'me-2', 'realistic-button'); 

    // 3. Створення елемента для тексту
    const textSpan = document.createElement('span');
    textSpan.textContent = title;
    
    // 4. Створення елемента для бейджа (лічильника)
    const badgeSpan = document.createElement('span');
    badgeSpan.classList.add('badge', 'text-bg-light', 'rounded-pill', 'ms-2'); 
    badgeSpan.textContent = count.toString(); 

    // 5. Вкладення елементів
    button.appendChild(textSpan);
    button.appendChild(badgeSpan);
    
    // 6. Додавання слухача події (Захист від відсутності click)
    // Перевіряємо, чи переданий параметр 'click' і чи є він функцією
    if (typeof click === 'function') {
        button.addEventListener('click', click);
    } else if (click !== undefined) {
        // Додаткове попередження, якщо переданий параметр не є функцією, але існує
        console.warn('Button: Параметр "click" було передано, але він не є функцією.');
    }

    return button;
}


// ====================================================================
// Приклад використання
// =================================s===================================


let taskCount = 5;

// Функція-обробник, яку ми передаємо в опціях
function handleTaskClick(event) {
    taskCount++;
    console.log(`Кнопку натиснуто! Нова кількість завдань: ${taskCount}`);
    
    // У реальному застосунку потрібно було б оновити DOM-елемент, 
    // щоб відобразити новий лічильник.
    // Наприклад: event.currentTarget.querySelector('.badge').textContent = taskCount;
}

// 1. Кнопка з обробником кліку
const taskButton = Button({ 
    title: 'Tasks', 
    count: 5, 
    click: handleTaskClick // Передаємо посилання на функцію
});

// 2. Кнопка без обробника (із значеннями за замовчуванням для count)
const emptyButton = Button({ 
    title: 'New Feature'
    // count = 0 за замовчуванням
});

// 3. Кнопка з пропущеним title (використовує 'Unnamed Button')
const incompleteButton = Button({});


document.body.appendChild(taskButton);
document.body.appendChild(emptyButton);
document.body.appendChild(incompleteButton);
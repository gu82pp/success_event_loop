/**
 * Універсальна функція для створення будь-якого DOM-елемента з базовими і розширеними атрибутами.
 * * МОЖЛИВІ ТЕГИ: div, span, p, h1-h6, section, article, li, ul, ol, button, 
 * a (потрібен href), img (потрібен src), input (потрібен type) та td/th/tr.
 *
 * @param {string} tagName - Обов'язкова назва HTML-тегу (наприклад, 'div', 'button', 'a').
 * @param {object} options - Об'єкт параметрів елемента.
 * @param {string} options.scope - Обов'язковий префікс для формування ID.
 * @param {string} [options.id] - Унікальний ідентифікатор елемента.
 * @param {string|Array<string>} [options.class] - Класи CSS для елемента.
 * @param {string} [options.textContent] - Текстовий вміст елемента (для більшості тегів).
 * @param {string} [options.value] - Значення для елементів форм (input, button).
 * @param {string} [options.href] - URL для тега <a>.
 * @param {string} [options.src] - Джерело для тегів <img>, <script>, <audio> тощо.
 * @param {string} [options.type] - Тип для тегів <input> або <button>.
 * @param {object} [options.actions] - Об'єкт, де ключ — назва події, а значення — функція-обробник.
 * @returns {HTMLElement|null} Створений елемент DOM або null у разі критичної помилки.
 */
function createDomElement(tagName, options) {
    // 1. ПЕРЕВІРКА КРИТИЧНИХ ПАРАМЕТРІВ
    if (!tagName || typeof tagName !== 'string') {
        console.error("Критична помилка: Необхідно вказати валідний рядок tagName (наприклад, 'div').");
        return null;
    }
    
    // Захист об'єкта options
    const safeOptions = options || {};

    if (!safeOptions.scope || typeof safeOptions.scope !== 'string') {
        console.error(`Критична помилка: Для елемента <${tagName}> обов'язково вкажіть параметр 'scope'.`);
        return null;
    }
    
    // 2. СТВОРЕННЯ ЕЛЕМЕНТА
    const element = document.createElement(tagName);

    // Деструктуризація для зручності
    const { 
        scope, 
        id, 
        class: classNames, 
        textContent, 
        actions, 
        value, 
        href, 
        src, 
        type 
    } = safeOptions;

    // 3. ФОРМУВАННЯ ТА ВСТАНОВЛЕННЯ ID
    let finalId;
    if (id && typeof id === 'string') {
        finalId = `${tagName}_${scope}_${id}`;
    } else {
        const randomPart = generateSafeID();
        finalId = `${tagName}_${scope}_${randomPart}`;
    }
    element.id = finalId;

    // 4. ВСТАНОВЛЕННЯ КЛАСІВ
    if (classNames) {
        try {
            if (typeof classNames === 'string') {
                element.classList.add(...classNames.split(' ').filter(c => c));
            } else if (Array.isArray(classNames)) {
                element.classList.add(...classNames);
            }
        } catch (e) {
            console.warn(`Попередження: Невдалося встановити класи для <${tagName}>.`, e);
        }
    }

    // 5. ВСТАНОВЛЕННЯ СПЕЦИФІЧНИХ АТРИБУТІВ (НОВИЙ БЛОК)
    if (type !== undefined) element.setAttribute('type', type);
    if (href !== undefined) element.setAttribute('href', href);
    if (src !== undefined) element.setAttribute('src', src);
    if (value !== undefined) element.value = value; // Властивість value для форм
    
    // 6. ВСТАНОВЛЕННЯ ТЕКСТОВОГО ВМІСТУ
    if (textContent !== undefined && textContent !== null) {
        element.textContent = String(textContent);
    }
    
    // 7. ПРИКРІПЛЕННЯ СЛУХАЧІВ ПОДІЙ (ACTIONS)
    if (actions && typeof actions === 'object') {
        Object.entries(actions).forEach(([eventName, handler]) => {
            if (typeof handler === 'function') {
                element.addEventListener(eventName, handler);
            } else {
                console.error(`Помилка Actions: Обробник для події '${eventName}' у <${tagName}> не є функцією.`);
            }
        });
    }

    rememberElement(element);

    return element;
}

function rememberElement(element) {
    if (!element) return;
    World.Items[element.id] = {
        element: element,
        scope: element.scope,
    }
}

// ====================================================================
// ПРИКЛАДИ ВИКОРИСТАННЯ
// ====================================================================

// 1. Створення тегу <a> (потрібні href та textContent)
// const linkElement = createDomElement('a', {
//     scope: 'nav',
//     id: 'link-main',
//     class: 'nav-link',
//     textContent: 'Перейти на головну',
//     href: 'index.html',
//     actions: {
//         click: (e) => e.preventDefault()
//     }
// });
// document.body.appendChild(linkElement);


// // 2. Створення тегу <input> (потрібні type та value)
// const inputElement = createDomElement('input', {
//     scope: 'form',
//     class: ['form-control', 'mt-3'],
//     type: 'text',
//     value: 'Початкове значення',
//     actions: {
//         input: (e) => console.log('Введено:', e.target.value)
//     }
// });
// document.body.appendChild(inputElement);


// // 3. Створення тегу <img> (потрібен src)
// const imageElement = createDomElement('img', {
//     scope: 'ui',
//     id: 'logo',
//     src: 'logo.png',
//     class: 'img-fluid',
//     // img не використовує textContent, він буде проігноровано
// });
// document.body.appendChild(imageElement);

// console.log("Універсальні елементи додані до DOM.");
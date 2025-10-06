/* --- Початок файлу: ./Uuid.js --- */
/**
 * Генерує унікальний ID, використовуючи найкращий доступний метод:
 * 1. Спробує crypto.randomUUID() (довгий, криптографічно безпечний).
 * 2. Якщо недоступний, використовує Math.random() + toString(36) (короткий, швидкий).
 * * @param {boolean} [preferShort=false] - Якщо true, завжди повертає короткий ID, якщо доступний.
 * @returns {string} Унікальний або псевдоунікальний ID.
 */
function generateSafeID(preferShort = false) {
    // 1. Внутрішня функція для генерації короткого, псевдоунікального ID
    const generateShortID = () => {
        // Комбінація мітки часу та випадкового числа для кращої унікальності
        const timePart = Date.now().toString(36); 
        const randomPart = Math.random().toString(36).slice(2, 6);
        return `${timePart}-${randomPart}`;
    };

    if (preferShort) {
        // Якщо ми свідомо хочемо короткий ID АБО crypto недоступний
        return generateShortID();
    }

    // 2. Перевірка наявності нативного API
    const isCryptoAvailable = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function';

    if (preferShort || !isCryptoAvailable) {
        // Якщо ми свідомо хочемо короткий ID АБО crypto недоступний
        return generateShortID();
    }
    
    // 3. Використання найшвидшого нативного методу (якщо доступний і не вимагається короткий ID)
    if (isCryptoAvailable) {
        return crypto.randomUUID();
    }

    // Це має бути недосяжно, але як остання ланка безпеки
    return generateShortID(); 
}


/* --- Початок файлу: ./createDomElement.js --- */
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
        type,
        data 
    } = safeOptions;

    // 3. ФОРМУВАННЯ ТА ВСТАНОВЛЕННЯ ID
    let finalId;
    if (id && typeof id === 'string') {
        // console.log(" id", id)
        finalId = id;
        checkId(id)
    } else {
        const randomPart = generateSafeID();
        finalId = `${tagName}_${scope}_${randomPart}`;
        //  console.log("final id", finalId , safeOptions)
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

    rememberElement(element, scope, data);

    return element;
}

function rememberElement(element, scope, data = {}) {
    if (!element) return;
    World.Items[element.id] = {
        element: element,
        scope: scope,
    }
    World.ItemsData[element.id] = data;
}

function checkId(id) {
    if (World.Items[id]) {
        console.warn(`У DOM вже існує елемент з id ${id}. Це може призвести до помилок в роботі скриптів.`);
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

/* --- Початок файлу: ./debugger.js --- */
class Debugger
{
    static ENABLED = true;
    static MAX_TIMING_ENTRIES = 100; // Максимальна кількість записів часу виконання
    static Timimgs = []

    static logTime(label, executionTime, context = {}) {
        if (!this.ENABLED) return;
        this.Timimgs.push({ label, "time (ms)": executionTime, ...context });
        if (this.Timimgs.length > this.MAX_TIMING_ENTRIES) {
            this.Timimgs.shift(); // Видаляємо найстаріший запис
        }
    }

    static printTimings(params = {}) {
        if (!this.ENABLED) return;
        // console.table(this.Timimgs, params.fields);
    }
}


/* --- Початок файлу: ./memory.js --- */
/**
 * Повертає звіт про пам'ять, яку використовує JavaScript-рушій.
 * Примітка: Доступно лише у Chrome/Vivaldi/Edge.
 * @returns {object} Об'єкт з інформацією про пам'ять.
 */
function getJSMemoryUsage() {
    if (window.performance && window.performance.memory) {
        const memory = window.performance.memory;

        return {
            totalJSHeapSize: (memory.totalJSHeapSize / 1024 / 1024).toFixed(2), // Загальний об'єм купи, МБ
            usedJSHeapSize: (memory.usedJSHeapSize / 1024 / 1024).toFixed(2),   // Використаний об'єм купи, МБ
            jsHeapLimit: (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)      // Ліміт, МБ
        };
    }
    return null;
}

// const memory_stats = document.getElementById('memory_stats');
// showStats();
// setInterval(() => {
//     showStats();
// }, 1000);

// function showStats() {
//     if (memory_stats) {
//         memory_stats.textContent = `Використано пам'яті JS: ${getJSMemoryUsage().usedJSHeapSize} МБ`;
//     }
// }

/* --- Початок файлу: ./switchAnimation.js --- */
/**
 * 
 * @param {*} e - element
 * @param {*} a1 - array of classes to add
 * @param {*} a2 - array of classes to remove
 * @param {*} d - delay
 * @param {*} b1 - array of classes to add
 * @param {*} b2 - array of classes to remove
 */
function switchAnimation(e, a1, a2, d, b1, b2) {
    if(!e) return;
    if(!classesArrayIsValid(a1)) return;
    if(!classesArrayIsValid(a2)) return;
    if(!classesArrayIsValid(b1)) return;
    if(!classesArrayIsValid(b2)) return;
    for (let i = 0; i < a1.length; i++) { e.classList.add(a1[i]); }
    for (let i = 0; i < a2.length; i++) { e.classList.remove(a2[i]); }
    setTimeout(() => {
        for (let i = 0; i < b1.length; i++) { e.classList.add(b1[i]); }
        for (let i = 0; i < b2.length; i++) { e.classList.remove(b2[i]); }
    }, d);
}

function classesArrayIsValid(stringArray) {
  if (!Array.isArray(stringArray)) {
    console.error("Помилка: Вхідний аргумент повинен бути масивом.");
    return false; // Зупиняємо, якщо вхідний аргумент не масив
  }

  for (let i = 0; i < stringArray.length; i++) {
    const inputString = stringArray[i];

    if (typeof inputString !== 'string') {
      console.error(`Помилка: Елемент масиву з індексом ${i} не є рядком.`);
      return false; // Зупиняємо, якщо елемент масиву не є рядком
    }

    if (inputString.includes(" ")) {
      console.error(`Рядок "${inputString}" з індексом ${i} містить пробіл! Проблема з класом або ідентифікатором.`);
      return false; // Повертаємо false, якщо знайдено пробіл
    }
  }
  return true; // Повертаємо true, якщо все гаразд
}


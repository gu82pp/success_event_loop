function buildContentDOM() {
    // TODO: створити компонент з базовим шаблоном
    // Створення нового фрагменту
    const fragment = document.createDocumentFragment();
    fragment.appendChild(createSectionBlocks());
    return fragment;
}

/**
 * Створює три елементи <div> із заданими текстами та повертає їх 
 * у вигляді DocumentFragment.
 * * @param {function} createDomElement - Ваша універсальна функція-будівельник DOM.
 * @returns {DocumentFragment} Фрагмент, що містить усі три створені <div>.
 */
function createSectionBlocks() {
    // 1. Створення DocumentFragment для пакетної обробки
    const fragment = document.createDocumentFragment();

    // Дані для блоків
    const blockData = [
        { title: 'Blockers', class: 'text-danger d-block' },
        { title: 'Drivers', class: 'text-primary d-block', click: clickOnDriversBlock },
        { title: 'Accelerators', class: 'text-success d-none' }
    ];

    // Загальні параметри
    const baseOptions = { scope: 'section-block', class: 'p-3 border rounded mb-3' };

    // 2. Створення та додавання елементів
    blockData.forEach(data => {

        const actions = {};
        if(data.hasOwnProperty('click')) {
            actions.click = data.click;
        }

        const divBlock = createDomElement('div', {
            ...baseOptions,
            id: data.title.toLowerCase(), // id: blockers, drivers, accelerators
            textContent: data.title,
            class: [...baseOptions.class.split(' '), ...data.class.split(' ')], // Додаємо специфічний клас тексту
            actions: actions
        });
        
        fragment.appendChild(divBlock);
    });

    // 3. Повернення фрагмента
    return fragment;
}

// ====================================================================
// ПРИКЛАД ВИКОРИСТАННЯ
// ====================================================================

// [Примітка: Для роботи цього коду необхідно мати визначену функцію createDomElement]

// 1. Створення фрагмента
// const sectionBlocks = createSectionBlocks(createDomElement);

// 2. Вставка фрагмента в DOM
// document.body.appendChild(sectionBlocks); 

// console.log("Створено та вставлено три div-блоки.");

function clickOnDriversBlock() {
    console.log("clickOnDriversBlock");
}
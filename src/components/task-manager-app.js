/* --- Початок файлу: ./0_render.js --- */
function render() {
    const page = document.getElementById("page");
    const layout = buildHeaderCountentFooterOuter();
    const header = buildHeaderDOM()
    const content = buildContentDOM()
    const footer = buildFooterDOM() // це можна і відкласти на пізніше

    // Створення нового фрагменту
    const fragment = document.createDocumentFragment();

    // Додавання елементів до фрагменту
    fragment.appendChild(header);
    fragment.appendChild(content);
    fragment.appendChild(footer);

    layout.appendChild(fragment);

    // Вставка фрагменту в DOM
    page.appendChild(layout);
    return false;
}
render()
console.log("remembered", World.Items, World.ItemsData)

/* --- Початок файлу: ./1_buildHeaderCountentFooterOuter.js --- */
function buildHeaderCountentFooterOuter() {
    // 1. Створення DocumentFragment (легкий контейнер у пам'яті)
    const fragment = document.createDocumentFragment();

    // Загальні параметри для всіх колонок
    const baseOptions = { scope: 'layout-column', class: 'col' };

    // 2. Створення елементів за допомогою універсальної функції
    
    // Створення <div id="header"></div>
    const headerDiv = createDomElement('div', {
        ...baseOptions,
        id: 'header'
    });

    // Створення <div id="content"></div>
    const contentDiv = createDomElement('div', {
        ...baseOptions,
        id: 'content'
    });

    // Створення <div id="footer"></div>
    const footerDiv = createDomElement('div', {
        ...baseOptions,
        id: 'footer'
    });

    // 3. Додавання елементів до фрагмента (все ще в пам'яті)
    fragment.appendChild(headerDiv);
    fragment.appendChild(contentDiv);
    fragment.appendChild(footerDiv);

    // 4. Повернення фрагмента
    return fragment;
}


/* --- Початок файлу: ./2_buildHeaderDOM.js --- */
function buildHeaderDOM() {

    // Створення нового фрагменту
    const fragment = document.createDocumentFragment();

    // 1. Створення внутрішнього елемента <a> (Посилання)
    const linkElement = createDomElement('a', {
        scope: 'app-link', // Обов'язковий scope
        textContent: 'Success Event Loop',
        href: 'https://gu82pp.github.io/success_event_loop/', // Специфічний атрибут для <a>
    });

    // 2. Створення зовнішнього елемента <h1>
    const headerElement = createDomElement('h1', {
        scope: 'app-header', // Обов'язковий scope
        class: ['mb-4', 'text-center'], // Класи Bootstrap для стилізації
    });

    // 3. Вкладення елементів: <h1> вкладає <a>
    headerElement.appendChild(linkElement);

    fragment.appendChild(headerElement);
    fragment.appendChild(buildHeaderButtonOuter());

    return fragment;
}

/* --- Початок файлу: ./3_buildHeaderButtonOuter.js --- */
function buildHeaderButtonOuter() {

    // 1. Створення внутрішнього елемента (Контейнер для кнопок)
    const innerDiv = createDomElement('div', {
        scope: 'ui-component', // Обов'язковий scope
        id: 'buttons-container', // Фіксований ID для подальшого використання
        class: ['col', 'd-flex', 'justify-content-start'], // Класи Bootstrap для вирівнювання
    });

    // 2. Створення зовнішнього елемента (Контейнер з відступом)
    const outerDiv = createDomElement('div', {
        scope: 'layout', // Обов'язковий scope
        class: 'mb-5', // Клас Bootstrap для великого нижнього відступу
    });

    // 3. Вкладення елементів: Зовнішній <div> вкладає Внутрішній <div>
    outerDiv.appendChild(innerDiv);
    innerDiv.appendChild(createThreeButtons());

    return outerDiv;
}

// ПРИПУЩЕННЯ: Функція createDomElement(tagName, options) існує.

/**
 * Спрощена версія функції Button, що використовує createDomElement.
 */
function HeaderButton({ title, count = 0, click, badgeId }) {
    // Створення зовнішньої кнопки
    const button = createDomElement('button', {
        scope: 'btn-comp',
        class: ['btn', 'btn-success', 'me-2', 'realistic-button'],
        type: 'button',
        actions: { click }
    });

    // Створення елемента для тексту (title)
    const textSpan = createDomElement('span', {
        scope: 'btn-title',
        class: 'button-title',
        textContent: title
    });
    
    // Створення елемента для бейджа (count)
    const badgeSpan = createDomElement('span', {
        id: badgeId,
        scope: 'badge',
        class: ['badge', 'text-bg-light', 'rounded-pill', 'ms-2'],
        textContent: count.toString(),
        data: {
            count: count
        }
    });

    console.log("badgeSpan", badgeSpan, badgeId)
    
    // Вкладення
    button.appendChild(textSpan);
    button.appendChild(badgeSpan);

    return button;
}

/**
 * Створює три кнопки і додає їх до DOM-контейнера з ID 'buttons-container'.
 * * @param {function} Button - Функція-будівельник кнопки.
 */
function createThreeButtons() {

    // Дані для кнопок
    const buttonData = [
        { title: 'Blockers', count: 5, badgeId: 'blockers-count', click: clickOnBlockersButton },
        { title: 'Drivers', count: 12, badgeId: 'drivers-count', click: clickOnDriversButton, },
        { title: 'Accelerators', count: 0, badgeId: 'accelerators-count', click: clickOnAcceleratorsButton }
    ];

    const fragment = document.createDocumentFragment();

    // Створення та додавання кнопок
    buttonData.forEach(data => {
        // Виклик універсальної функції Button
        const button = HeaderButton({
            title: data.title,
            count: data.count,
            click: data.click ? data.click : () => {},
            badgeId: data.badgeId
        });
        fragment.appendChild(button);
    });

    // Пакетна вставка всіх кнопок
    return fragment;

}

function updateBadge(id, count) {
    const element = World.getElement(id);
    if (!element) {
        console.error(`Element with id ${id} not found.`);
        return;
    }
    console.log("updateBadge", element, id, count)
    World.ItemsData[element.id].count = count;
    element.textContent = count.toString();
}

function getBadgeCount(id) {
    const element = World.getElement(id);
    if (!element) {
        console.error(`Element with id ${id} not found.`);
        return;
    }

    return World.ItemsData[element.id].count;
}

function clickOnDriversButton() {
    const count = getBadgeCount('drivers-count');
    updateBadge('drivers-count', count + 1);
}

function clickOnAcceleratorsButton() {
    const count = getBadgeCount('accelerators-count');    
    updateBadge('accelerators-count', count + 1);    
}   

function clickOnBlockersButton() {
    const count = getBadgeCount('blockers-count');
    updateBadge('blockers-count', count + 1);        
}

/* --- Початок файлу: ./4_buildContentDOM.js --- */
function buildContentDOM() {
    // TODO: створити компонент з базовим шаблоном
    // Створення нового фрагменту
    const fragment = document.createDocumentFragment();
    return fragment;
}

/* --- Початок файлу: ./5_buildFooterDOM.js --- */
function buildFooterDOM() {
    // TODO: створити компонент з базовим шаблоном
        // Створення нового фрагменту
    const fragment = document.createDocumentFragment();
    return fragment;
}


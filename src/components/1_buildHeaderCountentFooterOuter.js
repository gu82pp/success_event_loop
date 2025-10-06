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

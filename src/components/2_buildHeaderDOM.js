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
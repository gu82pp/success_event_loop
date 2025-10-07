function buildFooterDOM() {
    // TODO: створити компонент з базовим шаблоном
        // Створення нового фрагменту
    const fragment = document.createDocumentFragment();
    fragment.appendChild(createMemoryUsageBlock());
    return fragment;
}

/**
 * Створює елемент <div> для відображення використання пам'яті у футері.
 * * @param {function} createDomElement - Ваша універсальна функція-будівельник DOM.
 * @returns {HTMLElement} Створений елемент <div>.
 */
function createMemoryUsageBlock() {
    const memoryText = `Memory usage: ${getJSMemoryUsage().usedJSHeapSize} / ${getJSMemoryUsage().totalJSHeapSize} MB`;

    // Створення <div>
    const memoryDiv = createDomElement('div', {
        scope: 'footer-status', // Обов'язковий scope
        id: 'memory-indicator', // ID для подальшого оновлення
        class: ['p-2', 'bg-light', 'text-muted', 'text-end', 'small'], // Класи Bootstrap для стилізації
        textContent: memoryText
    });

    return memoryDiv;
}

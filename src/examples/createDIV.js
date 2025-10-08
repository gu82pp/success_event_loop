/**
 * 
 * * МОЖЛИВІ ТЕГИ: 
 * div, span, p, h1-h6, section, article, li, ul, ol, button, 
 * a (потрібен href), img (потрібен src), input (потрібен type)
 * td/th/tr.
 *
 * @param {string} [options.id] - Унікальний ідентифікатор елемента.
 * @param {string|Array<string>} [options.class] - Класи CSS для елемента.
 * @param {string} [options.textContent] - Текстовий вміст елемента (для більшості тегів).
 * @param {object} [options.actions] - Об'єкт, де ключ — назва події, а значення — функція-обробник.
 * @returns {HTMLElement|null} Створений елемент DOM або null у разі критичної помилки.
 */
const divBlock = createDomElement('div', {
    id: "blockers",
    class: 'border',
    textContent: data.title,
    actions: {
        click: clickOnBlockersButton
    }
});
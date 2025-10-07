/**
 * @returns {DocumentFragment}
 */
function pageFragment() {
    // Функція завжди має повертати фрагмент для вставки в DOM
    const fragment = document.createDocumentFragment();
    
    const baseOptions = { scope: 'layout-column', class: 'col' };
    
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

    // Дочірні елементи ГАРАНТОВАНО будуть додані перед тим, як виведеться фрагмент на екран (браузер блокується!)
    headerDiv.appendChild(buildHeaderDOM());
    contentDiv.appendChild(buildContentDOM());
    footerDiv.appendChild(buildFooterDOM());

    // Додавання елементів до фрагменту
    fragment.appendChild(headerDiv);
    fragment.appendChild(contentDiv);
    fragment.appendChild(footerDiv);

    return fragment;
}

function render() {
    
    const page = document.getElementById("page");
    page.appendChild(pageFragment());
}
render()
// ShowDOMRenderTime()
console.log("_ items", _.items(), "_ eventsList", _.events());


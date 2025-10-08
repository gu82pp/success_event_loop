/**
 * @returns {DocumentFragment}
 */
function pageFragment() {
    const fragment = document.createDocumentFragment();
    
    const headerDiv = createDomElement('div', {
        id: 'header',
        class: 'col',
    });

    const contentDiv = createDomElement('div', {
        id: 'content',
        class: 'col',
    });

    const footerDiv = createDomElement('div', {
        id: 'footer',
        class: 'col',
    });

    headerDiv.appendChild( safeFragment(headerFragment) );
    contentDiv.appendChild( safeFragment(contentFragment) );
    footerDiv.appendChild( safeFragment(buildFooterDOM) );

    fragment.appendChild(headerDiv);
    fragment.appendChild(contentDiv);
    fragment.appendChild(footerDiv);

    return fragment;
}

function render() {
    const page = document.getElementById("page");
    page.appendChild( safeFragment(pageFragment) );
}

render()


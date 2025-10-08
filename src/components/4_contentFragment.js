function contentFragment() {
    const fragment = document.createDocumentFragment();

    const outer = divFragment('mt-3 mb-3');

    const blockersBlock = createDomElement('div', {
        id: 'blockers',
        textContent: 'Blockers',
        class: 'p-2 border rounded text-danger d-blok',
    });
    
    const driversBlock = createDomElement('div', {
        id: 'drivers',
        textContent: 'Drivers',
        class: 'p-2 border rounded text-primary d-none',
        actions: {
            click: clickOnDriversBlock
        }
    });
    
    const acceleratorsBlock = createDomElement('div', {
        id: 'accelerators',
        textContent: 'Accelerators',
        class: 'p-2 border rounded text-success d-none'
    });

    outer.appendChild(blockersBlock);
    outer.appendChild(driversBlock);
    outer.appendChild(acceleratorsBlock);

    fragment.appendChild(outer);
    return fragment;
}

function clickOnDriversBlock() {
    console.log("clickOnDriversBlock");
}
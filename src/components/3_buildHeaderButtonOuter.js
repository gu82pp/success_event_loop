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

    // console.log("badgeSpan", badgeSpan, badgeId)
    
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
    const item = World.item(id)
    if (!item) {
        console.error(`Element with id ${id} not found.`);
        return;
    }
    item.data.count = count;
    item.element.textContent = count.toString();
}

function getBadgeCount(id) {
    const item = World.item(id)
    if (!item) {
        console.error(`World item with id ${id} not found.`);
        return;
    }

    return item.data.count;
}

function clickOnDriversButton() {
    const item = World.element("drivers");
    // item.remove()
    World.destroyItem('drivers');
    console.log("_ items", _.items(), "_ eventsList", _.events());

    // return false
    const count = getBadgeCount('drivers-count');
    updateBadge('drivers-count', count + 1);
    showDrivers();
}  

function clickOnAcceleratorsButton() {
    const count = getBadgeCount('accelerators-count');    
    updateBadge('accelerators-count', count + 1);  
    showAccelerators()   
}   

function clickOnBlockersButton() {
    const count = getBadgeCount('blockers-count');
    updateBadge('blockers-count', count + 1);    
    showBlockers()
}

function showDrivers() {
    const driversBlock = World.element('drivers');
    if (driversBlock) {
        driversBlock.classList.remove('d-none');
        hideAccelerators();
        hideBlockers()
    }
}

function showAccelerators() {
    const acceleratorsBlock = World.element('accelerators');
    if (acceleratorsBlock) {
        acceleratorsBlock.classList.remove('d-none');
        hideDrivers();
        hideBlockers()
    }
}   

function showBlockers() {
    const blockersBlock = World.element('blockers');
    if (blockersBlock) {
        blockersBlock.classList.remove('d-none');
        hideDrivers();
        hideAccelerators()
    }
}

function hideDrivers() {
    const driversBlock = World.element('drivers');
    if (driversBlock) {
        driversBlock.classList.add('d-none');
    }
}

function hideAccelerators() {
    const acceleratorsBlock = World.element('accelerators');
    if (acceleratorsBlock) {
        acceleratorsBlock.classList.add('d-none');
    }
}   

function hideBlockers() {
    const blockersBlock = World.element('blockers');
    if (blockersBlock) {
        blockersBlock.classList.add('d-none');
    }
}
/**
 * @returns {DocumentFragment}
 */
function WhatIsCreatedFragment() {
    const fragment = document.createDocumentFragment();
    const element = createDomElement('div', {});

    fragment.appendChild(element);

    return fragment;
}

/**
 * Правила:
 * - Не треба намагатися скорочувати код, це лише заплутає. Оголошуй створення DOM-елементів явно. Імперативно.
 * - Слухач слід привязувати одразу при створенні, це впливає на швидкість
 * - Функції слід називати з постфіксом Fragment
 * - Дочірні елементи ГАРАНТОВАНО будуть додані перед тим, як виведеться фрагмент на екран (браузер блокується!). Тому думай про порядок виконання.
 */
function contentFragment() {
    const fragment = document.createDocumentFragment();

    const blockersBlock = createDomElement('div', {
        id: 'blockers',
        textContent: 'Blockers',
        class: 'p-2 border rounded text-danger d-blok',
    });
    // blockersBlock.appendChild(otherFragment());
    
    const driversBlock = createDomElement('div', {
        id: 'drivers',
        textContent: 'Drivers',
        class: 'p-2 border rounded text-primary d-block ',
        actions: {
            click: clickOnDriversBlock
        }
    });
    
    fragment.appendChild(blockersBlock);
    fragment.appendChild(driversBlock);

    return fragment;
}

/**
 * Типовий фрагмент для вставки між елементами.
 * - Повертаємо завжди 1 елемент (node) з типовим дизайном. Щоб не заміняти в різних місцях
 */
function divBetweenFragment() {
    return createDomElement('div', {
        class: 'd-flex justify-content-between'
    });
}
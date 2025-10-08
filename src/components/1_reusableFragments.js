/**
 * Типовий фрагмент для вставки між елементами.
 * @returns {DocumentFragment}
 */
function divFragment(className = '') {
    // TODO: якщо повертати фрагмент, то в нього неможливо пізніше додати
    return outerDiv = createDomElement('div', {
        class: className
    });
}

/**
 * Типовий фрагмент для вставки між елементами.
 * @returns {DocumentFragment}
 */
function divBetweenFragment() {
    return createDomElement('div', {
        class: 'd-flex justify-content-between'
    });
}
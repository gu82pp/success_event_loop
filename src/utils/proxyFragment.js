/**
 * Це проксі функція, яка дозволяє програмі не падати, в разі якщо якоїсь функції немає
 * @param {+} func 
 * @param {*} args 
 * @returns 
 */
function safeFragment(func, args = {}) {
    try {
        return func(args);
    }   catch (error) {
        console.warn("Помилка в функції: ", error);
        return document.createDocumentFragment();
    }
}
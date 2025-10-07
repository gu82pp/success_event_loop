/**
 *      TODO: 
 *      - Опиши порядок завантеження скриптів у Loader.js
 *      - Оброби помилки
 *      - Стеж за памяттю, щоб не було витоків
 */
class World
{
    /**
     * Schema:
     * {
     *      id: {
     *          element: domElement,
     *          scope: string,
     *          data: object,
     *          events: array // array of { eventName: string, handler: function }
     *      }
     * }
     */
    static Items = {};
 
    static items() {
        // TODO: що покаже, коли ітем буде видалений? там буде undefined?
        return World.Items;
    }

    static item(id) {
        if(World.Items.hasOwnProperty(id)) {
            return World.Items[id];
        }
        return false;
    }

    static element(id) {
        if(World.Items.hasOwnProperty(id)) {
            return World.Items[id].element;
        }
        return false;
    }

    /**
     * 
     * @param {*} element 
     * @param {*} scope 
     * @param {*} data 
     * @returns 
     */
    static addItem(element, scope, data = {}, events = []) {
        if(!element) {
            console.error("Помилка: Не вдалося додати елемент до списку items. Елемент не є DOM-елементом.", element);
            return false;
        }

        if(World.element[element.id])  {
            console.error("Помилка: Елемент з id", element.id, "вже існує в списку items.", element);
            return false;
        }

        World.Items[element.id] = {
            element: element,
            scope: scope,
            data: data,
            events: [] // TODO: обовязково потрібно зберегти всі події, які були додані до елемента, щоб пізніше можна було видалити їх
        }

        return true;
    }
    
    
    /**
     * destroy Node with children:
     */
    static destroyItem(id) {

        // TODO тут потрібен проміс, щоб не блокувати основний потік
        const item = World.element(id);
        if(item) {
            // Слухачі подій слід видалити першими
            // element.removeEventListener('click', handleClick);

            // і в дочірніх також
            item.remove();
        } else {
            return false;
        }
        // видалити слід всі дочірні елементи

        delete World.Items[id];
        return true;
    }
}

const _ = World;

console.log("_ items", _.items())
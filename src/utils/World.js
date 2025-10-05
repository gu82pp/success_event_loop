/**
 *  Причина створення цієї бібліотеки в тому, щоб зменшити розмір основного HTML-файлу.
 *  Можна брати елементи з DOM, але для цього вони повинні бути вже описані у основному HTML-файлі.
 *  Це не ефективно. Тому всі дії з DOM проводяться через цю бібліотеку, у памяті. 
 * 
 *  Тут я можу вручну оптимізувати порядок завантаження DOM-елементів і проводити дії з ними у памяті. Не перемальовуючи інтерфейс.
 * 
 *      TODO: 
 *      - Опиши порядок завантеження скриптів у Loader.js
 *      - Оброби помилки
 *      - Стеж за памяттю, щоб не було витоків
 */
class World
{
    /**
     * List of DOM nodes:
     * {
     *  uuid: {
     *      element: elementNode,
     *      scope: "string",
     *      data: {object}
     *  }
     * }
     */
    static Items = {};

    static itemSchemaExample = {
        id: "string",
        tag: "div",
        data: {}, // any object
        scope: "string",
        className: "string", // with spaces: "container main"
        textContent: "textContent",
        children: [] // array of objects
    };

    static itemsList() {
        // TODO: що покаже, коли ітем буде видалений? там буде undefined?
    }

    /**
     * Create one Node:
     */
    static createItem(itemSchema) {
        // console.log("itemSchema", itemSchema)
        const element = document.createElement(itemSchema.tag || 'div');


        if (itemSchema.id) {
            if(itemSchema.scope) {
                element.id = itemSchema.scope + "_" + itemSchema.id;
            } else {
                element.scope = itemSchema.id;
            }
        }

        if (itemSchema.className) {
            element.className = itemSchema.className; 
        }

        if (itemSchema.textContent) {
            element.textContent = itemSchema.textContent;
        }

        if(itemSchema.data) {
            element.data = itemSchema.data;

            if(itemSchema.data.onClick) {
                element.addEventListener('click', itemSchema.data.onClick);
            }
        }



        this.Items[element.id] = {
            element: element,
            scope: itemSchema.scope,
            data: itemSchema.data
        }

        return element;
    }

    /**
     * destroy Node with children:
     */
    destroyItem() {
        // TODO: find all children and delete them from Items
    }

    /**
     * Build full tree:
     */
    static buildWorld(itemSchema) {
        // console.log("buildWorld", itemSchema)
        // 1. Створюємо базовий елемент
        const element = this.createItem(itemSchema);

        // 3. Рекурсивно додаємо дочірні елементи
        if (itemSchema.children && Array.isArray(itemSchema.children)) {
            itemSchema.children.forEach(childSchema => {
                // Рекурсивний виклик
                element.appendChild(World.buildWorld(childSchema)); 
            });
        }

        return element;
    }


    /**
     * Не обовязково включати в продакшн 
     */
    static structureIsValid() {
        // TODO:
        return false;
    }

    static getElement(uuid) {
        // console.log("this.Items", this.Items)
        return this.Items[uuid].element;
    }
}
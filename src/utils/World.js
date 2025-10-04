/**
 * This page is whole world.
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

    /**
     * Create one Node:
     */
    static createItem(itemSchema) {
        const element = document.createElement(itemSchema.tag || 'div');

        if (itemSchema.id) {
            element.id = itemSchema.id;
        }

        if (itemSchema.className) {
            element.className = itemSchema.className; 
        }

        if (itemSchema.textContent) {
            element.textContent = itemSchema.textContent;
        }

        this.Items[element.id] = {
            element: element,
            scope: itemSchema.scope,
            data: itemSchema.data
        }

        return element;
    }

    /**
     * Build full tree:
     */
    static buildWorld(itemSchema) {
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
}
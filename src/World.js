/**
 * Клас World для зберігання всіх елементів в DOM.
 */
class World
{
    /**
     * Schema:
     * {
     *      id: {
     *          element: domElement,
     *          data: object,
     *          events: array // array of { eventName: string, handler: function }
     *      }
     * }
     */
    static Items = {};
 
    /**
     * Повертає перелік всіх елементів в списку items
     */
    static items() {
        return World.Items;
    }

    /*
     * Повертає item за вказаним id
     */
    static item(id) {
        if(World.Items.hasOwnProperty(id)) {
            return World.Items[id];
        }
        return false;
    }

    /*
     * Повертає елемент за вказаним id
     */
    static element(id) {
        if(World.Items.hasOwnProperty(id)) {
            return World.Items[id].element;
        }
        return false;
    }

    /**
     * Додає елемент до списку items, схема повинна відповідати схемі World.Items
     */
    static addItem(element, data = {}, events = []) {
        // Перевірка, чи є об'єкт елементом DOM і чи має він ID
        if (!element || typeof element.id !== 'string' || element.id.length === 0) {
            console.warn("Помилка: Елемент має бути DOM-нодою з унікальним непустим 'id'.", element);
            return false;
        }

        if (World.Items.hasOwnProperty(element.id)) {
            console.warn("Помилка: Елемент з id", element.id, "вже існує в списку items.", element);
            return false;
        }

        World.Items[element.id] = {
            element: element,
            data: data,
            events: events // Це потрібно для видалення подій пізніше
        }

        return true;
    }

    /**
     * Видаляє елемент з DOM та реєстру, включючи події, щоб уникнути витоків пам'яті.
     */
    static destroyItem(id) {
        const item = World.item(id);

        if (!item) {
            // console.warn(`[Destroy Warning] Елемент з ID ${id} не знайдено в World.Items. Ігноруємо.`);
            return false;
        }
        
        const registeredChildren = item.element.querySelectorAll('*');
        item.element.remove();
        
        registeredChildren.forEach(child => {
            const childItem = World.item(child.id); // Беру з реєстру потім видаляємо всі події
            if (childItem) {
                childItem.events.forEach(({ eventName, handler }) => {
                    childItem.element.removeEventListener(eventName, handler); // Видаляємо події з дочірнього елемента
                    // console.log(`[Destroy Events] Видалено подію '${eventName}' з елемента ${id}.`);
                });           
                delete World.Items[child.id]; 
            }
        });
        
        item.events.forEach(({ eventName, handler }) => {
            item.element.removeEventListener(eventName, handler); // Видаляємо події з дочірнього елемента
            // console.log(`[Destroy Events] Видалено подію '${eventName}' з елемента ${id}.`);
        }); 

        delete World.Items[id];
        // console.log(`[Destroy Registry] Видалено запис із реєстру World.Items для ID ${id}.`);

        return true;
    }

    /**
     * Повертає масив всіх подій, які зареєстровані в реєстрі World.Items.
     */
    static events() {
        // проходжу по всьому масив items і додаю до масиву events всі події з кожного елемента
        const events = [];

        Object.values(World.Items).forEach(item => {
            events.push(...item.events);
        });

        return events;
    }
}

const _ = World;

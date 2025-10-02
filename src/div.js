class Div
{
    static list = {};

    static getElement(name) {
        return Div.list[name] || null;
    }


    static create(param) {
        if (!param || !param.name) {
            console.error("Помилка: параметр 'name' є обов'язковим.");
            return null;
        }

        if (Div.list[param.name]) {
            console.warn(`Div з ім'ям '${param.name}' вже існує.`);
            return Div.list[param.name];
        }

        const div = document.createElement('div');
        div.id = param.name;
        div.className = param.className || '';

        Div.list[param.name] = div;
        return div;
    }

}

// Ініціалізація сторінок 
// Це те, що має бути виконано ДО рендеру і всіх інших дій
Div.create({name: "page-new-task", className: "d-none"}),
Div.create({name: "page-edit-task", className: "d-none"}),
Div.create({name: "page-task-list", className: "d-block" })

Div.create({name: "uuid", className: "" })



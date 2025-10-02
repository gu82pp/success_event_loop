class Buttons 
{
    static list = {};
    static params = {};

    static getElement(name) {
        return Buttons.list[name] || null;
    }


    static create(param) {

        if(!param || !param.name) {
            console.error("Помилка: параметр 'name' є обов'язковим.");
            return null;
        }

        if (Buttons.list[param.name]) {
            console.warn(`Кнопка з ім'ям '${param.name}' вже існує.`);
            return Buttons.list[param.name];
        }

        const button = document.createElement('button');
        Buttons.params[param.name] = param; // Збереження параметрів кнопки

        button.textContent = param.text || '';
        button.className = param.className || '';

        button.setAttribute('type', 'button'); // Краще явно вказати тип

        // Загальна дія для всіх кнопок:
        button.addEventListener('click', Buttons.clickHandler); 

        // Персональні обробники подій, якщо вони передані
        if (param.mousedown && typeof param.mousedown === 'function') {
            button.addEventListener('mousedown', param.mousedown);
        }
        if (param.mouseup && typeof param.mouseup === 'function') {
            button.addEventListener('mouseup', param.mouseup);
        }
        if (param.mouseenter && typeof param.mouseenter === 'function') {
            button.addEventListener('mouseenter', param.mouseenter);
        }
        if (param.mouseleave && typeof param.mouseleave === 'function') {
            button.addEventListener('mouseleave', param.mouseleave);
        }
        if (param.mousemove && typeof param.mousemove === 'function') {
            button.addEventListener('mousemove', param.mousemove);
        }
        if (param.mouseover && typeof param.mouseover === 'function') {
            button.addEventListener('mouseover', param.mouseover);
        }
        if (param.mouseout && typeof param.mouseout === 'function') {
            button.addEventListener('mouseout', param.mouseout);
        }
        if (param.click && typeof param.click === 'function') {
            button.addEventListener('click', param.click);
        }

        Buttons.list[param.name] = button;
        return button;
    }


    static clickHandler(event) {

        return null;
         
        const action = event.target.getAttribute('action');
        
        // 3. Перевірка та виконання логіки за допомогою switch
        switch (action) {
            case 'blockers':
                console.log("Дія для Blockers", event.target);
                // Додайте тут логіку для 'blockers'
                break;

            case 'drivers':
                console.log("Дія для Drivers");
                // Додайте тут логіку для 'drivers'
                break;

            case 'accelerators':
                console.log("Дія для Accelerators");
                // Додайте тут логіку для 'accelerators'
                break;
                
            case null:
                // Спрацює, якщо атрибут 'action' відсутній або дорівнює null
                console.log("Дія не визначена: атрибут 'action' відсутній.");
                break;
                
            default:
                // Спрацює, якщо атрибут 'action' має інше невідоме значення
                console.log(`Дія не розпізнана: ${action}`);
                break;
        }
    }


}



Buttons.create({
    parent_type: "div",
    root_element_id: "buttons-container",
    name: "blockers",
    text: "Blockers",
    className: "btn btn-success me-2 realistic-button",
    click: (event) => {  showBlockersPage() },
}),

Buttons.create({
    parent_type: "div",
    root_element_id: "buttons-container",
    name: "drivers",
    text: "Drivers",
    className: "btn btn-success me-2 realistic-button",
    click: (event) => { console.log("Custom onClick for Drivers", event.target); }
}),

Buttons.create({
    parent_type: "div",
    root_element_id: "buttons-container",
    name: "accelerators",
    text: "Accelerators",
    className: "btn btn-success me-2 realistic-button",
    click: (event) => { console.log("Custom onClick for Accelerators", event.target); }
}),

Buttons.create({
    parent_type: "div",
    root_element_id: "buttons-container",
    name: "add_task_btn",
    text: "Add Task",
    className: "btn btn-success realistic-button",
    click: (event) => { showAddTaskPage(); }
})








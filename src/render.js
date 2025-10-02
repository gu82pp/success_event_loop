function renderAll() {
    renderButtons();
}
renderAll();

// TODO: обєднати по фрагментах (батьківські)
function renderButtons() {
    for (const name in Buttons.list) {
        const params = Buttons.params[name];

        if(!params) {
            console.error(`Для кнопки '${name}' не вказано параметри.`);
            continue;
        }

        if(params.root_element_id) {

            const rootElement = document.getElementById(params.root_element_id);

            if(!rootElement) {
                console.error(`Root елемент з id '${params.root_element_id}' не знайдено для кнопки '${name}'.`);
                continue;
            }

            rootElement.appendChild(Buttons.getElement(name));
            continue;
        }


        if(!params.parent_type) {
            console.error(`Для кнопки '${name}' не вказано параметр 'parent_type'.`);
            continue;
        }

        if(!params.parent_id) {
            console.error(`Для кнопки '${name}' не вказано параметр 'parent_id'.`);
            continue;
        }


        const button = Buttons.getElement(name);

        const parent = Div.getElement(Buttons.params[name].parent_id);
        if(!parent) {
            console.error(`Батьківський елемент з id '${Buttons.params[name].parent_id}' не знайдено для кнопки '${name}'.`, Div.list, Buttons.list);
            continue;
        }
        
        parent.appendChild(button);

        
    }
}


/**
 *
 */
function renderPages() {
    const container = document.getElementById('pages-container');
    if (!container) {
        console.error("Контейнер для сторінок не знайдено!");
        return;
    }

    const fragment = document.createDocumentFragment();
        fragment.appendChild(Div.getElement("page-new-task"));
        fragment.appendChild(Div.getElement("page-edit-task"));
        fragment.appendChild(Div.getElement("page-task-list"));

    container.appendChild(fragment);
}
renderPages();

/**
 *
 */
function renderNewTaskForm() {

    // Створення інпуту для часу
    const timeInput = Form.createInput({
        id: 'expectedTime',
        label: 'Очікуваний час виконання',
        type: 'number',
        placeholder: '30'
    });

    // Створення інпуту для тексту
    const nameInput = Form.createInput({
        id: 'taskName',
        label: 'Назва Завдання',
        type: 'text',
        placeholder: 'Введіть назву...'
    });


    Div.getElement("page-new-task").appendChild(Div.getElement("uuid"));
    Div.getElement("page-new-task").appendChild(nameInput);
    Div.getElement("page-new-task").appendChild(timeInput);
}
renderNewTaskForm();





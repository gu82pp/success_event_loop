window.DB.PROMISE = initializeDB();


async function loadSavedTasks() {
    const filters = { 
    };

    try {
        const tasks = await getAllRecordsWithFilter('tasks', filters);
        // console.log(`Знайдено завдань: ${tasks.length}`, tasks);
        // ... вивід даних ...
        Task.list = tasks;
        
    } catch (error) {
        console.error("Помилка завантаження відфільтрованих даних:", error);
    }
}

async function getTasks() {
    await loadSavedTasks();
    Task.all().forEach(task => {
        // console.log(task);
    });
    // Task.markAsCompleted("fd8773c2-ef00-4538-aa98-ebd15856ddf0");

    Debugger.printTimings({fields: ['label', 'time (ms)']});
}
getTasks();



function createTask(task) {
    // save to memory
    let createdTask = Task.create(task);

    // TODO: change DOM:

    // TODO: save to indexedDB:
    addRecordToDB('tasks', createdTask).then((uuid) => {
        console.log("Допис успішно додано з UUID:", uuid);
    }).catch((error) => {
        console.error("Не вдалося додати допис:", error);
    });

    return createdTask;
}




function render() {
    const page = document.getElementById("page");
    const layout = buildHeaderCountentFooterOuter();
    const header = buildHeaderDOM()
    const content = buildContentDOM()
    const footer = buildFooterDOM() // це можна і відкласти на пізніше

    // Створення нового фрагменту
    const fragment = document.createDocumentFragment();

    // Додавання елементів до фрагменту
    fragment.appendChild(header);
    fragment.appendChild(content);
    fragment.appendChild(footer);

    layout.appendChild(fragment);

    // Вставка фрагменту в DOM
    page.appendChild(layout);
    return false;
}
render()
console.log("remembered", World.Items)

function buildHeaderCountentFooterOuter() {
    // 1. Створення DocumentFragment (легкий контейнер у пам'яті)
    const fragment = document.createDocumentFragment();

    // Загальні параметри для всіх колонок
    const baseOptions = { scope: 'layout-column', class: 'col' };

    // 2. Створення елементів за допомогою універсальної функції
    
    // Створення <div id="header"></div>
    const headerDiv = createDomElement('div', {
        ...baseOptions,
        id: 'header'
    });

    // Створення <div id="content"></div>
    const contentDiv = createDomElement('div', {
        ...baseOptions,
        id: 'content'
    });

    // Створення <div id="footer"></div>
    const footerDiv = createDomElement('div', {
        ...baseOptions,
        id: 'footer'
    });

    // 3. Додавання елементів до фрагмента (все ще в пам'яті)
    fragment.appendChild(headerDiv);
    fragment.appendChild(contentDiv);
    fragment.appendChild(footerDiv);

    // 4. Повернення фрагмента
    return fragment;
}


function buildHeaderDOM() {

    // Створення нового фрагменту
    const fragment = document.createDocumentFragment();

    // 1. Створення внутрішнього елемента <a> (Посилання)
    const linkElement = createDomElement('a', {
        scope: 'app-link', // Обов'язковий scope
        textContent: 'Success Event Loop',
        href: 'https://gu82pp.github.io/success_event_loop/', // Специфічний атрибут для <a>
    });

    // 2. Створення зовнішнього елемента <h1>
    const headerElement = createDomElement('h1', {
        scope: 'app-header', // Обов'язковий scope
        class: ['mb-4', 'text-center'], // Класи Bootstrap для стилізації
    });

    // 3. Вкладення елементів: <h1> вкладає <a>
    headerElement.appendChild(linkElement);

    fragment.appendChild(headerElement);
    fragment.appendChild(buildHeaderButtonOuter());

    return fragment;
}

function buildHeaderButtonOuter() {

    // 1. Створення внутрішнього елемента (Контейнер для кнопок)
    const innerDiv = createDomElement('div', {
        scope: 'ui-component', // Обов'язковий scope
        id: 'buttons-container', // Фіксований ID для подальшого використання
        class: ['col', 'd-flex', 'justify-content-start'], // Класи Bootstrap для вирівнювання
    });

    // 2. Створення зовнішнього елемента (Контейнер з відступом)
    const outerDiv = createDomElement('div', {
        scope: 'layout', // Обов'язковий scope
        class: 'mb-5', // Клас Bootstrap для великого нижнього відступу
    });

    // 3. Вкладення елементів: Зовнішній <div> вкладає Внутрішній <div>
    outerDiv.appendChild(innerDiv);

    return outerDiv;
}


function buildContentDOM() {
    // TODO: створити компонент з базовим шаблоном
    // Створення нового фрагменту
    const fragment = document.createDocumentFragment();
    return fragment;
}

function buildFooterDOM() {
    // TODO: створити компонент з базовим шаблоном
        // Створення нового фрагменту
    const fragment = document.createDocumentFragment();
    return fragment;
}
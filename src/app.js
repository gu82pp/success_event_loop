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

// let firstTask = {  
//     section: "blockers", // blockers, drivers, accelerators
//     categoryUuid: crypto.randomUUID(), // ід категорії
//     title: "Моє друге завдання", // назва задачі
//     description: "Опис мого другого завдання", // опис задачі
//     benefit: "Я відчуваю що зараз буде прогрес!", // користь від виконання задачі
//     repeatInterval: 12, // час через який слід повторити виконання цієї задачі, у годинах
//     minCompletionTime: 0, // найменший час, за який мені вдалось виконати задачу, у хвилинах
//     estimatedTime: 5, // час, якого на мою думку достатньо, щоб виконати задачу, у хвилинах
// };

// createTask(firstTask);



function showPage(pageName) {
    const page = Div.getElement(pageName);
    if (page) {
        // add class .d-block and remove .d-none
        page.classList.add('d-block');
        page.classList.remove('d-none');
    }
}


function hidePage(pageName) {
    const page = Div.getElement(pageName);
    if (page) {
        // add class .d-block and remove .d-none
        page.classList.add('d-none');
        page.classList.remove('d-block');
    }
}

function showAddTaskPage() {
    // Div.getElement("uuid")
    showPage("page-new-task");
    hidePage("page-task-list");
    Div.getElement("uuid").textContent = crypto.randomUUID();
}

function showBlockersPage() {
    showPage("page-task-list");
    hidePage("page-new-task");
}



//////////

const domStructure = {
    tag: "div",
    id: "root",
    className: "main",
    
    scope: "string",
    data: {}, // any object
    className: "string", // with spaces: "container main"

    // Властивість 'children' одразу описує ієрархію
    children: [
        TaskListPage.root,
        NewTaskPage.root,
        EditTaskPage.root
    ]
};

console.log("domStructure", domStructure)


// Приклад використання (оптимізований через DocumentFragment):
function createOptimizedDOM(structure, targetNode) {
    const fragment = document.createDocumentFragment();
    const rootElement = World.buildWorld(structure);

    fragment.appendChild(rootElement);
    targetNode.appendChild(fragment);
}

// Викликаємо функцію, передаючи дерево та місце в DOM

createOptimizedDOM(domStructure, document.body);



// new NewTaskPage("new_task_page").addChildren([
//     new NewTaskForm("new_task_form"),
//     new Button("new_task_button", "Завантажити завдання")
// ])

function updateInnerText() {

    let taskPageInner = World.getElement("task_list_page_inner");
    let editTaskPageInner = World.getElement("edit_task_page_inner");


    taskPageInner.textContent = "New Task list page";
    editTaskPageInner.textContent = "New edit task page";

    switchAnimation(taskPageInner, ["orange"], ["white"], 100, ["white"], ["orange"]);
    switchAnimation(taskPageInner, ["wiggle"], [], 500, [], ["wiggle"]);
    
    switchAnimation(editTaskPageInner, ["orange"], ["white"], 100, ["white"], ["orange"]);
    switchAnimation(editTaskPageInner, ["wiggle"], [], 500, [], ["wiggle"]);
    
}

/**
 * 
 * @param {*} e - element
 * @param {*} a1 - array of classes to add
 * @param {*} a2 - array of classes to remove
 * @param {*} d - delay
 * @param {*} b1 - array of classes to add
 * @param {*} b2 - array of classes to remove
 */
function switchAnimation(e, a1, a2, d, b1, b2) {
    if(!e) return;
    if(!classesArrayIsValid(a1)) return;
    if(!classesArrayIsValid(a2)) return;
    if(!classesArrayIsValid(b1)) return;
    if(!classesArrayIsValid(b2)) return;
    for (let i = 0; i < a1.length; i++) { e.classList.add(a1[i]); }
    for (let i = 0; i < a2.length; i++) { e.classList.remove(a2[i]); }
    setTimeout(() => {
        for (let i = 0; i < b1.length; i++) { e.classList.add(b1[i]); }
        for (let i = 0; i < b2.length; i++) { e.classList.remove(b2[i]); }
    }, d);
}

function classesArrayIsValid(stringArray) {
  if (!Array.isArray(stringArray)) {
    console.error("Помилка: Вхідний аргумент повинен бути масивом.");
    return false; // Зупиняємо, якщо вхідний аргумент не масив
  }

  for (let i = 0; i < stringArray.length; i++) {
    const inputString = stringArray[i];

    if (typeof inputString !== 'string') {
      console.error(`Помилка: Елемент масиву з індексом ${i} не є рядком.`);
      return false; // Зупиняємо, якщо елемент масиву не є рядком
    }

    if (inputString.includes(" ")) {
      console.error(`Рядок "${inputString}" з індексом ${i} містить пробіл! Проблема з класом або ідентифікатором.`);
      return false; // Повертаємо false, якщо знайдено пробіл
    }
  }
  return true; // Повертаємо true, якщо все гаразд
}


new NewTaskPage("new_1").addChildren([

])

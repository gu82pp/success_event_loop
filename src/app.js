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
        console.log(task);
    });
    // Task.markAsCompleted("fd8773c2-ef00-4538-aa98-ebd15856ddf0");
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
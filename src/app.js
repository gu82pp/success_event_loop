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

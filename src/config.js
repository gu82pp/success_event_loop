/** 
 * @type {TASK_SCHEMA} 
 */
const TASK_SCHEMA = {
    uuid: "string",
    section: "blockers", // blockers, drivers, accelerators
    tableUuid: "uuid_string", // ід таблиці
    title: "string", // назва задачі
    description: "string", // опис задачі
    benefit: "string", // користь від виконання задачі
    repeatInterval: 0, // час через який слід повторити виконання цієї задачі, у годинах
    minCompletionTime: 0, // найменший час, за який мені вдалось виконати задачу, у хвилинах
    estimatedTime: 0, // час, якого на мою думку достатньо, щоб виконати задачу, у хвилинах
    lastCompletedAt: "unix_timestamp|null", // час останнього виконання задачі
    completionCount: 0, // скільки разів я виконав цю задачу
    isArchived: false, // чи архівна це задача
};

// TODO: категорії задач
console.table()

window.CONFIG = {
    SCHEMA: {
        TASK_SCHEMA: TASK_SCHEMA,
    }
};

window.DB = {
    INSTANCE: null,
    PROMISE: null,
    NAME: 'SuccessEventLoopDB',
    VERSION: 1,
    STORES: {
        TASKS: 'tasks'
    }
};

console.log("window.CONFIG: ", window.CONFIG );


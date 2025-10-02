/**
 * Відкриває підключення до IndexedDB.
 * Якщо база даних не існує або потрібне оновлення схеми,
 * виконується логіка створення сховищ об'єктів.
 *
 * @param {string} dbName - Ім'я бази даних (наприклад, 'MyProjectDB').
 * @param {number} version - Версія бази даних (збільшується при зміні схеми).
 * @param {function(IDBDatabase, IDBVersionChangeEvent): void} upgradeCallback - Функція, що виконується під час оновлення.
 * @returns {Promise<IDBDatabase>} - Проміс, який повертає об'єкт бази даних.
 */
function openIndexedDB(dbName, version, upgradeCallback) {

    // ФІКСАЦІЯ ЧАСУ ПОЧАТКУ
    const startTime = performance.now(); 

    return new Promise((resolve, reject) => {
        // 1. Перевірка підтримки браузером
        if (!window.indexedDB) {
            return reject(new Error("IndexedDB не підтримується цим браузером."));
        }

        const request = window.indexedDB.open(dbName, version);
        
        let db;

        // 2. Обробка події onupgradeneeded (Створення або Оновлення Схеми)
        request.onupgradeneeded = (event) => {
            db = event.target.result;
            console.log(`Оновлення бази даних до версії ${version}...`);
            // Викликаємо функцію зворотного виклику для створення сховищ
            upgradeCallback(db, event);
        };

        // 3. Обробка успішного підключення
        request.onsuccess = (event) => {
            db = event.target.result;

            // ФІКСАЦІЯ ЧАСУ ЗАВЕРШЕННЯ
            const endTime = performance.now();
            const duration = (endTime - startTime).toFixed(2); // Точність до 2 знаків
            
            console.log(`✅ Підключення до IndexedDB успішно встановлено за ${duration} мс.`);

            // Успішно повернути об'єкт бази даних
            resolve(db);
        };

        // 4. Обробка помилки
        request.onerror = (event) => {
            console.error("Помилка при відкритті IndexedDB:", event.target.error);
            reject(event.target.error);
        };

        request.onversionchange = function() {
            request.close();
            alert("База даних застаріла, перезавантажте сторінку.")
        };

    });
}

/**
 * Функція, що виконується при оновленні версії бази даних (наприклад, з 0 до 1).
 * Тут створюються сховища об'єктів (Object Stores) та індекси.
 * * @param {IDBDatabase} db - Об'єкт бази даних.
 * @param {IDBVersionChangeEvent} event - Об'єкт події оновлення.
 */
function databaseUpgrade(db, event) {
    const oldVersion = event.oldVersion;
    const newVersion = event.newVersion;

    console.log(`Ініціалізація схеми: Перехід з версії ${oldVersion} до ${newVersion}`);
    
    // --- 1. Створення Сховища 'tasks' ---
    
    if (!db.objectStoreNames.contains('tasks')) {
        
        // Використовуємо UUID як основний унікальний ключ (keyPath)
        const tasksStore = db.createObjectStore('tasks', { 
            keyPath: 'uuid'
            // autoIncrement не використовуємо, оскільки ви використовуєте UUID
        });
        
        console.log("Сховище 'tasks' успішно створено.");

        // Створення індексів для швидкого пошуку та сортування
        
        // Індекс для сортування: порядок відображення (order)
        tasksStore.createIndex('by_order', 'order', { unique: false });

        // Індекс для групування: до якого розділу та таблиці належить задача
        // Створюємо індекс на двох полях для складної фільтрації
        tasksStore.createIndex('by_location', ['section', 'tableUuid'], { unique: false });
    }

    // --- 2. Створення Сховища 'tables' ---

    if (!db.objectStoreNames.contains('tables')) {
        
        // Використовуємо UUID як основний унікальний ключ (keyPath)
        const tablesStore = db.createObjectStore('tables', { 
            keyPath: 'uuid'
        });
        
        console.log("Сховище 'tables' успішно створено.");
        
        // Індекс для сортування: порядок відображення (order)
        tablesStore.createIndex('by_order', 'order', { unique: false });
    }
}


async function initializeDB() {
    try {
        // 1. Відкриття / Створення бази даних
        const dbInstance = await openIndexedDB(window.DB.NAME, window.DB.VERSION, databaseUpgrade);
        
        // 2. Збереження інстансу для подальшого використання!
        window.DB.INSTANCE = dbInstance;
        
        console.log("З'єднання з базою даних встановлено і збережено. window.DB: ", window.DB);
        
    } catch (error) {
        // ... обробка помилок
        console.error("Не вдалося ініціалізувати базу даних:", error);
    }
}


/**
 * Додає новий допис до сховища об'єктів IndexedDB.
 *
 * @param {IDBDatabase} db - Інстанція бази даних, отримана через indexedDB.open.
 * @param {string} storeName - Назва сховища об'єктів (наприклад, 'data_store').
 * @param {Object} record - Об'єкт даних, який потрібно зберегти (повинен мати 'uuid').
 * @returns {Promise<string>} - Проміс, який повертає uuid доданого допису.
 */
async function addRecordToDB(storeName, record) {
    console.log("Додавання допису до DB: ", window.DB.INSTANCE, storeName, record);

    // ФІКСАЦІЯ ЧАСУ ПОЧАТКУ
    const startTime = performance.now(); 

    await waitForDBReady();

    return new Promise((resolve, reject) => {
        
        // 1. ПЕРЕВІРКА ПЕРЕД ЗБЕРЕЖЕННЯМ
        if (!record || !record.uuid) {
            return reject(new Error("Допис повинен бути об'єктом і мати поле 'uuid'."));
        }
        
        // 2. СТВОРЕННЯ ТРАНЗАКЦІЇ
        // Транзакція має бути 'readwrite' для запису даних.
        const transaction = window.DB.INSTANCE.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        
        // 3. ВИКОНАННЯ ЗАПИТУ
        // Використовуємо 'add' для додавання нових дописів
        const request = store.add(record); 
        
        // 4. ОБРОБКА УСПІШНОГО ЗАПИСУ
        request.onsuccess = (event) => {
            // Ключ (uuid) щойно доданого допису
            const addedKey = event.target.result; 

            // ФІКСАЦІЯ ЧАСУ ЗАВЕРШЕННЯ
            const endTime = performance.now();
            const duration = (endTime - startTime).toFixed(2); // Точність до 2 знаків

            console.log(`✅ Додавання допису до IndexedDB успішно завершено за ${duration} мс.`, addedKey);

            resolve(addedKey); 
        };
        
        // 5. ОБРОБКА ПОМИЛОК ЗАПИТУ (наприклад, конфлікт ключів)
        request.onerror = (event) => {
            console.error("Помилка при додаванні допису:", event.target.error);
            // Повертаємо помилку транзакції
            reject(event.target.error); 
        };
        
        // 6. ОБРОБКА ПОВНОЇ ТРАНЗАКЦІЇ
        // Хоча обробка помилок запиту зазвичай достатня, це гарантує фіналізацію
        transaction.oncomplete = () => {
            // Транзакція завершена успішно
        };

        transaction.onabort = (event) => {
            // Транзакція перервана
            reject(new Error("Транзакція була перервана."));
        };
    });
}
/*
addRecordToDB('tasks', {
    uuid: crypto.randomUUID(),
    section: "blockers", // blockers, drivers, accelerators
    tableUuid: crypto.randomUUID(), // ід таблиці
    title: "test task", // назва задачі
    description: crypto.randomUUID(), // опис задачі
    order: 0, // порядок відображення
    repeatInterval: 0, // час через який слід повторити виконання цієї задачі, у хвилинах
    minCompletionTime: 0, // найменший час, за який мені вдалось виконати задачу, у хвилинах
    estimatedTime: 0, // час, якого не мою думку достатньо, щоб виконати задачу, у хвилинах
    lastCompletedAt: "unix_timestamp|null", // час останнього виконання задачі
    completionCount: 0, // скільки разів я виконав цю задачу
    isArchived: false, // чи архівна це задача
}).then((uuid) => {
    console.log("Допис успішно додано з UUID:", uuid);
}).catch((error) => {
    console.error("Не вдалося додати допис:", error);
});
*/

/**
 * Отримує один допис зі сховища об'єктів за його унікальним ключем.
 *
 * @param {string} storeName - Назва сховища об'єктів (наприклад, 'data_store').
 * @param {string} key - Унікальний ключ допису (uuid).
 * @returns {Promise<Object | undefined>} - Проміс, який вирішується об'єктом даних або undefined, якщо не знайдено.
 */
async function getRecordFromDB(storeName, key) {

    // ФІКСАЦІЯ ЧАСУ ПОЧАТКУ
    const startTime = performance.now(); 

    await waitForDBReady();

    // 2. СТВОРЕННЯ ТРАНЗАКЦІЇ ТА ВИКОНАННЯ ЗАПИТУ
    return new Promise((resolve, reject) => {
        
        // Транзакція для читання має бути 'readonly'
        const transaction = window.DB.INSTANCE.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        
        // Використовуємо метод 'get' для отримання допису за ключем
        const request = store.get(key); 
        
        // Обробка успішного запиту
        request.onsuccess = (event) => {
            // event.target.result містить об'єкт даних або undefined, якщо його не знайдено
            const result = event.target.result;
            // ФІКСАЦІЯ ЧАСУ ЗАВЕРШЕННЯ
            const endTime = performance.now();
            const duration = (endTime - startTime).toFixed(2); // Точність до 2 знаків

            console.log(`✅ Читання допису з IndexedDB успішно завершено за ${duration} мс.`, result);
            resolve(event.target.result); 
        };
        
        // Обробка помилок
        request.onerror = (event) => {
            console.error("Помилка при читанні допису:", event.target.error);
            reject(event.target.error);
        };
        
        // Обробка переривання транзакції
        transaction.onabort = () => {
             reject(new Error("Транзакція читання була перервана."));
        };
    });
}



async function waitForDBReady() {
    try {
        await window.DB.PROMISE;
    } catch (e) {
        // Якщо ініціалізація бази даних провалилася (наприклад, користувач відмовив у доступі),
        // ми відхиляємо цей запис.
        throw new Error(`Не вдалося виконати запис: ініціалізація DB провалилася. Причина: ${e.message}`);
    }
}

/**
 * Оновлює значення одного поля у існуючому дописі в IndexedDB.
 *
 * @param {string} storeName - Назва сховища об'єктів (наприклад, 'data_store').
 * @param {string} key - Унікальний ключ допису (uuid).
 * @param {string} fieldName - Назва поля, яке потрібно оновити (наприклад, 'title').
 * @param {*} newValue - Нове значення для цього поля.
 * @returns {Promise<void>} - Проміс, який вирішується після успішного оновлення.
 */
async function updateRecordField(storeName, key, fieldName, newValue) {
    
    // ФІКСАЦІЯ ЧАСУ ПОЧАТКУ
    const startTime = performance.now(); 

    await waitForDBReady();
    // 2. СТВОРЕННЯ ТРАНЗАКЦІЇ (ЧИТАННЯ І ЗАПИС)
    return new Promise((resolve, reject) => {
        
        // Транзакція має бути 'readwrite' для обох операцій: читання ('get') та запис ('put')
        const transaction = window.DB.INSTANCE.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);

        // 3. ЧИТАННЯ ІСНУЮЧОГО ДОПИСУ
        const getRequest = store.get(key);
        
        getRequest.onsuccess = (event) => {
            const record = event.target.result;

            if (!record) {
                // Якщо допис не знайдено, відхиляємо Проміс
                return reject(new Error(`Допис з ключем ${key} не знайдено.`));
            }

            // 4. ОНОВЛЕННЯ ПОЛЯ
            record[fieldName] = newValue;

            // 5. ЗАПИС ОНОВЛЕНОГО ДОПИСУ
            // Метод 'put' замінює існуючий допис, якщо ключ (uuid) збігається
            const putRequest = store.put(record); 
            
            putRequest.onsuccess = () => {
                // Успішно оновлено
                const endTime = performance.now();
                const duration = (endTime - startTime).toFixed(2);
                console.log(`✅ Оновлення поля '${fieldName}' у дописі з ключем ${key} успішно завершено за ${duration} мс.`);
                resolve();
            };
            
            putRequest.onerror = (event) => {
                // Помилка при записі
                reject(event.target.error);
            };
        };

        getRequest.onerror = (event) => {
            // Помилка при читанні
            reject(event.target.error);
        };
        
        // 6. ОБРОБКА ПЕРЕРИВАННЯ ТРАНЗАКЦІЇ
        transaction.onabort = () => {
             reject(new Error("Транзакція оновлення була перервана."));
        };
    });
}


/**
 * Оновлює кілька полів існуючого допису в IndexedDB.
 *
 * @param {string} storeName - Назва сховища об'єктів (наприклад, 'data_store').
 * @param {string} key - Унікальний ключ допису (uuid).
 * @param {Object} updates - Об'єкт, що містить лише поля, які потрібно оновити (наприклад, { title: 'New', isCompleted: true }).
 * @returns {Promise<void>} - Проміс, який вирішується після успішного оновлення.
 */
async function updateRecordFields(storeName, key, updates) {
    
    // ФІКСАЦІЯ ЧАСУ ПОЧАТКУ
    const startTime = performance.now(); 

    await waitForDBReady();

    // 1. СТВОРЕННЯ ТРАНЗАКЦІЇ (ЧИТАННЯ І ЗАПИС)
    return new Promise((resolve, reject) => {
        
        const transaction = window.DB.INSTANCE.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);

        // 2. ЧИТАННЯ ІСНУЮЧОГО ДОПИСУ
        const getRequest = store.get(key);
        
        getRequest.onsuccess = (event) => {
            const record = event.target.result;

            if (!record) {
                return reject(new Error(`Допис з ключем ${key} не знайдено.`));
            }

            // 3. ЗЛИТТЯ ОБ'ЄКТІВ (ОНОВЛЕННЯ КІЛЬКОХ ПОЛІВ)
            // Використовуємо Object.assign або spread-оператор для безпечного злиття.
            // Це гарантує, що лише поля, присутні в 'updates', будуть змінені, 
            // а решта полів 'record' залишаться недоторканими.
            const updatedRecord = Object.assign(record, updates);
            
            // Якщо ви не хочете змінювати uuid (первинний ключ), 
            // ви можете видалити його з 'updates' перед злиттям, хоча це не обов'язково, 
            // оскільки 'put' використовує ключ, що вже існує в об'єкті 'record'.
            
            // 4. ЗАПИС ОНОВЛЕНОГО ДОПИСУ
            const putRequest = store.put(updatedRecord); 
            
            putRequest.onsuccess = () => {
                const endTime = performance.now();
                const duration = (endTime - startTime).toFixed(2);
                console.log(`✅ Оновлення кількох полів допису з ключем ${key} успішно завершено за ${duration} мс.`);
                resolve(); 
            }
            putRequest.onerror = (event) => reject(event.target.error);
        };

        getRequest.onerror = (event) => reject(event.target.error);
        transaction.onabort = () => reject(new Error("Транзакція оновлення була перервана."));
    });
}

/*
getRecordFromDB('tasks', "12d0b7c9-1283-4f8c-b1f3-bc0f628e31cc").then((record) => {
    if (record) {
        console.log("Допис знайдено:", record);
    } else {
        console.log("Допис з таким ключем не знайдено.");
    }
}).catch((error) => {
    console.error("Не вдалося отримати допис:", error);
});
*/

/*
const targetUuid = "12d0b7c9-1283-4f8c-b1f3-bc0f628e31cc";
const newBenefitText = "Завдання тепер приносить вдвічі більше користі!";

updateRecordField('tasks', targetUuid, 'benefit', newBenefitText).then(() => {
    console.log(`✅ Поле 'benefit' для допису ${targetUuid} успішно оновлено.`);
}).catch((error) => {
    console.log("❌ Не вдалося оновити допис:", error);
});
*/
function getRandom(min, max) {
    // Math.random() * (max - min + 1) дає діапазон від 0 до (max - min)
    // Math.floor(...) округлює до цілого
    // + min зсуває діапазон до [min, max]
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
updateRecordFields('tasks', targetUuid, {
    benefit: newBenefitText,
    title: "Оновлена назва задачі",
    completionCount: getRandom(1, 100)
}).then(() => {
    console.log(`✅ Поле 'benefit' для допису ${targetUuid} успішно оновлено.`);
}).catch((error) => {
    console.log("❌ Не вдалося оновити допис:", error);
});
*/


/**
 * Отримує всі дописи зі сховища, опціонально фільтруючи їх за наданими критеріями.
 *
 * @param {string} storeName - Назва сховища об'єктів (наприклад, 'data_store').
 * @param {Object} [filters={}] - Об'єкт з критеріями фільтрації (наприклад, { isCompleted: true, type: 'task' }).
 * @returns {Promise<Array<Object>>} - Проміс, який вирішується масивом відфільтрованих дописів.
 */
async function getAllRecordsWithFilter(storeName, filters = {}) {
    
    // ФІКСАЦІЯ ЧАСУ ПОЧАТКУ
    const startTime = performance.now(); 

    await waitForDBReady();

    // 1. СТВОРЕННЯ ТРАНЗАКЦІЇ ТА ВИКОНАННЯ ЗАПИТУ
    return new Promise((resolve, reject) => {
        
        // Для читання достатньо транзакції 'readonly'
        const transaction = window.DB.INSTANCE.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const results = [];
        
        // 2. ВІДКРИТТЯ КУРСОРА
        // openCursor() дозволяє ефективно перебрати всі записи сховища.
        const request = store.openCursor(); 
        
        request.onsuccess = (event) => {
            const cursor = event.target.result;

            if (cursor) {
                const record = cursor.value;

                // 3. ЗАСТОСУВАННЯ ФІЛЬТРАЦІЇ
                let passesFilter = true;
                
                // Перевіряємо, чи відповідає поточний запис усім наданим фільтрам
                for (const key in filters) {
                    if (filters.hasOwnProperty(key)) {
                        // Фільтруємо, якщо поле існує і значення збігається
                        if (record[key] !== filters[key]) {
                            passesFilter = false;
                            break; // Не відповідає, припиняємо перевірку цього запису
                        }
                    }
                }

                if (passesFilter) {
                    results.push(record);
                }

                // Перехід до наступного запису
                cursor.continue(); 

            } else {
                const endTime = performance.now();
                const duration = (endTime - startTime).toFixed(2);
                console.log(`✅ Отримання всіх дописів з сховища '${storeName}' успішно завершено за ${duration} мс.`);
                // Курсор досяг кінця сховища
                resolve(results); 
            }
        };
        
        // Обробка помилок
        request.onerror = (event) => {
            console.error("Помилка при читанні дописів через курсор:", event.target.error);
            reject(event.target.error);
        };
        
        // Обробка переривання транзакції
        transaction.onabort = () => {
             reject(new Error("Транзакція читання була перервана."));
        };
    });
}

/*
async function loadCompletedTasks() {
    const filters = { 
        
        // isCompleted: true,
        // type: 'task'
        completionCount: 0
    };

    try {
        const completedTasks = await getAllRecordsWithFilter('tasks', filters);
        console.log(`Знайдено завершених завдань: ${completedTasks.length}`, completedTasks);
        // ... вивід даних ...
        
    } catch (error) {
        console.error("Помилка завантаження відфільтрованих даних:", error);
    }
}
*/

/**
 * Видаляє один допис зі сховища об'єктів за його унікальним ключем.
 *
 * @param {string} storeName - Назва сховища об'єктів (наприклад, 'data_store').
 * @param {string} key - Унікальний ключ допису (uuid), який потрібно видалити.
 * @returns {Promise<void>} - Проміс, який вирішується після успішного видалення.
 */
async function deleteRecordFromDB(storeName, key) {
    
    // ФІКСАЦІЯ ЧАСУ ПОЧАТКУ
    const startTime = performance.now(); 

    await waitForDBReady();

    // 2. СТВОРЕННЯ ТРАНЗАКЦІЇ ТА ВИКОНАННЯ ЗАПИТУ
    return new Promise((resolve, reject) => {
        
        // Для видалення потрібна транзакція 'readwrite'
        const transaction = window.DB.INSTANCE.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        
        // Використовуємо метод 'delete' для видалення допису за ключем
        const request = store.delete(key); 
        
        // Обробка успішної транзакції
        // Важливо: 'onsuccess' викликається, навіть якщо допис не існував.
        request.onsuccess = () => {
                const endTime = performance.now();
                const duration = (endTime - startTime).toFixed(2);
                console.log(`✅ Видалення допису з сховища '${storeName}' успішно завершено за ${duration} мс.`);
            resolve(); 
        };
        
        // Обробка помилок
        request.onerror = (event) => {
            console.error("Помилка при видаленні допису:", event.target.error);
            reject(event.target.error);
        };
        
        // Обробка переривання транзакції
        transaction.onabort = () => {
             reject(new Error("Транзакція видалення була перервана."));
        };
    });
}

// Ключ допису, який потрібно видалити
const uuidToDelete = "e228a680-3ee4-47ff-b783-33f813f53be2"	;

async function removeTask() {
    try {
        console.log(`Спроба видалити допис з ключем: ${uuidToDelete}`);
        
        // Чекаємо, поки операція видалення завершиться
        await deleteRecordFromDB('tasks', uuidToDelete);
        
        console.log("✅ Допис успішно видалено (або його не існувало).");
        
    } catch (error) {
        console.error("❌ Не вдалося видалити допис:", error);
    }
}

//removeTask();

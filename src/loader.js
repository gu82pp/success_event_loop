/**
 * Клас QueueLoader для послідовного завантаження партій скриптів.
 * Приймає масив масивів: [['depA', 'depB'], ['mainLogic']].
 */
class QueueLoader {
    
    /**
     * Приватний метод для завантаження одного скрипта.
     * (Логіка залишається незмінною, використовує Promises для відстеження завантаження)
     * @param {string} url - Шлях до скрипта.
     * @returns {Promise<string>}
     */
    _loadSingleScript(url) {

        // 1. Початок вимірювання часу
        const startLoadTime = performance.now(); 

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.type = 'text/javascript';
            script.defer = true; 

            script.onload = () => {
                // 2. Кінець вимірювання часу та логування
                const endLoadTime = performance.now();
                const duration = (endLoadTime - startLoadTime).toFixed(2);
                
                // console.log(`✅ Завантажено: ${url} (Час: ${duration} мс)`);
                
                // Тепер ми можемо повернути не лише URL, але й дані про час
                resolve({ url, duration: parseFloat(duration) });
                // console.log(`✅ Завантажено: ${url}`);
                // resolve(url);
            };

            script.onerror = () => {
                console.error(`❌ Помилка: ${url}`);
                reject(new Error(`Не вдалося завантажити скрипт: ${url}`));
            };

            document.body.appendChild(script);
        });
    }

    // ------------------------------------------------------------------
    
    /**
     * Послідовно завантажує скрипти партіями.
     * @param {string[][]} batches - Масив масивів URL-адрес, де кожен внутрішній масив - це партія.
     * @returns {Promise<string[]>} Promise, що резолвиться після завантаження всіх партій.
     */
    async loadBatches(batches) {

        // 1. Початок вимірювання загального часу
        const overallStartTime = performance.now(); 
        let totalResults = [];

        // console.log(`🚀 Починаємо завантаження ${batches.length} партій.`);

        // Ітеруємо по кожній партії (внутрішньому масиву)
        for (const [index, batch] of batches.entries()) {
            // console.log(`\n--- Початок Партії ${index + 1} (${batch.length} скриптів) ---`);
            
            // Створюємо масив Promises для всіх скриптів у поточній партії
            const promises = batch.map(url => this._loadSingleScript(url));

            try {
                // Чекаємо, доки ВСІ скрипти в поточній партії завантажаться паралельно
                const batchResults = await Promise.all(promises);
                
                // Зберігаємо результати та переходимо до наступної партії
                totalResults = totalResults.concat(batchResults); 
                
                // console.log(`--- Партія ${index + 1} успішно завершена. ---`);

            } catch (error) {
                // Якщо хоча б один скрипт у партії не завантажився, перериваємо
                console.error(`❌ Критична помилка у Партії ${index + 1}. Операція перервана.`, error.message);
                throw error; // Викидаємо помилку для зовнішнього .catch
            }
        }

        // 2. Кінець вимірювання загального часу
        const overallEndTime = performance.now();
        const overallDuration = (overallEndTime - overallStartTime).toFixed(2); 
        

        // console.log("\n-----------------------------------------");
        // console.log("🎉 Усі партії скриптів завантажено успішно!");

        // Повертаємо загальний час, який минув
        console.log(`⏱️ Фактичний загальний час очікування (з моменту старту): ${overallDuration} мс`);
        

        return totalResults;
    }
}

// =================================================================
// 🚀 ВИКОРИСТАННЯ
// =================================================================

const loader = new QueueLoader();

// Черга завантаження:
const scriptQueue = [
    // Партія 1: Завантажуються паралельно
    [   
        './src/World.js',
        './src/utils/createDomElement.js',
        './src/utils/debugger.js',
        './src/utils/switchAnimation.js',
        './src/utils/Uuid.js',
    ], 
    
    // Партія 2: Завантажуються лише після завершення Партії 1, потім паралельно
    [
        // './src/components/1_buildHeaderCountentFooterOuter.js',
        './src/components/2_buildHeaderDOM.js',
        './src/components/3_buildHeaderButtonOuter.js',
        './src/components/4_buildContentDOM.js',
        './src/components/5_buildFooterDOM.js',
    ], 
    [
        './src/components/0_render.js',
    ]
];

loader.loadBatches(scriptQueue)
    .then(() => {
        // console.log('\nУсі залежності доступні. Запускаємо програму.');
    })
    .catch(error => {
        console.error('\nЗавантаження не вдалося. Перевірте мережу або шляхи до скриптів.');
    });
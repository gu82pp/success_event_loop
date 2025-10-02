

// Форматування часу (для відображення)
// Цей код замінює ваші оригінальні рядки:

/**
 * Обчислює час до наступного виконання завдання.
 * @param {number} lastCompletedAt - Unix-timestamp останнього виконання (секунди).
 * @param {number} repeatInterval - Інтервал повтору у хвилинах.
 * @returns {string} - HTML-рядок для відображення часу або червоного сповіщення.
 */
function getTaskCountdownHTML(lastCompletedAt, repeatInterval) {
    if (repeatInterval <= 0) {
        // Задача не має інтервалу повтору, не показуємо таймер
        return '—'; 
    }

    const now = Date.now(); // Поточний час у мілісекундах
    
    // Час наступного виконання у мілісекундах
    // lastCompletedAt (секунди) * 1000 + repeatInterval (хвилини) * 60 * 1000
    const nextExecutionTime = (lastCompletedAt + repeatInterval * 60) * 1000;
    
    const timeRemainingMs = nextExecutionTime - now;

    if (timeRemainingMs <= 0) {
        // Час виконання настав або минув
        return `<span style="color: red; font-weight: bold;">TODO!</span>`;
    }

    // Розрахунок часу, що залишився (годин, хвилин)
    const totalSeconds = Math.floor(timeRemainingMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    let countdownString = '';

    if (hours > 0) {
        countdownString += `${hours} год `;
    }
    countdownString += `${minutes} хв`;

    return countdownString.trim();
}

// --- Часткова зміна функції generateMetricsGroupHTML ---

function generateMetricsGroupHTML(data) {
    const formatTime = (minutes) => minutes > 0 ? `${minutes} хв` : 'N/A';
    
    // 🛑 ВИКЛИКАЄМО НОВУ ФУНКЦІЮ ДЛЯ ТАЙМЕРА
    const countdownHTML = getTaskCountdownHTML(data.lastCompletedAt, data.repeatInterval);

    // Збираємо окремі частини в один рядок
    const metricsContent = 
        generateMetricHTML('Очікуваний час', formatTime(data.estimatedTime)) +
        generateMetricHTML('Мін. час виконання', formatTime(data.minCompletionTime)) +
        generateMetricHTML('Виконано', `${data.completionCount} раз`) +
        // 🛑 ТУТ ВСТАВЛЯЄМО РЕЗУЛЬТАТ РОЗРАХУНКУ ТАЙМЕРА
        generateMetricHTML('Наступне вик.', countdownHTML); 
        
    return metricsContent;
}

/**
 * Генерує HTML-розмітку для одного елемента метрики.
 * @param {string} label - Текст мітки (наприклад, "Очікуваний час").
 * @param {string} value - Значення метрики (наприклад, "45 хв" або HTML для таймера).
 * @returns {string} - HTML-рядок елемента метрики.
 */
function generateMetricHTML(label, value) {
    return `
        <div class="metric-item">
            <span class="metric-value">${value}</span>
            <span class="metric-label">${label}</span>
        </div>
    `;
}

// Приклад використання:
// const countdown = getTaskCountdownHTML(taskData.lastCompletedAt, taskData.repeatInterval);

/**
 * Повертає Unix-таймштамп (у секундах) часу, який був 15 хвилин тому.
 * @returns {number} Unix-таймштамп у секундах.
 */
function getTimestampFifteenMinutesAgo() {
    // 1. Отримуємо поточний час у мілісекундах (стандартний результат Date.now())
    const nowInMs = Date.now();
    
    // 2. Визначаємо, скільки мілісекунд становить 15 хвилин
    // 15 хвилин * 60 секунд/хвилина * 1000 мілісекунд/секунда
    const fifteenMinutesInMs = 15 * 60 * 1000;
    
    // 3. Обчислюємо час 15 хвилин тому в мілісекундах
    const timeAgoInMs = nowInMs - fifteenMinutesInMs;
    
    // 4. Перетворюємо мілісекунди на секунди (Unix-таймштамп)
    // і округлюємо до найближчого цілого числа
    const timestampInSeconds = Math.floor(timeAgoInMs / 1000);
    
    return timestampInSeconds;
}


const sampleTasks = [
    { uuid: 'a1', section: 'blockers', title: 'Задача Б', description: 'Опис Б', benefit: 'Користь Б', estimatedTime: 15, lastCompletedAt: 1678886400, completionCount: 3, repeatInterval: 3600, minCompletionTime: 10 },
    { uuid: 'b2', section: 'drivers', title: 'Задача А', description: 'Опис А', benefit: 'Користь А', estimatedTime: 60, lastCompletedAt: getTimestampFifteenMinutesAgo(), completionCount: 1, repeatInterval: 60, minCompletionTime: 5 },
    { uuid: 'c3', section: 'accelerators', title: 'Задача В', description: 'Опис В', benefit: 'Користь В', estimatedTime: 20, lastCompletedAt: null, completionCount: 0, repeatInterval: 3600, minCompletionTime: 15 },
];

class Debugger
{
    static ENABLED = true;
    static MAX_TIMING_ENTRIES = 100; // Максимальна кількість записів часу виконання
    static Timimgs = []

    static logTime(label, executionTime, context = {}) {
        if (!this.ENABLED) return;
        this.Timimgs.push({ label, "time (ms)": executionTime, ...context });
        if (this.Timimgs.length > this.MAX_TIMING_ENTRIES) {
            this.Timimgs.shift(); // Видаляємо найстаріший запис
        }
    }

    static printTimings(params = {}) {
        if (!this.ENABLED) return;
        // console.table(this.Timimgs, params.fields);
    }
}

/**
 * Повертає звіт про пам'ять, яку використовує JavaScript-рушій.
 * Примітка: Доступно лише у Chrome/Vivaldi/Edge.
 * @returns {object} Об'єкт з інформацією про пам'ять.
 */
function getJSMemoryUsage() {
    if (window.performance && window.performance.memory) {
        const memory = window.performance.memory;

        return {
            totalJSHeapSize: (memory.totalJSHeapSize / 1024 / 1024).toFixed(2), // Загальний об'єм купи, МБ
            usedJSHeapSize: (memory.usedJSHeapSize / 1024 / 1024).toFixed(2),   // Використаний об'єм купи, МБ
            jsHeapLimit: (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)      // Ліміт, МБ
        };
    }
    return null;
}

// window.onerror = function(message, source, lineno, colno, error) {
//   console.error("Глобальна помилка часу виконання перехоплена:", {message, source, lineno, colno, error});
//   // Запобігає виклику обробника браузера за замовчуванням
//   return true; 
// };

// window.addEventListener('unhandledrejection', function(event) {
//   console.error('Неперехоплене відхилення промісу:', event.reason);
//   // Можна залогірувати, але *зазвичай* не запобігає "падінню" в суворих середовищах
//   // Втім, це дозволяє вам реагувати на них.
// });

function ShowDOMRenderTime() {
    // console.log("ShowDOMRenderTime");
    // element.setAttribute('elementtiming', "main-title");
    // https://developer.mozilla.org/en-US/docs/Web/API/PerformanceElementTiming
    const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            console.log(entry);
        });
    });
    observer.observe({ type: "element", buffered: true });
}
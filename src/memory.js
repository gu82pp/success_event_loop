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

const memory_stats = document.getElementById('memory_stats');
showStats();
setInterval(() => {
    showStats();
}, 1000);

function showStats() {
    if (memory_stats) {
        memory_stats.textContent = `Використано пам'яті JS: ${getJSMemoryUsage().usedJSHeapSize} МБ`;
    }
}
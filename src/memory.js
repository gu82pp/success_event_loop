/**
 * Повертає звіт про пам'ять, яку використовує JavaScript-рушій.
 * Примітка: Доступно лише у Chrome/Vivaldi/Edge.
 * @returns {object} Об'єкт з інформацією про пам'ять.
 */
function getJSMemoryUsage() {
    if (window.performance && window.performance.memory) {
        const memory = window.performance.memory;
        console.log('Memory info:', window.performance);
        
        return {
            totalJSHeapSize: (memory.totalJSHeapSize / 1024 / 1024).toFixed(2), // Загальний об'єм купи, МБ
            usedJSHeapSize: (memory.usedJSHeapSize / 1024 / 1024).toFixed(2),   // Використаний об'єм купи, МБ
            jsHeapLimit: (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)      // Ліміт, МБ
        };
    }
    return null;
}

setTimeout(() => {
    const memoryStats = getJSMemoryUsage();
    if (memoryStats) {
        console.log(`Використано пам'яті JS: ${memoryStats.usedJSHeapSize} МБ`);
        // ... логіка перевірки та очищення ...
    }
}, 500);

/**
 * Генерує унікальний ID, використовуючи найкращий доступний метод:
 * 1. Спробує crypto.randomUUID() (довгий, криптографічно безпечний).
 * 2. Якщо недоступний, використовує Math.random() + toString(36) (короткий, швидкий).
 * * @param {boolean} [preferShort=false] - Якщо true, завжди повертає короткий ID, якщо доступний.
 * @returns {string} Унікальний або псевдоунікальний ID.
 */
function generateSafeID(preferShort = false) {
    // 1. Внутрішня функція для генерації короткого, псевдоунікального ID
    const generateShortID = () => {
        // Комбінація мітки часу та випадкового числа для кращої унікальності
        const timePart = Date.now().toString(36); 
        const randomPart = Math.random().toString(36).slice(2, 6);
        return `${timePart}-${randomPart}`;
    };

    if (preferShort) {
        // Якщо ми свідомо хочемо короткий ID АБО crypto недоступний
        return generateShortID();
    }

    // 2. Перевірка наявності нативного API
    const isCryptoAvailable = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function';

    if (preferShort || !isCryptoAvailable) {
        // Якщо ми свідомо хочемо короткий ID АБО crypto недоступний
        return generateShortID();
    }
    
    // 3. Використання найшвидшого нативного методу (якщо доступний і не вимагається короткий ID)
    if (isCryptoAvailable) {
        return crypto.randomUUID();
    }

    // Це має бути недосяжно, але як остання ланка безпеки
    return generateShortID(); 
}
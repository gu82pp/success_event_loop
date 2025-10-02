/**
 * Парсить простий Emmet-подібний рядок, створює DOM-елементи та повертає їх.
 *
 * @param {string} emmetString - Рядок для парсингу (наприклад: 'div#page>header.main>p.intro').
 * @returns {{elements: HTMLElement[], htmlString: string}} - Об'єкт із масивом елементів та HTML-рядком.
 */
function parseEmmetToDOMAndHTML(emmetString) {
    const allElements = [];
    const parts = emmetString.split('>'); 

    let currentParent = null; 
    let rootElement = null; // Зберігаємо посилання на найперший створений елемент

    parts.forEach(part => {
        const cleanPart = part.trim();
        if (!cleanPart) return;

        // --- 1. ПАРСИНГ ---
        let tagName = 'div';
        let id = '';
        const classes = [];
        let cursor = 0;

        const match = cleanPart.match(/^([a-z0-9]+)?(#[\w-]+)?(\.[\w-]+)*/i);

        if (match) {
            if (match[1]) {
                tagName = match[1];
                cursor += tagName.length;
            }
            if (match[2]) {
                id = match[2].substring(1); 
                cursor += match[2].length;
            }
            const classMatches = cleanPart.substring(cursor).matchAll(/\.([\w-]+)/g);
            for (const classMatch of classMatches) {
                classes.push(classMatch[1]);
            }
        }

        // --- 2. СТВОРЕННЯ ЕЛЕМЕНТА ---
        const newElement = document.createElement(tagName);

        if (id) {
            newElement.id = id;
        }

        if (classes.length > 0) {
            newElement.className = classes.join(' ');
        }

        // --- 3. ВКЛАДЕННЯ ТА ЗБЕРІГАННЯ КОРЕНЯ ---
        if (!rootElement) {
            // Зберігаємо посилання на найперший елемент як корінь
            rootElement = newElement; 
        }

        if (currentParent) {
            // Вкладаємо новий елемент у поточний батьківський
            currentParent.appendChild(newElement);
        }
        
        // --- 4. ОНОВЛЕННЯ ---
        allElements.push(newElement);
        currentParent = newElement; 
    });

    // --- 5. ФІНАЛЬНИЙ РЕЗУЛЬТАТ ---
    const htmlOutput = rootElement ? rootElement.outerHTML : '';

    return {
        elements: allElements,
        htmlString: htmlOutput
    };
}

// ==========================================================
// ПРИКЛАД ВИКОРИСТАННЯ
// ==========================================================

const emmetSnippet = 'section#main.content.visible';
const result = parseEmmetToDOMAndHTML(emmetSnippet);

console.log("-----------------------------------------");
console.log("1. Плаский масив елементів (DOM objects):", result.elements);

console.log("-----------------------------------------");
console.log("2. Готовий HTML-рядок (Ready to insert):");
console.log(result.htmlString);

// Перевірка вставлення у DOM
// (Цей код не буде працювати в консолі, але показує ідею)
document.getElementById('emmet').innerHTML = result.htmlString;



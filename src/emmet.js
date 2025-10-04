const domStructure = {
    tag: "div",
    id: "root",
    className: "main page container",
    
    // Властивість 'children' одразу описує ієрархію
    children: [
        {
            tag: "header",
            children: [
                { tag: "h1", text: "Заголовок сторінки" }
            ]
        },
        {
            tag: "main",
            children: [
                { tag: "div", className: "content-box" },
                { tag: "div", className: "sidebar" }
            ]
        }
    ]
};

function buildDOM(structure) {
    // 1. Створюємо базовий елемент
    const element = document.createElement(structure.tag || 'div');

    // 2. Додаємо атрибути
    if (structure.id) {
        element.id = structure.id;
    } else {
        element.id = generateSafeID(1)
    }

    if (structure.className) {
        element.className = structure.className; 
    }

    if (structure.textContent) {
        element.textContent = structure.textContent;
    } else {
        element.textContent = "id: " + element.id + " | class: " + element.className;
    }

    // 3. Рекурсивно додаємо дочірні елементи
    if (structure.children && Array.isArray(structure.children)) {
        structure.children.forEach(childStructure => {
            // Рекурсивний виклик
            element.appendChild(buildDOM(childStructure)); 
        });
    }

    return element;
}

// Приклад використання (оптимізований через DocumentFragment):
function createOptimizedDOM(structure, targetNode) {
    const fragment = document.createDocumentFragment();
    const rootElement = buildDOM(structure);
    fragment.appendChild(rootElement);
    targetNode.appendChild(fragment);
}

// Викликаємо функцію, передаючи дерево та місце в DOM
createOptimizedDOM(domStructure, document.body);
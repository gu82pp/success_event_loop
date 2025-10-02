class Form 
{
    static list = {};

    static getElement(name) {
        return Div.list[name] || null;
    }

    static createInput(param) {
        // 1. Створюємо основний контейнер Bootstrap (для групування мітки та інпуту)
        const formFloating = document.createElement('div');
        formFloating.className = 'form-floating mb-3'; // mb-3 додає нижній відступ

        // 2. Створюємо сам елемент <input>
        const input = document.createElement('input');
        input.className = 'form-control'; 
        input.setAttribute('id', param.id);
        input.setAttribute('type', param.type || 'text');
        input.setAttribute('placeholder', param.placeholder || param.label || '');

        // 3. Створюємо елемент <label>
        const label = document.createElement('label');
        label.setAttribute('for', param.id);
        label.textContent = param.label;

        // 4. Збираємо структуру: input та label вставляємо в контейнер
        // Важливо: для .form-floating інпут має йти перед міткою в DOM!
        formFloating.appendChild(input);
        formFloating.appendChild(label);

        return formFloating;
    }
}




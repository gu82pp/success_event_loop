function render() {
    const page = document.getElementById("page");
    const layout = buildHeaderCountentFooterOuter();
    const header = buildHeaderDOM()
    const content = buildContentDOM()
    const footer = buildFooterDOM() // це можна і відкласти на пізніше

    // Створення нового фрагменту
    const fragment = document.createDocumentFragment();

    // Додавання елементів до фрагменту
    fragment.appendChild(header);
    fragment.appendChild(content);
    fragment.appendChild(footer);

    layout.appendChild(fragment);

    // Вставка фрагменту в DOM
    page.appendChild(layout);
    return false;
}
render()
console.log("remembered", World.Items, World.ItemsData)
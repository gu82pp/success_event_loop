function main() {
    loadTasksFromDB();
    setupEventListeners();
    renderTasks();
    startTimers();
}


function showPage(pageName) {
    const page = Div.getElement(pageName);
    if (page) {
        // add class .d-block and remove .d-none
        page.classList.add('d-block');
        page.classList.remove('d-none');
    }
}

function hidePage(pageName) {
    const page = Div.getElement(pageName);
    if (page) {
        // add class .d-block and remove .d-none
        page.classList.add('d-none');
        page.classList.remove('d-block');
    }
}

function showAddTaskPage() {
    // Div.getElement("uuid")
    showPage("page-new-task");
    hidePage("page-task-list");
    Div.getElement("uuid").textContent = crypto.randomUUID();
}

function showBlockersPage() {
    showPage("page-task-list");
    hidePage("page-new-task");
}
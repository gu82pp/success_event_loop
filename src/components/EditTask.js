class EditTaskPage 
{
    static scope = "edit_task_page";

    static get root() {
        return {
            tag: "div", id: "outer", className: "container", scope: EditTaskPage.scope,
            children: [EditTaskPage.inner]
        }
    };

    static get inner() {
        return {
            tag: "div", id: "inner", className: "container", scope: EditTaskPage.scope,
            textContent: "Edit task page",
            children: []
        }
    };
}

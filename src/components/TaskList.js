class TaskListPage
{
    static scope = "task_list_page";

    static get root() {
        return {
            tag: "div", id: "outer", className: "container", scope: TaskListPage.scope,
            children: [TaskListPage.inner]
        }
    };

    static get inner() {
        return {
            tag: "div", id: "inner", className: "container", scope: TaskListPage.scope,
            textContent: "Task list page",
            data: {
                onClick: function() {
                    console.log("Clicked on TaskListPage");
                }
            },
            children: []
        }
    };
}

class NewTaskPage 
{
    element = null;
    static scope = "new_task_page";

    static get root() {
        return { 
            tag: "div", id: "outer", className: "container", scope: NewTaskPage.scope,
            children: [NewTaskPage.inner]
        }
    };

    static get inner() {
        return {
            tag: "div", id: "inner", className: "container", scope: NewTaskPage.scope,
            textContent: "New task page",
            data: {
                // onClick: updateInnerText
            },
            children: []
        }
    };

    constructor() {
        this.element = document.createElement('div');
    }
}
class NewTaskPage 
{
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
                onClick: updateInnerText
            },
            children: []
        }
    };

    addChildren(children = []) {
        
    }

    constructor(scope = "") {
        this.scope = scope;

        // todo: decoration:
    }
}

Div.create({
    children: [
        Div.create({name: "page-new-task", className: "d-none"}),
        Div.create({name: "page-edit-task", className: "d-none"}),
        Div.create({name: "page-task-list", className: "d-block" })
    ]
})

/*
section#main.content.visible


div#test.inner-test
    > div#inner-test.test-class
        + p#paragraph.test-paragraph Another paragraph
            + span.highlighted Highlighted text
    + footer#page-footer.footer-class
        > p Footer content
            + a[href="#"] Link in footer

[div#test.inner-test]

- indents are important
*/
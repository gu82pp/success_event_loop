class Task {
    static list = [];
    
    static create(task) {
        task.uuid = crypto.randomUUID()
        task.lastCompletedAt = null; // час останнього виконання задачі
        task.completionCount = 0; // скільки разів я виконав цю задачу
        task.isArchived = false; // чи архівна це задача
        task.lastUpdatedAt = Math.floor(Date.now() / 1000); // час останнього оновлення задачі
        this.list.push(task);
        return task;
    }
    
    static read(uuid) {
        // Оскільки це статичний метод, 'this' посилається на сам клас.
        const task = this.list.find((t) => t.uuid === uuid);

        if (!task) {
            // Виводимо попередження в консоль, якщо елемент не знайдено.
            // console.warn використовується для важливих, але не критичних помилок.
            console.warn(`[Task] Задача з UUID "${uuid}" не знайдена.`, Task.list);
            return null;
        }

        // Повертаємо знайдений об'єкт
        return task;
    }

    static update(updatedTask) {
        const index = this.list.findIndex(task => task.uuid === updatedTask.uuid);
        if (index !== -1) {
            // loop through keys of updatedTask and update only those keys in this.list[index]
            for (const key in updatedTask) {
                if (updatedTask.hasOwnProperty(key)) {
                    this.list[index][key] = updatedTask[key];
                }
            }
            
            this.list[index].lastUpdatedAt = Math.floor(Date.now() / 1000);
            
            return true;
        }
        
        return false;
    }
    
    static delete(uuid) {
        this.list = this.list.filter(task => task.uuid !== uuid);
    }

    static all() {
        return this.list;
    }

    // tasks active by section (blockers, drivers, accelerators)
    static getBySection(section) {
        return this.list.filter(task => task.section === section && !task.isArchived);
    }

    // tasks active by categoryUuid
    static getByCategoryUuid(categoryUuid) {
        return this.list.filter(task => task.categoryUuid === categoryUuid && !task.isArchived);
    }

    // tasks active by category
    static getByCategory(category) {
        return this.list.filter(task => task.category === category && !task.isArchived);
    }

    // archived tasks
    static getArchived() {
        return this.list.filter(task => task.isArchived);
    }

    // active tasks
    static getActive() {
        return this.list.filter(task => !task.isArchived);
    }

    // tasks due for repetition
    static getDueTasks() {
        const now = Math.floor(Date.now() / 1000);
        return this.list.filter(task => {
            if (!task.lastCompletedAt) return true; // never completed
            const nextDueTime = task.lastCompletedAt + (task.repeatInterval * 3600);
            return now >= nextDueTime;
        });
    }

    static markAsCompleted(uuid) {
        const task = this.read(uuid);
        if (task) {
            task.lastCompletedAt = Math.floor(Date.now() / 1000);
            task.completionCount += 1;
            this.update(task);
            return true;
        }

        console.warn(`Task with UUID ${uuid} not found.`);
        return false;
    }

    static archive(uuid) {
        const task = this.read(uuid);
        if (task) {
            task.isArchived = true;
            this.update(task);
            return true;
        }
        return false;
    }

    static unarchive(uuid) {
        const task = this.read(uuid);
        if (task) {
            task.isArchived = false;
            this.update(task);
            return true;
        }
        return false;
    }

}

for (const task of fakeTasks) {
    Task.create(task);
}

console.log("Task.list", Task.all(), Task.getByCategory("blockers"));

// console.table(Task.getAll());
/*
Task.update({
    uuid: firstTask.uuid,
    title: "Моє перше завдання (оновлене)", // назва задачі
    description: "Опис мого першого завдання (оновлене)", // опис задачі
    benefit: "Я навчився створювати задачі (оновлене)", // користь від виконання задачі
});

console.table(Task.getAll());
*/
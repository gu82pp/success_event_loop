/**
 *      TODO: 
 *      - Опиши порядок завантеження скриптів у Loader.js
 *      - Оброби помилки
 *      - Стеж за памяттю, щоб не було витоків
 */
class World
{
    static Items = {};
    static ItemsData = {}

    static itemsList() {
        // TODO: що покаже, коли ітем буде видалений? там буде undefined?
    }
    
    /**
     * destroy Node with children:
     */
    destroyItem() {
        // TODO: find all children and delete them from Items
    }

    static getElement(uuid) {
        // console.log("this.Items", this.Items)
        return this.Items[uuid].element;
    }
}
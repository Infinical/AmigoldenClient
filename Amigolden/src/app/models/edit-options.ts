import { IEditController } from './interfaces/interfaces';
export class EditOptions implements IEditController {
    constructor(saveImpl: () => void = () => {}) {
        this.saveImpl = saveImpl;
    }

    isSearchEnabled ? = false;
    isEditing = false;
    canEdit = false;
    save: () => void = () => {
        this.saveImpl();
        this.toggleEdit();
    }
    toggleEdit() {
        this.isEditing = !this.isEditing;
    }

    private saveImpl: () => void = () => {};
}

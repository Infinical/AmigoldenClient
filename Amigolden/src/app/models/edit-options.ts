import { IEditController } from './interfaces/interfaces';
export class EditOptions implements IEditController {
    isSearchEnabled ? = false;
    isEditing = false;
    canCreate ? = false;
    canEdit = false;
    save: () => void = () => { };
}

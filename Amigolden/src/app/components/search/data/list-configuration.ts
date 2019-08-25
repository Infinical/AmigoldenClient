import { Observable } from 'rxjs';
import { EventEmitter } from '@angular/core';

export class ListConfigurationArgs<T> {
    isSliding?: boolean;
    isReverse?: boolean;
    isSinglePage?: boolean;
    onItemClick: (entity: any) => void;
    defaultPagingInfo?: PagingInfo;
    canDelete?: boolean;
    onDelete?: (entity: any) => Observable<any>;
    refresh?: EventEmitter<any>;
    getList: (pagingInfo: PagingInfo) => Observable<T[]>;
}

export class ListConfiguration<T> extends ListConfigurationArgs<T> {

    // tslint:disable-next-line:variable-name
    private _filter = '';
    get filter() { return this._filter; }
    set filter(value) {
        this._filter = value;
        this.refresh.emit();
    }

    constructor({
        isSliding = false,
        isReverse = false,
        isSinglePage = false,
        onItemClick = (entity: any) => {},
        defaultPagingInfo = new PagingInfo(),
        canDelete = false
    }: ListConfigurationArgs<T>) {
        super();
    }
}

export class PagingInfo {
    constructor(public pageSize = 50, public pageNumber = 1) {
    }
}

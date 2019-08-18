import { Observable } from 'rxjs';
import { EventEmitter } from '@angular/core';

export class ListConfiguration<T> {
    canDelete: boolean;
    onDelete?: (entity: any) => Observable<any>;
    refresh ? = new EventEmitter<any>();
    getList: (pagingInfo: PagingInfo) => Observable<T[]>;

    // TODO: onItemClick: (entity: T) => void;
    onItemClick: (entity: any) => void;
    defaultPagingInfo = new PagingInfo();
    isSliding ? = false;
    isReverse ? = false;
    isSinglePage = false;
}

export class PagingInfo {
    constructor(public pageSize = 10, public pageNumber = 1) {
    }
}

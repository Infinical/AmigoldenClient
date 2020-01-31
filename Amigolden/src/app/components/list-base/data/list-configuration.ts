import { Observable } from 'rxjs';
import { EventEmitter } from '@angular/core';

export class ListConfigurationOptionalArgs {
    isSliding?: boolean;
    isReverse?: boolean;
    isSinglePage?: boolean;
    defaultPagingInfo?: PagingInfo;
    slidingListConfig?: SlidingListConfiguration;
}

export class SlidingListConfiguration {

    public isSliding = false;
    public onDelete?: (entity: any) => Observable<any>;

    constructor(onDelete?: (entity: any) => Observable<any>) {
        if (onDelete) {
            this.onDelete = onDelete;
            this.isSliding = true;
        }
    }
}

export class ListConfiguration<T> extends ListConfigurationOptionalArgs {
    getList: (pagingInfo: PagingInfo) => Observable<T[]>;
    refresh = new EventEmitter<any>();

    // tslint:disable-next-line:variable-name
    _filter = '';
    get filter(): string {
        return this._filter;
    }
    set filter(value) {
        this._filter = value;
        this.refresh.emit();
    }

    constructor(getList: (pagingInfo: PagingInfo) => Observable<T[]>, {
        isSliding = false,
        isReverse = false,
        isSinglePage = false,
        defaultPagingInfo = new PagingInfo(),
        slidingListConfig = new SlidingListConfiguration(),
    }: ListConfigurationOptionalArgs) {
        super();

        this.getList = getList;
        this.isSliding = isSliding;
        this.isReverse = isReverse;
        this.isSinglePage = isSinglePage;
        this.defaultPagingInfo = defaultPagingInfo;
        this.slidingListConfig = slidingListConfig;
    }
}

export class PagingInfo {
    constructor(public pageSize = 50, public pageNumber = 1) {
    }
}

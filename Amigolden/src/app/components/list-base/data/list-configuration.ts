import { Observable } from 'rxjs';
import { EventEmitter } from '@angular/core';

export class ListConfigurationOptionalArgs {
    isSliding?: boolean;
    isReverse?: boolean;
    isSinglePage?: boolean;
    onItemClick: (entity: any) => void;
    defaultPagingInfo?: PagingInfo;
    slidingListConfig?: SlidingListConfiguration;
    applyODataFilter?: (searchTerm: string) => string;
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

    // tslint:disable-next-line:variable-name
    private _filter = '';
    get filter() { return this._filter; }
    set filter(value) {
        if (this.applyODataFilter == null) {
            return;
        }

        this._filter = this.applyODataFilter(value);
        this.refresh.emit();
    }

    getList: (pagingInfo: PagingInfo) => Observable<T[]>;
    refresh = new EventEmitter<any>();

    constructor(getList: (pagingInfo: PagingInfo) => Observable<T[]>, {
        isSliding = false,
        isReverse = false,
        isSinglePage = false,
        onItemClick = (entity: any) => {},
        defaultPagingInfo = new PagingInfo(),
        slidingListConfig = new SlidingListConfiguration(),
        applyODataFilter,
    }: ListConfigurationOptionalArgs) {
        super();

        this.getList = getList;
        this.isSliding = isSliding;
        this.isReverse = isReverse;
        this.isSinglePage = isSinglePage;
        this.onItemClick = onItemClick;
        this.defaultPagingInfo = defaultPagingInfo;
        this.slidingListConfig = slidingListConfig;
        this.applyODataFilter = applyODataFilter;
    }
}

export class PagingInfo {
    constructor(public pageSize = 50, public pageNumber = 1) {
    }
}

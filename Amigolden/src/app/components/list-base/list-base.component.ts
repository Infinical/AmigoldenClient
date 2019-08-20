import { Component, OnInit, Output, EventEmitter,
         TemplateRef, Input, ElementRef,
         IterableDiffers, DoCheck } from '@angular/core';
import { ListConfiguration } from 'src/app/models/list-configuration';
import { IHasId } from 'src/app/models/interfaces/interfaces';

@Component({
  selector: 'app-list-base',
  templateUrl: './list-base.component.html',
  styleUrls: ['./list-base.component.scss'],
})
export class ListBaseComponent<T extends IHasId> implements OnInit, DoCheck {

  @Output() itemAdded = new EventEmitter<T>();
  @Output() itemRemoved = new EventEmitter<T>();
  @Input() template: TemplateRef<any>;
  @Input() set config(config: ListConfiguration<T>) {
      this._config = config;
      this.subscribeRefresh();
      this.refresh();
  }

  get config() {
    return this._config;
  }
  // tslint:disable-next-line:variable-name
  private _config: ListConfiguration<T>;
  private differ: any;

  entityList: T[];
  isPagingComplete = false;
  isPagingEnabled = true;

  constructor(public elementRef: ElementRef, public differs: IterableDiffers) {
    this.differ = differs.find([]).create(null);
  }

  private subscribeRefresh() {
      if (this.config.refresh) {
          this.config.refresh.subscribe(() => {
              this.refresh();
          });
      }
  }

  onAdded(item) {
      this.itemAdded.emit(item);
  }

  onRemoved(item) {
      this.itemRemoved.emit(item);
  }

  // TODO: removing item from list should check assure list
  removeItemFromList(entity) {
      this.entityList = this.entityList.filter(e => e !== entity);

      setTimeout(() => { this.assureInfiniteScrollIsPopulated(); });
  }

  ngDoCheck() {
      this.checkForChanges();
  }

  checkForChanges() {
      const changes = this.differ.diff(this.entityList);
      if (!changes) {
          return;
      }

      changes.forEachAddedItem((record) => {
          this.onAdded(record.item);
      });

      changes.forEachRemovedItem((record) => {
          this.onRemoved(record.item);
      });
  }

  refresh(infiniteScroll?: any) {
      this.clearPagination();
      this.getPage(1, infiniteScroll);
  }

  clearPagination() {
      this.config.defaultPagingInfo.pageNumber = 1;
      this.isPagingComplete = false;
      this.isPagingEnabled = true;
  }

  ngOnInit() {}

  loadData(infiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {

        this.getNextPage(infiniteScroll);
        console.log('Async operation has ended');
    }, 500);
  }

  assureInfiniteScrollIsPopulated() {

    if (this.isPagingComplete) {
        return;
    }

    // Do this after the dom is rendered
    setTimeout(() => {
        const scrollContent = this.elementRef.nativeElement.closest('.scroll-content');

        if (!scrollContent) {
            return;
        }

        if (!this.isVScrollable(scrollContent)) {
            this.getNextPage();
        }
    });
  }

  isVScrollable(nativeElement: any) {
      return nativeElement.scrollHeight > nativeElement.clientHeight;
  }

  canPage(): boolean {
    return !this.isPagingEnabled || this.isPagingComplete;
  }

  getPage(pageNumber: number = 1, infiniteScroll?: any) {
    this.config.defaultPagingInfo.pageNumber = pageNumber;
    this.getNextPage(infiniteScroll);
  }

  getNextPage(infiniteScroll?: any) {
    if (this.canPage()) {
        infiniteScroll.target.complete();
        return;
    }

    this.isPagingEnabled = false;
    this.config.getList(this.config.defaultPagingInfo).subscribe(entities => {
            // Clear the list if this is the first page loaded
            // Clear the page in the subscribe to have double buffering effect
            if (this.config.defaultPagingInfo.pageNumber === 1) {
                this.entityList = [];
            }

            this.addEntitiesToPage(entities);

            this.config.defaultPagingInfo.pageNumber++;

            // TODO: create an internal set of paging options so chaning the config values wont affect this
            if (this.config.isSinglePage || this.config.defaultPagingInfo.pageSize > entities.length) {
                this.isPagingComplete = true;
                return;
            }

            this.assureInfiniteScrollIsPopulated();

        }, () => {},
        () => {
            this.isPagingEnabled = true;
            if (infiniteScroll) {
                infiniteScroll.target.complete();
            }
        });
  }

  addEntitiesToPage(entities: T[]) {
    (this.config && this.config.isReverse) ?
    this.entityList = entities.reverse().concat(this.entityList) :
    this.entityList = this.entityList.concat(entities);
  }

  delete(entity: number) {
    if (this.config.onDelete != null) {
        this.config.onDelete(entity).subscribe(x => this.removeItemFromList(entity));
        return;
    }

    this.removeItemFromList(entity);
  }
}

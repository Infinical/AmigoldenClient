import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SearchSettings } from './data/search-settings';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {

  @Input() settings = new SearchSettings();

  // we must rename the event search is an native
  // event and will trigger when enter is pressed
  @Output() searchFilter = new EventEmitter<any>();

  searchTerm = '';
  // Hack: Timer doesn't want to fucking install
  searchDelayTimer: any;

  constructor() { }

  searchTermChange() {
    clearTimeout(this.searchDelayTimer);
    this.searchDelayTimer = setTimeout(() => {
      this.searchFilter.emit(this.searchTerm);
    }, this.settings.searchDelayMS);
  }

  ngOnInit() {}

}

import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SearchSettings } from './data/search-settings';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {

  @Input() settings: SearchSettings;
  @Output() odataFilterChanged = new EventEmitter<string>();

  searchTerm = '';
  // Hack: Timer doesn't want to fucking install
  searchDelayTimer: any;

  constructor() { }

  searchTermChange() {
    clearTimeout(this.searchDelayTimer);
    this.searchDelayTimer = setTimeout(() => {
      const odataFilter = this.settings.applyODataFilter(this.searchTerm);
      this.odataFilterChanged.emit(odataFilter);
    }, this.settings.searchDelayMS);
  }

  ngOnInit() {}

}

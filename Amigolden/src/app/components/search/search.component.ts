import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SearchSettings } from './data/search-settings';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {

  @Input() settings = new SearchSettings();
  @Output() search = new EventEmitter<any>();

  searchTerm = '';
  searchDelayTimer: NodeJS.Timer;

  constructor() { }

  searchTermChange() {
    clearTimeout(this.searchDelayTimer);
    this.searchDelayTimer = setTimeout(() => {
      this.search.emit(this.searchTerm);
    }, this.settings.searchDelayMS);
  }

  ngOnInit() {}

}

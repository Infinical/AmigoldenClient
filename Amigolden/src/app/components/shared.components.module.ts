import { NgModule } from '@angular/core';
import { ListBaseComponent } from './list-base/list-base.component';
import { SearchComponent } from './search/search.component';

@NgModule({
    declarations: [ListBaseComponent, SearchComponent],
    exports: [ListBaseComponent, SearchComponent]
})
export class SharedComponentsModule {}

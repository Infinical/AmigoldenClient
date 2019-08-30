import { NgModule } from '@angular/core';
import { ListBaseComponent } from './list-base/list-base.component';
import { SearchComponent } from './search/search.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
    imports: [CommonModule,
        FormsModule,
        IonicModule],
    declarations: [ListBaseComponent, SearchComponent],
    exports: [ListBaseComponent, SearchComponent]
})
export class SharedComponentsModule {}

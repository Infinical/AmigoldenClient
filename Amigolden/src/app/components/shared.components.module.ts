import { NgModule } from '@angular/core';
import { ListBaseComponent } from './list-base/list-base.component';
import { SearchComponent } from './search/search.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { InlineEditComponent } from './inline-edit/inline-edit';

@NgModule({
    imports: [CommonModule,
        FormsModule,
        IonicModule],
    declarations: [ListBaseComponent, SearchComponent, InlineEditComponent],
    exports: [ListBaseComponent, SearchComponent, InlineEditComponent]
})
export class SharedComponentsModule {}

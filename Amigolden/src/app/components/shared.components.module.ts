import { NgModule } from '@angular/core';
import { ListBaseComponent } from './list-base/list-base.component';
import { SearchComponent } from './search/search.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { InlineEditComponent } from './inline-edit/inline-edit';
import { StripeCardComponent } from './stripe-card/stripe-card.component';
import { AgmCoreModule } from '@agm/core';
import { MapComponent } from './map/map.component';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';

@NgModule({
    imports: [CommonModule,
        FormsModule,
        IonicModule,
        AgmCoreModule,
        AgmSnazzyInfoWindowModule,
    ],
    entryComponents: [MapComponent],
    declarations: [ListBaseComponent, SearchComponent, InlineEditComponent, StripeCardComponent, MapComponent],
    exports: [ListBaseComponent, SearchComponent, InlineEditComponent, StripeCardComponent, MapComponent]
})
export class SharedComponentsModule {}

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
import { VoteListPage } from '../pages/vote/vote-list/vote-list.page';
import { ProfilePictureUploadComponent } from './profile-picture-upload/profile-picture-upload';

@NgModule({
    imports: [CommonModule,
        FormsModule,
        IonicModule,
        AgmCoreModule,
        AgmSnazzyInfoWindowModule,
    ],
    entryComponents: [MapComponent, VoteListPage, ProfilePictureUploadComponent],
    declarations: [ListBaseComponent, SearchComponent, InlineEditComponent,
         StripeCardComponent, MapComponent, VoteListPage, ProfilePictureUploadComponent],
    exports: [ListBaseComponent, SearchComponent, InlineEditComponent,
        StripeCardComponent, MapComponent, VoteListPage, ProfilePictureUploadComponent]
})
export class SharedComponentsModule {}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { User } from 'src/app/models/user';
import moment from 'moment';
import { DetailPageBase } from '../detail-page-base';
import { ConversationsService } from 'src/app/services/endpoints/conversations.service';
import { UsersEndpointService } from 'src/app/services/endpoints/users-endpoint.service';
import { Identity } from 'src/app/services/identity/identity.service';
import { FileService } from 'src/app/services/documents/file.service';
import { ModalController } from '@ionic/angular';
import { EditOptions } from 'src/app/models/edit-options';
import { ProfilePictureService } from 'src/app/services/documents/profile-picture.service';
import { RouteNames } from 'src/app/app-routing.module';
import { ProfilePictureUploadComponent } from 'src/app/components/profile-picture-upload/profile-picture-upload';
import { AMGDocument } from 'src/app/models/document';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.page.html',
  styleUrls: ['./user-detail.page.scss'],
})
export class UserDetailPage extends DetailPageBase<User> implements OnInit {
  pageName = 'Profile';

  editOptions = new EditOptions(() => this.save());

  constructor(protected route: ActivatedRoute, protected router: Router, protected usersService: UsersEndpointService,
              protected fileService: FileService, protected conversationService: ConversationsService,
              protected modalCtrl: ModalController, protected profilePictureService: ProfilePictureService,
              protected identity: Identity) {
    super(route, router, usersService);
  }

  ngOnInit() {
    this.identity.getCurrentUser().then((u) => { this.editOptions.canEdit = this.entityId === u.id; });
  }

  reloadProfilePictureUrl() {
      if (this.entity.profilePictureId == null) {
          return;
      }

      this.profilePictureService.setProfilePictureUrl(this.entity);
  }

  async showProfilePictureModal() {
    const modal = await this.modalCtrl.create({
      component: ProfilePictureUploadComponent,
      componentProps: {
        fileProvider: this.fileService,
        profilePictureUrl: this.entity.profilePictureUrl
      }
    });

    modal.onDidDismiss().then(data => {

      const profilePictureDocument: AMGDocument = data.data;
      if (profilePictureDocument == null) {
          return;
      }

      const oldId = this.entity.profilePictureId;
      this.entity.profilePictureId = profilePictureDocument.id;
      this.save().subscribe(u => {
          this.entity = u;
          this.reloadProfilePictureUrl();
      }, error => {
          this.entity.profilePictureId = oldId;
          console.log(error);
      });
   });

    return await modal.present();
  }

  // id is the user id consider taking this from the base entityId
  navigateToMessages(id: number) {
      // TODO: you probably should not allow conversations to occur between yourself
      this.conversationService.getOrCreateNew(this.entity.id).subscribe(entity => {
        const navigationExtras: NavigationExtras = {
          state: {
            entity,
            entityId: entity.id
          }
        };

        this.router.navigate([RouteNames.messages, entity.id], navigationExtras);
      });
  }

  getAge = () => {
      if (this.entity) {
          return moment().diff(this.entity.birthday, 'years');
      }
  }
}

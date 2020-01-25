import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { FileService } from './file.service';
import { User } from 'src/app/models/user';

@Injectable({
    providedIn: 'root'
})
export class ProfilePictureService  {
  constructor(public http: HttpClient, public fileService: FileService) {

  }

  setProfilePictureUrl(user: User) {
    if (!user) {
        return;
    }

    // TODO: consider setting the default url in the user dto,
    // and just mapping the changes from loaded entity onto the default in the map entity
    // Note: set the default profile picture url always
    // so we don't see a broken image when waiting to load
    user.profilePictureUrl = 'http://modexenergy.com/wp-content/themes/modex_wp/img/avatar.png';

    if (user.profilePictureId == null) {
        return;
    }

    this.fileService.download(user.profilePictureId).subscribe(
        file => this.setProfileImageFromBlob(file, user));
  }

  setProfileImageFromBlob(image: Blob, user: User) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
         user.profilePictureUrl = reader.result;
      }, false);

      if (image) {
         reader.readAsDataURL(image);
      }
   }
}

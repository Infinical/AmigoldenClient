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
      if (!user || user.profilePictureId == null) {
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

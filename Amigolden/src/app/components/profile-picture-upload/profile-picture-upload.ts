import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { FileService } from 'src/app/services/documents/file.service';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { ModalController } from '@ionic/angular';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AMGDocument } from 'src/app/models/document';
// import { ImageCropperComponent, CropperSettings, Bounds} from 'ng2-img-cropper';
// import { Headers, RequestOptions } from '@angular/http';
// import { Observable } from 'rxjs/Rx';
// import { NavParams, ViewController } from 'ionic-angular';
// import { Document } from '../../models/document';
// import { ProfilePictureOptions } from '../../models/profile-picture-options';
// import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-profile-picture-upload',
  templateUrl: './profile-picture-upload.html'
})
// https://github.com/Mawi137/ngx-image-cropper/issues/100
export class ProfilePictureUploadComponent implements OnInit {

  @Input() fileProvider: FileService;
  @ViewChild('cropper', undefined) cropper: ImageCropperComponent;

  profilePictureOptions = {
    image: '',
    filename: ''
  };

  hasChanged = false;
  imageChangedEvent: any = '';
  profilePictureUrl = '';

  constructor(protected modalController: ModalController) {
  }

  ngOnInit() {
    if (this.profilePictureUrl) {
      this.setCropperImageFromUri(this.profilePictureUrl);
    }
  }

  close(profilePictureDocument?: AMGDocument)  {
    this.modalController.dismiss(profilePictureDocument);
  }

  saveAndClose() {
    if (!this.hasChanged) {
       return;
    }
    const fileBlob = this.dataURItoBlob(this.profilePictureOptions.image);
    const formData: FormData = new FormData();
    formData.append('files', fileBlob, this.profilePictureOptions.filename);
    const headers = new HttpHeaders();
    /** In Angular 5, including the header ContentType can invalidate your request */
    headers.append('Accept', 'application/json');
    this.fileProvider.uploadProfilePicture(formData, headers)
      .pipe(catchError(error => Observable.throw(error)))
      .subscribe(
          data => {
            const profilePictureDocument = data[0];
            this.hasChanged = false;
            this.close(profilePictureDocument);
          },
          error => console.log(error)
      );
  }

  fileChangeEvent($event) {
    const file: File = $event.target.files[0];
    this.profilePictureOptions.filename = file.name;
    this.imageChangedEvent = event;

    // const scope = this;

    // https://github.com/Mawi137/ngx-image-cropper/issues/100
    // const profilePictureReader: FileReader = new FileReader();
    // profilePictureReader.onloadend = (loadEvent: any) => {
    //     // image.src = loadEvent.target.result;
    //     // scope.cropper.setImage(image);
    //     scope.profilePictureOptions.image = loadEvent.target.result;
    //     scope.cropper.imageBase64 = loadEvent.target.result;
    //     scope.hasChanged = true;
    // };

    // profilePictureReader.readAsDataURL(file);
  }

  imageCropped(event: ImageCroppedEvent) {
      this.profilePictureOptions.image = event.base64;
      this.hasChanged = true;
  }

  imageLoaded() {
      // show cropper
  }
  cropperReady() {
      // cropper ready
  }
  loadImageFailed() {
      // show message
  }

  setCropperImageFromUri(url: string) {
    this.toDataUrl(url, (result) => {
      this.cropper.imageBase64 = result;
    });
  }

  toDataUrl(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
        const reader = new FileReader();
        reader.onloadend = () => {
            callback(reader.result);
        };
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }

  dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.split(',')[1]);
    } else {
      byteString = decodeURI(dataURI.split(',')[1]);
    }

    // separate out the mime component
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type: mimeString});
  }
}

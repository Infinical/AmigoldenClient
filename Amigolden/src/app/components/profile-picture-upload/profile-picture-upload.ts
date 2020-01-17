import { Component, Input, ViewChild } from '@angular/core';
import { FileService } from 'src/app/services/documents/file.service';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { ModalController } from '@ionic/angular';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
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
export class ProfilePictureUploadComponent {

  @Input() fileProvider: FileService;
  @ViewChild('cropper', undefined) cropper: ImageCropperComponent;


  profilePictureOptions = {
    image: '',
    filename: ''
  };

  hasChanged = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';

  constructor(protected modalController: ModalController) {
    if (this.profilePictureOptions.image) {
      this.setCropperImageFromUri(this.profilePictureOptions.image);
    }
  }

  close(profilePictureDocument?: Document)  {
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

    // const options = new RequestOptions({ headers: headers });
    // this.fileProvider.uploadProfilePicture(formData, options)
    //     .catch(error => Observable.throw(error))
    //     .subscribe(
    //         data => {
    //           const profilePictureDocument = data[0];
    //           this.hasChanged = false;
    //           this.close(profilePictureDocument);
    //         },
    //         error => console.log(error)
    //     );
  }

  fileChangeEvent($event) {
    const image: any = new Image();

    const file: File = $event.target.files[0];
    this.profilePictureOptions.filename = file.name;

    const scope = this;

    // https://github.com/Mawi137/ngx-image-cropper/issues/100
    const profilePictureReader: FileReader = new FileReader();
    profilePictureReader.onloadend = (loadEvent: any) => {
        // image.src = loadEvent.target.result;
        // scope.cropper.setImage(image);
        scope.cropper.imageBase64 = loadEvent.target.result;
        scope.hasChanged = true;
    };

    profilePictureReader.readAsDataURL(file);
  }

  fileChangeEvent1(event: any): void {
    this.imageChangedEvent = event;
    this.hasChanged = true;
  }

  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
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

  setCropperImageFromUri(uri: string) {
    const scope = this;
    const image: any = new Image();

    image.src = uri;
    // image.onload = (event) => scope.cropper.setImage(image);
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

  // constructor(params: NavParams, public viewCtrl: ViewController) {
  //   // TODO: Move parameter names to a const file
  //   this.fileProvider = this.fileProvider || params.get('fileProvider');
  //   this.profilePictureOptions.image = params.get('profilePictureUrl');

  //   this.initializeCropperSettings();

  //   if (this.profilePictureOptions.image) {
  //      this.setCropperImageFromUri(this.profilePictureOptions.image);
  //   }
  // }
}

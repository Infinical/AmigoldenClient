import { Component, Input, ViewChild } from '@angular/core';
import { FileService } from 'src/app/services/documents/file.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ModalController } from '@ionic/angular';
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
export class ProfilePictureUploadComponent {

  @Input() fileProvider: FileService;

  imageChangedEvent: any = '';
  croppedImage: any = '';

  constructor(protected modalController: ModalController) {
  }

  closeModal() {
    this.modalController.dismiss();
  }

  fileChangeEvent(event: any): void {
      this.imageChangedEvent = event;
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

  // hasChanged = false;

  // profilePictureOptions: ProfilePictureOptions = {
  //   image: '',
  //   filename: ''
  // };

  // cropperSettings2: CropperSettings;
  // @ViewChild('cropper', undefined) cropper: ImageCropperComponent;

  // constructor(params: NavParams, public viewCtrl: ViewController) {
  //   // TODO: Move parameter names to a const file
  //   this.fileProvider = this.fileProvider || params.get('fileProvider');
  //   this.profilePictureOptions.image = params.get('profilePictureUrl');

  //   this.initializeCropperSettings();

  //   if (this.profilePictureOptions.image) {
  //      this.setCropperImageFromUri(this.profilePictureOptions.image);
  //   }
  // }

  // initializeCropperSettings()  {
  //   // Cropper settings 2
  //   this.cropperSettings2 = new CropperSettings();
  //   this.cropperSettings2.width = 200;
  //   this.cropperSettings2.height = 200;
  //   this.cropperSettings2.keepAspect = false;

  //   this.cropperSettings2.croppedWidth = 200;
  //   this.cropperSettings2.croppedHeight = 200;

  //   this.cropperSettings2.canvasWidth = 300;
  //   this.cropperSettings2.canvasHeight = 300;

  //   this.cropperSettings2.minWidth = 100;
  //   this.cropperSettings2.minHeight = 100;

  //   this.cropperSettings2.rounded = true;
  //   this.cropperSettings2.minWithRelativeToResolution = false;

  //   this.cropperSettings2.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
  //   this.cropperSettings2.cropperDrawSettings.strokeWidth = 2;
  //   this.cropperSettings2.noFileInput = true;
  // }

  // cropped(bounds: Bounds) {
  //   // console.log(bounds);
  // }

  // setCropperImageFromUri(uri: string) {
  //   const scope = this;
  //   const image: any = new Image();

  //   image.src = uri;
  //   image.onload = (event) => scope.cropper.setImage(image);
  // }

  // fileChangeListener($event) {
  //     const image: any = new Image();

  //     const file: File = $event.target.files[0];
  //     this.profilePictureOptions.filename = file.name;

  //     const scope = this;

  //     const profilePictureReader: FileReader = new FileReader();
  //     profilePictureReader.onloadend = function (loadEvent: any) {
  //         image.src = loadEvent.target.result;
  //         scope.cropper.setImage(image);
  //         scope.hasChanged = true;
  //     };

  //     profilePictureReader.readAsDataURL(file);
  // }

  // close(profilePictureDocument?: Document) {
  //   this.viewCtrl.dismiss(profilePictureDocument);
  // }

  // saveAndClose() {
  //   if (!this.hasChanged) {
  //      return;
  //   }
  //   const fileBlob = this.dataURItoBlob(this.profilePictureOptions.image);
  //   const formData: FormData = new FormData();
  //   formData.append('files', fileBlob, this.profilePictureOptions.filename);
  //   const headers = new Headers();
  //   /** In Angular 5, including the header ContentType can invalidate your request */
  //   headers.append('Accept', 'application/json');
  //   const options = new RequestOptions({ headers: headers });
  //   this.fileProvider.uploadProfilePicture(formData, options)
  //       .catch(error => Observable.throw(error))
  //       .subscribe(
  //           data => {
  //             const profilePictureDocument = data[0];
  //             this.hasChanged = false;
  //             this.close(profilePictureDocument);
  //           },
  //           error => console.log(error)
  //       );
  // }

  // dataURItoBlob(dataURI) {
  //   // convert base64/URLEncoded data component to raw binary data held in a string
  //   let byteString;
  //   if (dataURI.split(',')[0].indexOf('base64') >= 0) {
  //     byteString = atob(dataURI.split(',')[1]);
  //   } else {
  //     byteString = decodeURI(dataURI.split(',')[1]);
  //   }

  //   // separate out the mime component
  //   const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  //   // write the bytes of the string to a typed array
  //   const ia = new Uint8Array(byteString.length);
  //   for (let i = 0; i < byteString.length; i++) {
  //       ia[i] = byteString.charCodeAt(i);
  //   }

  //   return new Blob([ia], {type: mimeString});
  // }
}

import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { Camera, CameraOptions } from '@ionic-native/camera';
import * as ExifReader from 'exifreader/src/exif-reader';
import { ActionSheetController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { dataURLtoBlob } from '../../app/app.common';
import { PictureModel } from '../models/picture.model';
import { ImageResizeService } from './image-resize.service';

declare var window: any;

@Injectable()
export class CameraService {

  private latest: PictureModel;
  private imageMaxSize: number = 3000;
  private imageQuality: number = 60;
  private location;

  constructor(private actionSheetCtrl: ActionSheetController,
              private imageResizeService: ImageResizeService,
              private camera: Camera) {
  }

  private _cameraPicture(sourceType) {
    return new Observable((o: Observer<any>) => {
      const options: CameraOptions = {
        destinationType: this.camera.DestinationType.DATA_URL,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true,
        sourceType: sourceType,
        targetWidth: this.imageMaxSize,
        targetHeight: this.imageMaxSize,
        quality: this.imageQuality,
      };

      this.camera.getPicture(options).then((imageData) => {
        let dataUrl = 'data:image/jpeg;base64,' + imageData;
        this._readLocationFromImage(dataURLtoBlob(dataUrl))
          .subscribe(
            res => {
              this.location = res;
            },
            err => {
              // do nothing
            }
          );

        this._createModel(o, dataUrl, dataURLtoBlob(dataUrl));
      }, (err) => {
        return o.error(err);
      });
    });
  }

  private _uploadPicture() {
    return new Observable((o: Observer<PictureModel>) => {
      var captureEl: any = document.getElementById('capture');

      captureEl.click();

      //workaround for Edge since it doesn't fire captureEl.onchange after captureEl.click()
      if (navigator.userAgent.indexOf('Edge') >= 0) {
        let inputChange = () => {
          if (captureEl.value) {
            clearInterval(interval);
            let event = document.createEvent('Event');

            event.initEvent('edgeEvent', true, false);
            captureEl.addEventListener('edgeEvent', (evt) => {
              let onChangeEdge = (evt) => {

                if (!evt.target['files'].length) {
                  return;
                }

                let file = evt.target['files'][0];

                this._readLocationFromImage(file)
                  .subscribe(
                    data => {
                      this.location = data;
                    },
                    err => {
                      // do nothing
                    }
                  );

                let reader = new FileReader();

                this.imageResizeService.resizeImage(file, this.imageMaxSize, this.imageQuality)
                  .then((resizedImage: Blob) => {
                    // Closure to capture the file information.
                    reader.onload = ((theFile) => {
                      return (e) => {
                        this._createModel(o, e.target.result, theFile);
                        captureEl['value'] = '';
                      };
                    })(resizedImage);

                    // Read in the image file as a data URL.
                    reader.readAsDataURL(resizedImage);
                  }).catch((err) => {
                  o.error(err);
                });
              };
              onChangeEdge(evt);
            }, false);

            captureEl.dispatchEvent(event);
          }
        }
        let interval = setInterval(inputChange, 300);
      } else {
        captureEl.onchange = (evt) => {

          if (!evt.target['files'].length) {
            return;
          }

          let file = evt.target['files'][0];

          this._readLocationFromImage(file)
            .subscribe(
              data => {
                this.location = data;
              },
              err => {
                // do nothing
              }
            );

          let reader = new FileReader();

          this.imageResizeService.resizeImage(file, this.imageMaxSize, this.imageQuality)
            .then((resizedImage: Blob) => {
              // Closure to capture the file information.
              reader.onload = ((theFile) => {
                return (e) => {
                  this._createModel(o, e.target.result, theFile);
                  captureEl['value'] = '';
                };
              })(resizedImage);

              // Read in the image file as a data URL.
              reader.readAsDataURL(resizedImage);
            }).catch((err) => {
            o.error(err);
          });
        };
      }
    });
  }

  private _readLocationFromImage(file) {
    return new Observable((o: Observer<any>) => {
      let reader = new FileReader();
      reader.onload = (event) => {
        try {
          let tags = ExifReader.load(event.target['result']);

          if (tags.hasOwnProperty('GPSLatitude') && tags.hasOwnProperty('GPSLongitude')) {
            let latSign = tags.GPSLatitudeRef.value[0] === 'N' ? 1 : -1;
            let lngSign = tags.GPSLongitudeRef.value[0] === 'E' ? 1 : -1;

            o.next({
              latitude: tags.GPSLatitude.description * latSign,
              longitude: tags.GPSLongitude.description * lngSign
            });
            o.complete();
          }
        } catch (error) {
          o.error(error);
        }
      };

      // We only need the start of the file for the Exif info.
      reader.readAsArrayBuffer(file.slice(0, 128 * 1024));
    });
  }

  private _createModel(o: Observer<PictureModel>, data: string, theFile?) {
    var image = new Image();
    image.src = data;

    image.onload = () => {
      let file = new PictureModel({
        file: theFile,
        data: data,
        width: image.width,
        height: image.height,
        location: this.location
      });

      this._saveToLatest(file);
      o.next(file);
      o.complete();
    };
  }

  private _saveToLatest(picture: PictureModel) {
    this.latest = picture;
  }

  public getLatest() {
    return this.latest;
  }

  public takePicture() {
    return new Observable((o: Observer<PictureModel>) => {
      if (window.cordova) {
        let actionSheet = this.actionSheetCtrl.create({
          cssClass: 'action-sheet-ios',
          buttons: [
            {
              text: 'Take Picture',
              handler: () => {
                this._cameraPicture(this.camera.PictureSourceType.CAMERA)
                  .subscribe(
                    (image: PictureModel) => {
                      o.next(image);
                      o.complete();
                    },
                    (error) => {
                      if (error === "has no access to assets" || error === "no image selected" || error === "Camera cancelled." || error === "Selection cancelled.") {
                        return o.error(false);
                      }

                      return o.error(error);
                    }
                  );
              }
            },
            {
              text: 'Upload Picture',
              handler: () => {
                this._cameraPicture(this.camera.PictureSourceType.PHOTOLIBRARY)
                  .subscribe(
                    (image: PictureModel) => {
                      o.next(image);
                      o.complete();
                    },
                    (error) => {
                      if (error === "has no access to assets" || error === "no image selected" || error === "Camera cancelled." || error === "Selection cancelled.") {
                        return o.error(false);
                      }

                      return o.error(error);
                    }
                  );
              }
            },
            {
              text: 'Cancel',
              role: 'cancel'
            }
          ]
        });
        actionSheet.present();
      } else {
        this._uploadPicture()
          .subscribe(
            (image: PictureModel) => {
              o.next(image);
              o.complete();
            },
            (error) => {
              return o.error(error);
            }
          );
      }
    });

  }

  public imageToFormData(image) {
    let mimeType = image.substring(image.indexOf(':') + 1, image.indexOf(';'));
    let blob = this.b64toBlob(image.split(',')[1], mimeType);

    let formData = new FormData();
    formData.append('file', blob);

    let options = new RequestOptions();

    options.headers = new Headers();
    // by setting content type to undefined we are letting browser to set correct content type
    options.headers.append('Content-Type', undefined);
    return {
      options: options,
      formData: formData
    }
  }

  b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    let sliceSize = 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

}

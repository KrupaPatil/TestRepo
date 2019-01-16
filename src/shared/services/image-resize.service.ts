import { Injectable } from '@angular/core';
import { dataURLtoBlob } from '../../app/app.common';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import * as ExifReader from 'exifreader/src/exif-reader';

@Injectable()
export class ImageResizeService {

  resizeImage(file, maxSize, quality) {
    const reader = new FileReader();
    const image = new Image();

    return new Promise((resolve, reject) => {
      if (!file.type.match(/image.*/)) {
        reject(new Error('Not an image'));
        return;
      }

      reader.onload = (readerEvent: any) => {
        image.onload = () => {
          this._readOrientationFromImage(file)
            .subscribe(
              orientation => {
                resolve(this._resize(image, maxSize, quality, orientation));
              },
              err => {
                // do nothing
              }
            )
        };
        image.src = readerEvent.target.result;
      };

      reader.readAsDataURL(file);
    });
  }

  private _resize(image, maxSize, quality, orientation) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let width = image.width;
    let height = image.height;
  
    if (width > height) {
      if (width > maxSize) {
        height *= maxSize / width;
        width = maxSize;
      }
    } else {
      if (height > maxSize) {
        width *= maxSize / height;
        height = maxSize;
      }
    }
  
    canvas.width = width;
    canvas.height = height;

    this._fixOrientation(orientation, canvas, width, height, ctx);

    ctx.drawImage(image, 0, 0, width, height);

    let dataUrl = canvas.toDataURL('image/jpeg', quality / 100);

    return dataURLtoBlob(dataUrl);
  }

  private _readOrientationFromImage(image) {
    return new Observable((o: Observer<any>) => {
      let reader = new FileReader();
      reader.onload = (event) => {
        try {
          let tags = ExifReader.load(event.target['result']);
          o.next(tags.Orientation.value);
          o.complete();
        } catch (error) {
          o.next(null);
          o.complete();
        }
      };

      // We only need the start of the file for the Exif info.
      reader.readAsArrayBuffer(image.slice(0, 128 * 1024));
    });
  }

  private _fixOrientation(orientation, canvas, width, height, ctx) {
    if (orientation < 2 || orientation > 8) {
      return;
    }

    if (orientation > 4) {
      canvas.width = height;
      canvas.height = width;
    }

    switch (orientation) {
      case 2:
        // horizontal flip
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
        break;
      case 3:
        // 180° rotate left
        ctx.translate(width, height);
        ctx.rotate(Math.PI);
        break;
      case 4:
        // vertical flip
        ctx.translate(0, height);
        ctx.scale(1, -1);
        break;
      case 5:
        // vertical flip + 90 rotate right
        ctx.rotate(0.5 * Math.PI);
        ctx.scale(1, -1);
        break;
      case 6:
        // 90° rotate right
        ctx.rotate(0.5 * Math.PI);
        ctx.translate(0, -height);
        break;
      case 7:
        // horizontal flip + 90 rotate right
        ctx.rotate(0.5 * Math.PI);
        ctx.translate(width, -height);
        ctx.scale(-1, 1);
        break;
      case 8:
        // 90° rotate left
        ctx.rotate(-0.5 * Math.PI);
        ctx.translate(-width, 0);
        break;
    }
  }

}

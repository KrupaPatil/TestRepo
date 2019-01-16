import { Injectable } from '@angular/core';
import { CONFIG_API_DOMAIN } from '@app/env';
import { Device } from '@ionic-native/device';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import { Platform } from 'ionic-angular';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { ScanLogModel } from '../models/scan-log.model';
import { DeviceService } from './device.service';

declare var MarvinImage: any;
declare var Segmenter: any;

@Injectable()
export class ScanCigarService {

  constructor(private platform: Platform,
              private device: Device,
              private deviceService: DeviceService,
              private transfer: FileTransfer) {
  }

  scanPicture(image) {
    return new Observable((o: Observer<any>) => {
      let mImage = new MarvinImage();
      mImage.load(image, () => {
        let rect = Segmenter.processCigar(mImage);
        o.next({
          left: rect[0],
          top: rect[1],
          right: rect[2],
          bottom: rect[3],
          width: rect[2] - rect[0],
          height: rect[3] - rect[1],
          angle: 0
        });
        return o.complete();
      });
    });
  }

  submitPicture(image, angle, x, y, width, height) {
    return new Observable((o: Observer<any>) => {
      let query = 'Angle=-' + angle;
      query += '&X=' + x;
      query += '&Y=' + y;
      query += '&Width=' + width;
      query += '&Height=' + height;

      if (this.platform.is('cordova')) {
        const fileTransfer: FileTransferObject = this.transfer.create();

        query += '&Platform=' + this.device.platform;
        query += '&Version=3.0';
        query += '&DeviceManufacturer=' + this.device.manufacturer;
        query += '&DeviceModel=' + this.device.model.replace(/\s/g, '');

        let options: FileUploadOptions = {
          fileKey: 'image',
          fileName: 'image-' + _.random(1000) + '.jpeg',
          headers : {'X-Device-UUID': this.deviceService.getDeviceID()}
        };

        fileTransfer.upload(image.data, CONFIG_API_DOMAIN + '/recognition/recognize?' + query, options)
          .then((data) => {
            o.next(new ScanLogModel(JSON.parse(data.response)));
            o.complete();
          }, (err) => {
            o.error({
              Status: err.http_status,
              Message: JSON.parse(err.body)
            });
          })
      } else {
        let formData: FormData = new FormData();
        let xhr: XMLHttpRequest = new XMLHttpRequest();

        query += '&Platform=Browser';
        query += '&Version=3.0';

        fetch(image.data)
          .then(res => res.blob())
          .then(blob => {
            formData.append('file', blob, image.file.name);

            xhr.onreadystatechange = () => {
              if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                  o.next(new ScanLogModel(JSON.parse(xhr.response)));
                  o.complete();
                } else {
                  o.error({
                    Status: xhr.status,
                    Message: xhr.responseText
                  });
                }
              }
            };

            xhr.open('POST', CONFIG_API_DOMAIN + '/recognition/recognize?' + query, true);
            xhr.withCredentials = true;
            xhr.setRequestHeader('X-Device-UUID', this.deviceService.getDeviceID());
            xhr.send(formData);
          });
      }
    });
  }



}

import { Injectable, Injector } from '@angular/core';
import { BaseResource } from './base.resource';
import { ManualRecognitionModel } from '../models/manual-recognition.model';
import { ManualRecognitionApiResource } from './api/manual-recognition-api.resource';

@Injectable()
export class ManualRecognitionResource extends BaseResource {

  constructor(api: ManualRecognitionApiResource,
              injector: Injector) {
    super(null, api, injector);
  }

  public requestManualRecognition(settings: ManualRecognitionModel) {
    return this.api.requestManualRecognition(settings);
  }

}

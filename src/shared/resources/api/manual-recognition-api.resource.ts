import {Injectable} from '@angular/core';
import {BaseApiResource} from './base-api.resource';
import {ApiResourceInterface} from './api-resource.interface';
import { ApiService } from '../../services/api.service';
import { ManualRecognitionModel } from '../../models/manual-recognition.model';

@Injectable()
export class ManualRecognitionApiResource extends BaseApiResource implements ApiResourceInterface {
  constructor(private apiService: ApiService) {
    super();
  }

  public requestManualRecognition(data: ManualRecognitionModel) {
    return this.apiService.post('recognition/manual', data);
  }
}

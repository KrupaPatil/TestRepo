import { Injectable } from '@angular/core';
import { BaseApiResource } from './base-api.resource';
import { ApiResourceInterface } from './api-resource.interface';
import { ApiService } from '../../services/api.service';
import { FeedbackModel } from "../../models/feedback.model";

@Injectable()
export class FeedbackApiResource extends BaseApiResource implements ApiResourceInterface {

  constructor(private apiService: ApiService) {
    super();
  }

  public sendFeedback(data: FeedbackModel) {
    return this.apiService.post('feedback', data)
  }
}

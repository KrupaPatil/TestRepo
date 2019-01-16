import { Injectable, Injector } from '@angular/core';
import { BaseResource } from './base.resource';
import { FeedbackApiResource } from "./api/feedback-api.resource";
import { FeedbackModel } from "../models/feedback.model";

@Injectable()
export class FeedbackResource extends BaseResource {

  constructor(api: FeedbackApiResource,
              injector: Injector) {
    super(null, api, injector);
  }

  public sendFeedback(data: FeedbackModel) {
    return this.api.sendFeedback(data);
  }

}

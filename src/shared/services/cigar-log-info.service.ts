import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Response } from '@angular/http';
import { CONFIG_API_DOMAIN } from '@app/env';

@Injectable()
export class CigarLogInfoService {


  constructor(private apiService: ApiService) {
  }

  getImageUrl(data) {
    return this.apiService
      .post(CONFIG_API_DOMAIN + '/images/usercigarimage', data.formData, data.options)
      .map((response: Response) => response.json() as string)
  }
}

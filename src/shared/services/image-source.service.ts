import { Injectable } from '@angular/core';

@Injectable()
export class ImageSourceService {

  createSrc(link) {
    if (link && !link.startsWith('https:')) {
      link = 'https:' + link;
    }
    return link;
  }

}

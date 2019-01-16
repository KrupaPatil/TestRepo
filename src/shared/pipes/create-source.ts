import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'createSource'})
export class CreateSourcePipe implements PipeTransform {

  transform(link: string): string {
    if (link && !link.startsWith('https:')) {
      link = 'https:' + link;
    }
    return link;
  }
}

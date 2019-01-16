import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'nl2br'})
export class NlToBrPipe implements PipeTransform {

  transform(value: string): string {
    if (value) {
      return value.replace(/\n/g, '<br>');
    }
  }

}

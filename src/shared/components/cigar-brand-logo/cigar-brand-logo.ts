import { Component, Input} from '@angular/core';

@Component({
  selector: 'cigar-brand-logo',
  templateUrl: 'cigar-brand-logo.html'
})
export class CigarBrandLogo {
  @Input() cigar;
  @Input() detailsStyle: false;


  constructor() {}

}

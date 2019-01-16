import { Directive, HostListener } from '@angular/core';
import { RoutesStackService } from "../services/routes-stack.service";
import { RouterService } from "../services/router.service";

@Directive({
  selector: '[backLink]'
})
export class BackLinkDirective {

  constructor(private routesStackService: RoutesStackService,
              private router: RouterService) {
  }

  @HostListener('click')
  back() {
    let currentUrlStack = this.routesStackService.getUrlStack();
    if (currentUrlStack[currentUrlStack.length -1] == '/scan-cigar/no-results') {
      this.router.navigateToRoot();
      return;
    }
    let backUrl = this.routesStackService.getBackUrl();

    if (backUrl) {
      this.router.navigateByUrl(backUrl);
    } else {
      this.router.navigateToRoot();
    }
  }

}

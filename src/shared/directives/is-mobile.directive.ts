import { Directive, ViewContainerRef, TemplateRef } from '@angular/core';
import { CONFIG_IS_MOBILE } from '@app/env';

@Directive({selector: '[isMobile]'})
export class IsMobileDirective {

  private context: IsMobileContext = new IsMobileContext();

  constructor(private viewContainer: ViewContainerRef,
              private templateRef: TemplateRef<IsMobileContext>) {
    this.viewContainer.clear();
    if (CONFIG_IS_MOBILE) {
      this.viewContainer.createEmbeddedView(this.templateRef, this.context);
    }
  }

}

export class IsMobileContext {
  public $implicit: any = null;
  public isMobile: any = null;
}


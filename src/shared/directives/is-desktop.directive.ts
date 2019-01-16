import { Directive, ViewContainerRef, TemplateRef } from '@angular/core';
import { CONFIG_IS_MOBILE } from '@app/env';

@Directive({selector: '[isDesktop]'})
export class IsDesktopDirective {

  private context: IsDesktopContext = new IsDesktopContext();

  constructor(private viewContainer: ViewContainerRef,
              private templateRef: TemplateRef<IsDesktopContext>) {
    this.viewContainer.clear();
    if (!CONFIG_IS_MOBILE) {
      this.viewContainer.createEmbeddedView(this.templateRef, this.context);
    }
  }

}

export class IsDesktopContext {
  public $implicit: any = null;
  public isDesktop: any = null;
}

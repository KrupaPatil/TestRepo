import { Directive, ElementRef, HostListener } from '@angular/core';
import { Platform } from "ionic-angular";

@Directive({ selector: '[parallaxFx]' })
export class ParallaxFxDirective {
  @HostListener('window:scroll', ['$event'])
  private container;
  private sizeFactorInit;
  private heightInit;
  private backgroundElement;

  constructor(el: ElementRef, private platform: Platform) {
    this.container = el;
    this.sizeFactorInit = 150;
    this.heightInit = 100;
  }

  @HostListener('scroll', ['$event'])
  onElementScroll() {
    if (this.platform.is('ios') && this.backgroundElement) {

      let scrollTop = this.container.nativeElement.scrollTop;

      if (scrollTop >= 0) {
        // let scrollFactor = scrollTop;
        this.backgroundElement.style.transform = null;
      }
      else if (scrollTop >= -100) {
        let sizeFactor = this.sizeFactorInit + 0.5 * scrollTop;
        this.backgroundElement.style.backgroundSize = sizeFactor + '%';
        this.backgroundElement.style.height = this.heightInit - scrollTop + 'px';
        this.backgroundElement.style.marginBottom = scrollTop + 'px';
        this.backgroundElement.style.transform = 'translate3d(0, -' + -scrollTop + 'px, 0)';
      }
    }
  }

  ngAfterViewInit() {
    this.backgroundElement = this.container.nativeElement.querySelector('.cigar-preview-wrapper');
  }
}

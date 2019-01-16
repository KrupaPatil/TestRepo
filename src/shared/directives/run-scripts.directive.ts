import { Directive, ElementRef, OnInit, AfterViewInit } from '@angular/core';

@Directive({ selector: '[runScripts]' })
export class RunScriptsDirective implements AfterViewInit {
  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(): void {
    this.reinsertScripts();
  }

  reinsertScripts(): void {
    const scripts = <HTMLScriptElement[]>this.elementRef.nativeElement.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
      const script = scripts[i];
      const scriptCopy = <HTMLScriptElement>document.createElement('script');
      scriptCopy.type = script.type ? script.type : 'text/javascript';
      if (script.innerHTML) {
        let code = script.innerHTML;
        if (code.indexOf('.panzoom()') > -1) {
          code = code.replace('.panzoom()', '.panzoom({ panOnlyWhenZoomed: true, minScale: 1 })');
          code = `setTimeout(function() {\n${code}\n}, 1000);`;
        }
        scriptCopy.innerHTML = code;
      } else if (script.src) {
        scriptCopy.src = script.src.indexOf('panzoom') > -1 ? 'https://az571366.vo.msecnd.net/res/jquery322.panzoom.min.js' : script.src;
      }
      scriptCopy.async = false;
      script.parentNode.replaceChild(scriptCopy, script);
    }
  }
}

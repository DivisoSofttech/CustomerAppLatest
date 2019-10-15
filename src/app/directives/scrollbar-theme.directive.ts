import { NgModule, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appScrollbarTheme]'
})
export class ScrollbarThemeDirective {

  constructor(el: ElementRef) {
    if (window.screen.availWidth > 991) {
      this.setScrollBarStyle(el);
    }
  }

  setScrollBarStyle(el: ElementRef) {
    const stylesheet = `
    ::-webkit-scrollbar {
    width: 5px;
    }
    ::-webkit-scrollbar-track {
    background: rgba(0,0,0,0.4);
    }
    ::-webkit-scrollbar-thumb {
    border-radius: 1px;
    border: 4px solid #D51E1E;
    }
    ::-webkit-scrollbar-thumb:hover {
    }
  `;

    const styleElmt = el.nativeElement.shadowRoot.querySelector('style');

    if (styleElmt) {
      styleElmt.append(stylesheet);
    } else {
      const barStyle = document.createElement('style');
      barStyle.append(stylesheet);
      el.nativeElement.shadowRoot.appendChild(barStyle);
    }
  }
}

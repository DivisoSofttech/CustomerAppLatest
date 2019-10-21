import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollbarThemeDirective } from './scrollbar-theme.directive';

@NgModule({
  declarations: [ScrollbarThemeDirective],
  imports: [
    CommonModule
  ],
  exports: [ScrollbarThemeDirective]
})
export class DirectiveModule { }

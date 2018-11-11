import {
  Directive,
  HostListener,
  HostBinding,
  ElementRef,
  Renderer2
} from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  @HostBinding('class.show')
  isOpen = false;

  @HostListener('click', ['$event.target'])
  toggle(target) {
    const dropdown = this.elementRef.nativeElement;
    const dropdownMenu = dropdown.children[1];
    if (dropdownMenu.contains(target) && dropdownMenu !== target) {
      this.isOpen = false;
    } else if (dropdown.children[0] === target) {
      this.isOpen = !this.isOpen;
    }

    // if (!this.isOpen) {
    //   this.renderer.addClass(dropdown, 'show');
    // } else {
    //   this.renderer.removeClass(dropdown, 'show');
    // }
    // this.isOpen = !this.isOpen;
  }

  @HostListener('document:click', ['$event.target'])
  clickedOutSide(target) {
    const dropdown = this.elementRef.nativeElement;
    if (!dropdown.contains(target)) {
      this.isOpen = false;
    }

    // if (this.isOpen) {
    //   this.isOpen = false;
    // }
  }

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}
}

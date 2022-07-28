import { Directive, Renderer2, OnInit, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appItemSelector]'
})
export class ItemSelectorDirective implements OnInit {

  @HostListener('click') mouseover(eventData: Event) {
    this.renderer.setStyle(this.elRef.nativeElement, 'background-color', 'blue');
    this.renderer.removeAttribute(this.elRef.nativeElement, 'input');
  
  }
  constructor(private elRef: ElementRef, private renderer: Renderer2) { }


  ngOnInit(): void {
   // this.renderer.setStyle(this.elRef.nativeElement, 'background-color', 'blue')
    
  
    
  }

}

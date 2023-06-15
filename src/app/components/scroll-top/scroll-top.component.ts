import { ViewportScroller } from '@angular/common';
import { Component, HostListener} from '@angular/core';

@Component({
  selector: 'app-scroll-top',
  templateUrl: './scroll-top.component.html',
  styleUrls: ['./scroll-top.component.css']
})
export class ScrollTopComponent {
  constructor(private viewportScroller: ViewportScroller) { }

  isScrolledDown = false;

  @HostListener('window:scroll')
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;
    const documentHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 0;

    this.isScrolledDown = scrollPosition + windowHeight >= documentHeight;
  }

  scrollToTop() {
    if (this.isScrolledDown) {
      this.viewportScroller.scrollToPosition([0, 0]);
    } else {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  }
}

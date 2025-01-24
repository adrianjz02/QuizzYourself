import {Component, ElementRef} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from './shared/header/header.component';
import {FooterComponent} from './shared/footer/footer.component';
import {NgStyle} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, NgStyle],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  //margin top pour ne pas superposer le header avec le contenu de la page
  headerHeight: number = 0;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    const header = this.elementRef.nativeElement.querySelector('.navbar');
    if (header) {
      this.headerHeight = header.offsetHeight;
    }
  }
}

import { AfterViewInit, Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import AOS from 'aos';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements AfterViewInit {
  protected readonly title = 'tml-logistica';

  ngAfterViewInit() {
    setTimeout(() => {
      AOS.init({
        duration: 800,
        once: true
      });
    }, 100);
  }

}

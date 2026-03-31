import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-inicio-header',
  imports: [],
  templateUrl: './inicio-header.html',
  styleUrl: './inicio-header.scss',
})
export class InicioHeader implements AfterViewInit {
  @ViewChild('heroVideo') private readonly heroVideo?: ElementRef<HTMLVideoElement>;

  private readonly platformId = inject(PLATFORM_ID);

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const video = this.heroVideo?.nativeElement;

    if (!video) {
      return;
    }

    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    void video.play().catch(() => {
      // Some browsers delay autoplay until enough data is buffered.
    });
  }
}

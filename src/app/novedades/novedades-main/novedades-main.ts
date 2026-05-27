import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { NoticiasService, Noticia, ShareLinks } from '../../services/noticias.service';

@Component({
  selector: 'app-novedades-main',
  imports: [RouterLinkActive, RouterLinkWithHref],
  templateUrl: './novedades-main.html',
  styleUrl: './novedades-main.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NovedadesMain {
  private readonly noticiasService = inject(NoticiasService);

  readonly noticias = signal<Noticia[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);

  constructor() {
    // Bloque anterior: la lista se leia desde /noticias.json o directo en el componente.
    // this.http.get<Noticia[]>('/server/blog-list.php').subscribe({
    //   next: (response) => {
    //     this.noticias = response;
    //     this.loading = false;
    //   },
    //   error: () => {
    //     this.error = true;
    //     this.loading = false;
    //   },
    // });

    this.noticiasService.getNoticias().subscribe({
      next: (response) => {
        this.noticias.set(response);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  getShareLinks(noticia: Noticia): ShareLinks {
    return this.noticiasService.getShareLinks(noticia);
  }
}

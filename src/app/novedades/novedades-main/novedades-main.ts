import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { NoticiasService, Noticia, ShareLinks } from '../../services/noticias.service';
import { QuillModule } from 'ngx-quill';


@Component({
  selector: 'app-novedades-main',
  imports: [RouterLinkActive, RouterLinkWithHref, QuillModule],
  templateUrl: './novedades-main.html',
  styleUrl: './novedades-main.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NovedadesMain {
  private readonly document = inject(DOCUMENT);
  private readonly noticiasService = inject(NoticiasService);

  readonly noticias = signal<Noticia[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);

  constructor() {
    

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

  renderDescripcion(descripcion: string | null | undefined): string {
    const content = descripcion ?? '';

    if (content.includes('&lt;') || content.includes('&gt;') || content.includes('&nbsp;') || content.includes('&amp;')) {
      const textarea = this.document.createElement('textarea');
      textarea.innerHTML = content;
      return textarea.value.replace(/\u00a0/g, ' ');
    }

    return content.replace(/\u00a0/g, ' ');
  }
}

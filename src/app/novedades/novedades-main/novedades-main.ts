import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLinkActive, RouterLinkWithHref } from "@angular/router";

@Component({
  selector: 'app-novedades-main',
  imports: [RouterLinkActive, RouterLinkWithHref],
  templateUrl: './novedades-main.html',
  styleUrl: './novedades-main.scss',
})
export class NovedadesMain {
  private readonly http = inject(HttpClient);
  private readonly document = inject(DOCUMENT);

  noticias: Noticia[] = [];
  loading = true;
  error = false;

  constructor() {
    this.http.get<Noticia[]>('/noticias.json').subscribe({
      next: (response) => {
        this.noticias = response;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }

  getShareLinks(noticia: Noticia): ShareLinks {
    const shareUrl = this.getAbsoluteUrl(noticia);
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(noticia.titulo);

    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      copy: shareUrl,
    };
  }

  private getAbsoluteUrl(noticia: Noticia): string {
    const origin = this.getSiteOrigin();
    return new URL(noticia.url ?? `/novedades/${noticia.id_novedad}`, origin).toString();
  }

  private getSiteOrigin(): string {
    const origin = this.document.location?.origin;
    const isLocalhost = origin ? /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) : false;

    return origin && !isLocalhost ? origin : 'https://a0090975.ferozo.com/';
  }
}

interface Noticia {
  id_novedad: string;
  titulo: string;
  fecha: string;
  actualizado: string;
  descripcion: string;
  imagen: string;
  link: string;
  url?: string;
}

interface ShareLinks {
  facebook: string;
  x: string;
  linkedin: string;
  copy: string;
}

import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface Noticia {
  id_novedad: string;
  titulo: string;
  fecha: string;
  actualizado: string;
  descripcion: string;
  imagen: string;
  imagenMini: string;
  link: string;
  url?: string;
}

export interface NoticiasDetalle {
  noticia: Noticia | null;
  otrasNoticias: Noticia[];
}

export interface ShareLinks {
  facebook: string;
  x: string;
  linkedin: string;
  copy: string;
}

@Injectable({
  providedIn: 'root',
})
export class NoticiasService {
  private readonly document = inject(DOCUMENT);
  private readonly http = inject(HttpClient);
  // Bloque anterior: origen fijo a produccion.
  // En localhost usamos el backend local para evitar el 401 del host remoto.
  private readonly apiOrigin = this.resolveApiOrigin();

  getNoticias(): Observable<Noticia[]> {
    return this.http.get<Noticia[]>(`${this.apiOrigin}/blog-list.php`);
  }

  getDetalle(idNovedad: string): Observable<NoticiasDetalle> {
    return this.getNoticias().pipe(
      map((noticias) => ({
        noticia: noticias.find((item) => item.id_novedad === idNovedad) ?? null,
        otrasNoticias: noticias.filter((item) => item.id_novedad !== idNovedad),
      })),
    );
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
    return 'https://tmlogistica.com.ar';
  }

  private resolveApiOrigin(): string {
    const origin = this.document?.location?.origin ?? '';
    const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

    if (isLocalhost) {
      return 'https://tmlogistica.com.ar/server';
    }

    return 'https://tmlogistica.com.ar/server';
  }
}

import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Footer } from '../../footer/footer';
import { Navbar } from '../../navbar/navbar';
import { NoticiasService, Noticia, ShareLinks } from '../../services/noticias.service';

@Component({
  selector: 'app-novedades-page',
  imports: [Navbar, Footer, RouterLink],
  templateUrl: './novedades-page.html',
  styleUrl: './novedades-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NovedadesPage {
  private readonly document = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly noticiasService = inject(NoticiasService);
  private readonly route = inject(ActivatedRoute);

  readonly noticia = signal<Noticia | null>(null);
  readonly otrasNoticias = signal<Noticia[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const idNovedad = params.get('id_novedad') ?? '';
      const slug = params.get('slug') ?? '';

      this.loading.set(true);
      this.error.set(false);
      this.noticia.set(null);
      this.otrasNoticias.set([]);

      

      this.noticiasService.getDetalle(idNovedad).subscribe({
        next: (response) => {
          this.noticia.set(response.noticia);
          this.otrasNoticias.set(response.otrasNoticias);
          this.error.set(!response.noticia);
          this.updateSeo(response.noticia, slug, idNovedad);
          this.updateCanonicalLink(response.noticia?.url ?? slug, idNovedad);
          this.loading.set(false);
        },
        error: () => {
          this.error.set(true);
          this.updateSeo(null, slug, idNovedad);
          this.updateCanonicalLink(slug, idNovedad);
          this.loading.set(false);
        },
      });
    });
  }

  getShareLinks(noticia: Noticia): ShareLinks {
    return this.noticiasService.getShareLinks(noticia);
  }

  private updateCanonicalLink(slug: string, idNovedad: string): void {
    const canonicalUrl = this.buildCanonicalUrl(idNovedad, slug);
    const head = this.document.head;
    let canonicalLink = head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!canonicalLink) {
      canonicalLink = this.document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      head.appendChild(canonicalLink);
    }

    canonicalLink.setAttribute('href', canonicalUrl);
  }

  private updateSeo(noticia: Noticia | null, slug: string, idNovedad: string): void {
    const canonicalUrl = this.buildCanonicalUrl(idNovedad, noticia?.url ?? slug);
    const title = noticia
      ? `${noticia.titulo} | TML Logística`
      : 'Novedades | TML Logística';
    const description = noticia
      ? this.buildDescription(noticia)
      : 'Noticias y novedades de TML Logística.';

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
  }

  private buildCanonicalUrl(idNovedad: string, slug: string): string {
    const siteOrigin = 'https://tmlogistica.com.ar';
    const path = slug ? `/novedades/${idNovedad}/${slug}` : `/novedades/${idNovedad}`;

    return new URL(path, siteOrigin).toString();
  }

  private buildDescription(noticia: Noticia): string {
    const plainText = noticia.descripcion.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

    return plainText.length > 155 ? `${plainText.slice(0, 152)}...` : plainText;
  }
}

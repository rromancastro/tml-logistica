import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';

export interface EditBlogPayload {
  tabla: string;
  datos: Record<string, unknown> | NoticiaEditData;
  id: string | number;
  where: string;
}

export interface NoticiaEditData {
  titulo?: string;
  fecha?: string;
  actualizado?: string;
  descripcion?: string;
  imagen?: string;
  imagenMini?: string;
  link?: string;
  url?: string;
}

@Injectable({
  providedIn: 'root',
})
export class NoticiasAdminService {
  private readonly apiOrigin = 'https://tmlogistica.com.ar/server';
  private readonly http = inject(HttpClient);

  private handleError(error: unknown) {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        console.error('An error occurred:', error.error);
      } else {
        console.error(`Backend returned code ${error.status}, body was: `, error.error);
      }
    } else {
      console.error('Noticias admin service error:', error);
    }

    return throwError(() => new Error('No se pudo procesar la solicitud.'));
  }

  // Bloque anterior: helper genérico expuesto al componente.
  // Ahora queda encapsulado por métodos explícitos de noticias.
  private editBlog(payload: EditBlogPayload) {
    const formData = new HttpParams()
      .set('tabla', payload.tabla)
      .set('datos', JSON.stringify(payload.datos))
      .set('id', String(payload.id))
      .set('where', payload.where);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    });

    return this.http.post(`${this.apiOrigin}/edit_blog.php`, formData, {
      headers,
      responseType: 'text',
    }).pipe(
      catchError((error) => this.handleError(error)),
    );
  }

  actualizarNoticia(idNovedad: string | number, noticia: NoticiaEditData) {
    return this.editBlog({
      tabla: 'noticias',
      datos: noticia,
      id: idNovedad,
      where: 'id_novedad',
    });
  }

  editarNoticia(idNovedad: string | number, noticia: NoticiaEditData) {
    return this.actualizarNoticia(idNovedad, noticia);
  }

  editarTituloNoticia(idNovedad: string | number, titulo: string) {
    return this.actualizarNoticia(idNovedad, { titulo });
  }

  editarFechasNoticia(idNovedad: string | number, fecha: string, actualizado?: string) {
    return this.actualizarNoticia(idNovedad, { fecha, actualizado });
  }

  editarDescripcionNoticia(idNovedad: string | number, descripcion: string) {
    return this.actualizarNoticia(idNovedad, { descripcion });
  }

  editarImagenesNoticia(idNovedad: string | number, imagen: string, imagenMini?: string) {
    return this.actualizarNoticia(idNovedad, { imagen, imagenMini });
  }

  editarEnlaceNoticia(idNovedad: string | number, link: string, url?: string) {
    return this.actualizarNoticia(idNovedad, { link, url });
  }
}

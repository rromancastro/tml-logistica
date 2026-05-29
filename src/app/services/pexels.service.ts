import { Injectable } from '@angular/core';
import { createClient, ErrorResponse, PhotosWithTotalResults } from 'pexels';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PexelsService {
  private client = createClient('nHip5ZJ1SMXl8JJShycGaM2gT9As7Vd2tar9j3UF7UPU4wr7uTqljj5t');

  constructor() {}

  searchPhotos(query: string, perPage: number = 10, page: number = 1): Observable<any> {
    return from(this.client.photos.search({ query, per_page: perPage, page: page, locale: 'es-ES' }));
  }

  searchVideos(query: string, perPage: number = 10, page: number = 1): Observable<any> {
    return from(this.client.videos.search({ query, per_page: perPage, page: page, locale: 'es-ES', orientation: 'landscape', size: 'small'}));
  }
}
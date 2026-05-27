import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, finalize, map, throwError } from 'rxjs';
import {Email} from './email';


@Injectable({
  providedIn: 'root'
})

export class EmailService {
  
  public servidor:string= ''; 
  public loading:boolean = false;
  // Bloque anterior: este acceso directo a window rompía SSR al construir el servicio.
  // public dominio = window.location.hostname;
  public dominio = '';
  public href: string = '';
  public protocol: string = '';
  

  private handleError(error: unknown) {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        console.error('An error occurred:', error.error);
      } else {
        console.error(`Backend returned code ${error.status}, body was: `, error.error);
      }
    } else {
      console.error('Email service error:', error);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  } 

  

  mandarEmail(email:Email){
    this.loading = true;
    const url = this.servidor+'send.php'; // URL to web api
    const options = new HttpParams()
      // Bloque anterior: el backend actual no recibia apellido ni seccion.
      // .set('nombre', email.nombre)
      // 
      // .set('celular', email.celular)
      // .set('email', email.email)
      // .set('mensaje', email.mensaje)
      .set('nombre', email.nombre)
      .set('apellido', email.apellido)
      .set('celular', email.celular)
      .set('email', email.email)
      .set('mensaje', email.mensaje)
      .set('seccion', email.seccion)
    ;
    return this.http.post(url, options, { responseType: 'text' })
      .pipe(
        map((response) => {
          if (response.trim() !== '1') {
            throw new Error('El servidor rechazo el envio del formulario.');
          }

          return response;
        }),
        catchError((error) => this.handleError(error)),
        finalize(() => {
          this.loading = false;
        })
      )
  }

  mandarEmailUsuario(nombre:string,email:string,id:string){
    const url = this.servidor+'enviar-pass.php'; // URL to web api
    const options = new HttpParams()
      .set('nombre', nombre)
      .set('email', email)
      .set('id', id)
      
    ;
    return this.http.post(url,options)
      .pipe(
        catchError((error) => this.handleError(error)),
        finalize(() => {
          this.loading = false;
        })
      )
  }

  

  constructor(
    private http: HttpClient,
  ) {
   

    if (typeof window !== 'undefined') {
      this.dominio = window.location.hostname;
      this.href = window.location.hostname;
      this.protocol = window.location.protocol;

      if (this.href === 'localhost') {
        this.servidor = this.protocol + '//' + this.href + '/laronda/server/contact/';
      } else {
        this.servidor = this.protocol + '//' + this.href + '/server/contact/';
      }
    }
    
  }
}

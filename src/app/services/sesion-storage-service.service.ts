import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SesionStorageServiceService {

  constructor() { }

  setItem(key: string, value: any): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  getItem(key: string): any {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  clear(): void {
    sessionStorage.clear();
  }

 /*
  public user:any = signal(sessionStorage.getItem('user'));
  public id_user:string = this.user().id;
  public mostrar_precio: boolean = (this.user().forma_de_cobro === 3);
  */
}

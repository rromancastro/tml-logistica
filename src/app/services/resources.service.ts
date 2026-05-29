import { inject, Injectable, signal } from '@angular/core';
import { AdminService } from './admin.service';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { SesionStorageServiceService } from './sesion-storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {
  
  public sesionStorageService = inject(SesionStorageServiceService);
  public user:any = signal(this.sesionStorageService.getItem('user'));

  public arrayParaUsar:{n:string,t:string,b:string,d:string}[] = [];
  public adminService = inject(AdminService);

  
  public today = new Date();
  public futureDate = new Date(this.today);

  public dia = this.today.getDate().toString();
  public mes = this.today.toLocaleString('es-ES', { month: 'long' }); // Nombre del mes en espaniol
  public anio = this.today.getFullYear().toString(); 
  public semana = Math.ceil((this.today.getDate() + this.today.getDay()) / 7).toString(); // Número de semana aproximado

  public fechaSubject = new BehaviorSubject<{ dia: string, mes: string, anio: string, semana: string }>({
    dia:this.dia,
    mes:this.mes,
    anio:this.anio,
    semana:this.semana
  });

  public fechaSubjectFuture = new BehaviorSubject<{ dia: string, mes: string, anio: string, semana: string }>({
    dia:this.dia,
    mes:this.mes,
    anio:this.anio,
    semana:this.semana
  });

  public fecha$: Observable<{ dia: string, mes: string, anio: string, semana:string }> = this.fechaSubject.asObservable();
  public fechaFuture$: Observable<{ dia: string, mes: string, anio: string, semana:string }> = this.fechaSubjectFuture.asObservable();

  public plato = new BehaviorSubject<boolean>(false);
  public plato$: Observable<boolean> = this.plato.asObservable();

  actualizarFecha(dia: string, mes: string, anio: string,semana:string): void {
    this.fechaSubject.next({ dia, mes, anio, semana });
  }

  actualizarFechaFuture(dia: string, mes: string, anio: string,semana:string): void {
    this.fechaSubjectFuture.next({ dia, mes, anio, semana });
  }
  
  obtenerFecha(): Observable<{ dia: string, mes: string, anio: string, semana:string }> {
    return this.fecha$;
  }

  obtenerFechaFuture(): Observable<{ dia: string, mes: string, anio: string, semana:string }> {
    return this.fechaFuture$;
  }

  obtenerPlato(): Observable<boolean> {
    return this.plato$;
  }



  pidioPlato(id_user:string){
    //console.log('pidioPlato()')
    const nombreTabla = 'pedidos';
    this.fecha$.subscribe(d=>{
      const dia = Number(d.dia);
      const mes = d.mes;
      const anio = d.anio;

      const datos = [{'dia': dia, 'mes':mes,'anio':anio,'id_usuario':id_user}];

      this.adminService.busquedaPorTabla(nombreTabla, datos).subscribe(d=>{
        if(d.length>0){
          //console.log(true);
          return true;
        }else{
          //console.log(false);
          return false;
        }
      })
    })
  }

  bucarTabla(tabla: string) {
    const tablaObjeto = this[tabla as keyof this];
    
    if (Array.isArray(tablaObjeto)) {
      //console.log(tablaObjeto);
      return tablaObjeto;
    }
  
    return null; // o lo que quieras devolver si no existe
  }

  buscarTablaEnBaseDeDatos(tabla: string): Observable<any[]> {
    const nombreTabla = 'configuracion_bases';
    const datos = [{'nombre': tabla}];
    console.log(nombreTabla, datos);

    return this.adminService.busquedaPorTabla(nombreTabla, datos).pipe(
      map(d => {
        // Procesa los datos eliminando las propiedades
        d.forEach((item: any) => {
          delete item.nombre;
          delete item.id;
        });
        console.log(d);
        return d;
      })
    );
}

  constructor() {
    if(!this.user()){
      return;
    }
    const datos = [{'id_empresa':this.user().empresa}];
    this.adminService.busquedaPorTabla('configuracion_dias_empresas',datos)
    .subscribe(datos=>{
      if(typeof datos[0]?.empezar !== 'undefined'){
        //console.log(datos[0]?.empezar);
        this.futureDate.setDate(this.futureDate.getDate() + Number(datos[0]?.empezar));
        //console.log(this.today);
        const diaF = this.futureDate.getDate().toString();
        const mesF = this.futureDate.toLocaleString('es-ES', { month: 'long' }); // Nombre del mes en espaniol
        const anioF = this.futureDate.getFullYear().toString(); 
        const semanaF = Math.ceil((this.futureDate.getDate() + this.futureDate.getDay()) / 7).toString(); // Número de semana aproximado
        this.actualizarFechaFuture(diaF, mesF ,anioF, semanaF);
      }
    })
   }
}

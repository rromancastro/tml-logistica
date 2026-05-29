import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { catchError,Observable,throwError} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, startWith, tap } from 'rxjs/operators';
import { ApiResponse, Carousel, Img } from './interface';
//import { EmailAsociado } from '../servicios/email';
import { Location } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class AdminAService {
 
  public href: string = '';
  public protocol: string = '';
  public servidor:string= '';  
  public loading:boolean = false;
  public loader:boolean = false;
  
  constructor(
    private http: HttpClient,
    private location: Location,
    
  ) { 
      this.href = window.location.hostname;
      this.protocol = window.location.protocol;
    
      if(this.href==='localhost'){
        this.servidor = 'https://tmlogistica.com.ar/server/';
        
        console.log('localhost: ',this.servidor);
      }else{
        this.servidor = this.protocol+"//"+this.href+'/server/';
        console.log('online: ',this.servidor);
      }
    
  }
  private handleError(error: HttpErrorResponse) {
    
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
      //this.loading = false;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
     // this.loading = false;
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
      }
    // Return an observable with a user-facing error message.
    //this.loading = false;
    return throwError(() => new Error('Something bad happened; please try again later.'));
  } 

  traerColumnasTabla(tabla:string):Observable<any[]>{
    const url = this.servidor+'traer-columnas-de-tabla.php?tabla='+tabla;  // URL to web api
    return this.http.get<any[]>(url)
    .pipe(
      tap(data=>{
        //console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(1500),
      distinctUntilChanged(),
      startWith([]),
      catchError(this.handleError),
    );
  }


  traerIdDelUnaTabla(tabla:string,id:string,order:string,by:string):Observable<any[]>{
    //console.log(tabla,id);
    const url = this.servidor+'traer-tabla-por-id.php?tabla='+tabla+"&id="+id+"&order="+order+"&by="+by;  // URL to web api
    //console.log(url);
    return this.http.get<any[]>(url)
    .pipe(
      tap(data=>{
       //console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(500),
      distinctUntilChanged(),
      startWith([]),
      catchError(this.handleError),
    );
  }

  traerAlgoDeUnaTabla(tabla:string,columna:string,que:string,filtro:string,orden:string,limit:string):Observable<any[]>{
    //console.log(tabla,columna,que);
    const url = this.servidor+'traer-tabla.php?tabla='+tabla+"&columna="+columna+"&que="+que+"&filtro="+filtro+"&orden="+orden+"&limit="+limit;  // URL to web api
    return this.http.get<any[]>(url)
    .pipe(
      tap(data=>{
        //console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(500),
      distinctUntilChanged(),
      startWith([]),
      catchError(this.handleError),
    );
  }

  // Este endpoint devuelve una sola imagen, no una lista, asÃ­ que no debe iniciar con [].
  /*
  traerImgPorID(id:string){
    const url = this.servidor+'traer-img-por-id.php?id='+id;  // URL to web api
    return this.http.get<Img>(url)
    .pipe(
      tap(data=>{
       //console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(500),
      distinctUntilChanged(),
      startWith([]),
      catchError(this.handleError),
    );
  }
  */
  traerImgPorID(id: string): Observable<Img> {
    const url = this.servidor + 'traer-img-por-id.php?id=' + id;  // URL to web api
    return this.http.get<Img>(url)
      .pipe(
        tap(data => {
          //console.log(data);
        }),
        map(resp => resp),
        debounceTime(500),
        distinctUntilChanged(),
        catchError(this.handleError),
      );
  }

  

  borrarPorId(tabla:string,id:string){
    const url = this.servidor+'borrar-por-id.php?tabla='+tabla+"&id="+id;  // URL to web api
    return this.http.get(url)
    .pipe(
      tap(data=>{
        //console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(500),
      distinctUntilChanged(),
      startWith([]),
      catchError(this.handleError),
    );
  }
  
  insertArray(tabla:string, data:Img[]  | any){
    //console.log(tabla, data);
    const url = this.servidor+'insert_array.php'; // URL to web api
    //console.log(url);
    const options = new HttpParams()
      .set('tabla', tabla)
      .set('datos',JSON.stringify(data))
    ;
    return this.http.post(url,options)
      .pipe(
        catchError(this.handleError)
      ).pipe(
        tap(
          val=>{
            this.loading = false;
            //console.log(val);
            }
          )
      );
  }

  cargaMasiva(tabla:string, data: any){
    //console.log(tabla, data);
    const url = this.servidor+'cargaAutomatica.php'; // URL to web api
    
    const options = new HttpParams()
    .set('datos', data.empleados)
    .set('empresa', data.empresa)
    .set('tabla', tabla)
    ;
    return this.http.post(url,options)
      .pipe(
        catchError(this.handleError)
      ).pipe(
        tap(
          val=>{
            this.loading = false;
           // console.log(val);
            }
          )
      );
  }

  cargaMasivaTodo(tabla:string, data: any){
    //console.log(tabla, data);
    const url = this.servidor+'cargaAutomaticaTodo.php'; // URL to web api
    
    const options = new HttpParams()
    .set('datos', data)
    .set('tabla', tabla)
    ;
    return this.http.post(url,options)
      .pipe(
        catchError(this.handleError)
      ).pipe(
        tap(
          val=>{
            this.loading = false;
            //console.log(val);
            }
          )
      );
  }

  insertBlog(tabla:string, data:Img[]  | any){
    //console.log(tabla, data);
    const url = this.servidor+'insert_blog.php'; // URL to web api
    //console.log(url);
    const options = new HttpParams()
      .set('tabla', tabla)
      .set('datos',JSON.stringify(data))
    ;
    return this.http.post(url,options)
      .pipe(
        catchError(this.handleError)
      ).pipe(
        tap(
          val=>{
            this.loading = false;
            //console.log(val);
            }
          )
      );
  }

  editBlog(tabla: string, data: any, id: string, where: string) {
    const url = this.servidor + 'edit_blog.php';

    const body = new HttpParams()
      .set('tabla', tabla)
      .set('datos', JSON.stringify(data))
      .set('id', id)
      .set('where', where);

    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

    return this.http.post(url, body.toString(), { headers })
      .pipe(
        catchError(this.handleError),
        tap(() => { this.loading = false; })
      );
  }

  insertDia(tabla:string, data:Img[]  | any){
    //console.log(tabla, data);
    const url = this.servidor+'easylunch/insert_dia.php'; // URL to web api
    //console.log(url);
    const options = new HttpParams()
      .set('tabla', tabla)
      .set('datos',JSON.stringify(data))
    ;
    return this.http.post(url,options)
      .pipe(
        catchError(this.handleError)
      ).pipe(
        tap(
          val=>{
            this.loading = false;
            //console.log(val);
            }
          )
      );
  }

  insertArrayUsuario(tabla:string, data:any):Observable<ApiResponse>{
    //console.log(tabla, data);
    const url = this.servidor+'insert_array_usuario.php'; // URL to web api
    const options = new HttpParams()
      .set('tabla', tabla)
      .set('datos',JSON.stringify(data))
    ;
    return this.http.post<ApiResponse>(url,options)
      .pipe(
        catchError(this.handleError)
      ).pipe(
        tap(
          val=>{
            this.loading = false;
            //console.log(val);
            }
          )
      );
  }

  edit(tabla:string, data:any, id:string, where:string){
    //console.log(tabla,data,id,where);
    const url = this.servidor+'edit.php'; // URL to web api
    const options = new HttpParams()
      .set('tabla', tabla)
      .set('datos',JSON.stringify(data))
      .set('id',id)
      .set('where',where)
    ;
    return this.http.post(url,options)
      .pipe(
        catchError(this.handleError)
      ).pipe(
        tap(
          val=>{
            console.log(val);
            this.loading = false;
          }
          )
      );
  }
  
  editDia(tabla:string, data:any, id:string, where:string){
   // console.log(tabla,data,id,where);
    const url = this.servidor+'easylunch/edit_dia.php'; // URL to web api
    const options = new HttpParams()
      .set('tabla', tabla)
      .set('datos',JSON.stringify(data))
      .set('id',id)
      .set('where',where)
    ;
    return this.http.post(url,options)
      .pipe(
        catchError(this.handleError)
      ).pipe(
        tap(
          val=>{this.loading = false;}
          )
      );
  }

  editar(tabla:string, que:string,valor:string, id:string, where:string){
    
    const url = this.servidor+'editar.php'; // URL to web api
    const options = new HttpParams()
      .set('tabla', tabla)
      .set('que',que)
      .set('valor',valor)
      .set('id',id)
      .set('where',where)
    ;
    return this.http.post(url,options)
      .pipe(
        catchError(this.handleError)
      ).pipe(
        tap(
          val=>{this.loading = false;}
          )
      );
  }

  GuardarImg(tabla:string,idTabla:string,base:string, aspectRatio:any){
    //console.log(tabla,idTabla);  
    tabla = tabla.trim();
    idTabla = idTabla.trim();
    aspectRatio = aspectRatio.trim();
       
    const url = this.servidor+'guardar-editar-img.php';  // URL to web api
    
    const options = new HttpParams()
      .set('tabla', tabla)
      .set('id_tabla',idTabla)
      .set('base',btoa(base))
      .set('aspect',aspectRatio);
    ;
    //console.log(options);
    return this.http.post(url,options)
      .pipe(
        catchError(this.handleError)
      );
  }

  GuardarImgEnCarousel(idTabla:string,base:string, aspectRatio:any){
     const url = this.servidor+'guardar-img-carousel.php';  // URL to web api
     const options = new HttpParams()
       .set('id_tabla',idTabla)
       .set('base',btoa(base))
       .set('aspect',aspectRatio);
     return this.http.post(url,options)
       .pipe(
         catchError(this.handleError)
       );
  }

  
 
  traerImgPorIdObs(id:any,tabla:string):Observable<Img[]>{
    const url = this.servidor+'traer-img-por-id.php?id='+id+'&tabla='+tabla;  // URL to web api
    return this.http.get<Img[]>(url)
    .pipe(
      tap(data=>{
       // console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(500),
      distinctUntilChanged(),
      startWith([]),
      catchError(this.handleError),
    );
  }

  editarOrden(tabla:string,id:string,orden:string){
    //console.log(tabla, id, orden);
    const url = this.servidor+'cambiar-orden.php?tabla='+tabla+'&id='+id+'&orden='+orden;  // URL to web api
    return this.http.get<number>(url)
    .pipe(
      tap(
        val=>{this.loading = false;}
        )
    );
  }

  borrarArchivo(archivo:string){
    //console.log(tabla, id, orden);
    const url = this.servidor+'borrar-archivo.php?archivo='+archivo;  // URL to web api
    return this.http.get<any>(url)
    .pipe(
      tap(
        val=>{this.loading = false;}
        )
    );
  }
 
    
  goBack() {
    this.location.back();
  }
 
  
  

  traerUnicos(tabla:string,columna:string){
    this.loader = true;
    const url = this.servidor+'traer-columna-unique.php?tabla='+tabla+'&columna='+columna;  // URL to web api
    return this.http.get<any[]>(url)
    .pipe(
      tap(data=>{
       //console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(500),
      distinctUntilChanged(),
      startWith([]),
      catchError(this.handleError),
    );
  }


  traerDeudores(coro:string,mes:string){
    this.loader = true;
    const url = this.servidor+'falta-pagar.php?coro='+coro+'&mes='+mes;  // URL to web api
    return this.http.get<any[]>(url)
    .pipe(
      tap(data=>{
       //console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(500),
      distinctUntilChanged(),
      startWith([]),
      catchError(this.handleError),
    );
  }

  
  traerOpciones(id:string){
    this.loader = true;
    const url = this.servidor+'traer-opciones.php?id='+id;  // URL to web api
    return this.http.get<any[]>(url)
    .pipe(
      catchError(this.handleError),
      tap(()=>{this.loader = false;})
    );
  }
  
  traerOpcionesNombreOpcion(id:string){
    this.loader = true;
    const url = this.servidor+'traer-opciones-nombre-opcion.php?id='+id;  // URL to web api
    return this.http.get<any[]>(url)
    .pipe(
      catchError(this.handleError),
      tap(()=>{this.loader = false;})
    );
  }
  
  traerArticulosPorBusqueda(tabla:string,palabra:string){
    this.loader = true;
    const url = this.servidor+'traer-articulos-like-new.php?tabla='+tabla+'&palabra='+palabra;  // URL to web api
    return this.http.get<any[]>(url)
    .pipe(
      catchError(this.handleError),
      tap(()=>{this.loader = false;})
    );
  }

  traerArticulosPorBusquedaQue(tabla:string,que:string,palabra:string){
    this.loader = true;
    const url = this.servidor+'traer-articulos-like-que.php?tabla='+tabla+'&palabra='+palabra+'&que='+que;  // URL to web api
    return this.http.get<any>(url)
    .pipe(
      catchError(this.handleError),
      tap((data)=>{
        //console.log(data);
        this.loader = false;})
    );
  }


  traerArticulosPorBusquedaSinLike(tabla:string,que:string,palabra:string){
    this.loader = true;
    const url = this.servidor+'traer-articulos-like-que.php?tabla='+tabla+'&palabra='+palabra+'&que='+que;  // URL to web api
    return this.http.get<any>(url)
    .pipe(
      catchError(this.handleError),
      tap((data)=>{
        //console.log(data);
        this.loader = false;})
    );
  }

  busqueda(tabla:string, data:any,order:string,by:string):Observable<any[]>{
   // console.log(tabla, data);
    const url = this.servidor+'buscar-en-todas-las-columnas.php'; // URL to web api
    //console.log(url);
    const options = new HttpParams()
      .set('tabla', tabla)
      .set('data',JSON.stringify(data[0]))
      .set('order',order)
      .set('by',by)
    ;
    return this.http.post<any[]>(url,options)
    .pipe(
      tap(data=>{
        //this.options.next(data);
        //console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(500),
      distinctUntilChanged(),
      startWith([]),
      catchError(this.handleError),
    );
  };

  busquedaPorTabla(tabla:string, data:any):Observable<any[]>{
    //console.log(tabla, data);
    const url = this.servidor+'buscar-por-tabla.php'; // URL to web api
    //console.log(url);
    const options = new HttpParams()
      .set('tabla', tabla)
      .set('data',JSON.stringify(data[0]))
    ;
    return this.http.post<any[]>(url,options)
    .pipe(
      tap(data=>{
        //this.options.next(data);
        //console.log(data);
      }),
      map(resp => {
        return resp.sort((a, b) => b.id - a.id); // 🔥 Ordena por id DESC
      }),
      debounceTime(500),
      distinctUntilChanged(),
      startWith([]),
      catchError(this.handleError),
    );
  };

  columnaContieneEstaPalabra(tableName:string, columnName:string, searchWord:string,order:string,by:string):Observable<any[]>{
    const url = this.servidor+'contiene-esta-palabra.php'; // URL to web api
    //console.log(url);
    const options = new HttpParams()
      .set('tableName', tableName)
      .set('columnName',columnName)
      .set('searchWord',searchWord)
      .set('order',order)
      .set('by',by)
    ;
    return this.http.post<any[]>(url,options)
    .pipe(
      tap(data=>{
        //this.options.next(data);
       // console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(500),
      distinctUntilChanged(),
      startWith([]),
      catchError(this.handleError),
    );
  }

  traerNovedadesSeo(seo:string):Observable<any[]>{
    const url = this.servidor+'traer-novedades-por-seo.php?seo='+seo;  // URL to web api
    return this.http.get<any[]>(url)
    .pipe(
      tap(data=>{
        //this.options.next(data);
        //console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(500),
      distinctUntilChanged(),
      startWith([]),
      catchError(this.handleError),
    );
  }

  buscarSuscriptores(tabla:string, email:string):Observable<number>{
    const url = this.servidor+'buscar-suscriptores.php';  // URL to web api
    const options = new HttpParams()
      .set('tabla', tabla)
      .set('email',email)
    ;
    return this.http.post<number>(url,options)
    .pipe(
      tap(data=>{
        //this.options.next(data);
       // console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(500),
      distinctUntilChanged(),
      catchError(this.handleError),
    );
  }

  blog_next(id:string):Observable<any>{
    //console.log(id);
    const url = this.servidor+'blog-next.php?id='+id; 
    return this.http.get<any>(url)
    .pipe(
      tap(data=>{
        //console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(500),
      distinctUntilChanged(),
      startWith([]),
      catchError(this.handleError),
    );
  }

  blog_prev(id:string):Observable<any>{
    //console.log(id);
    const url = this.servidor+'blog-prev.php?id='+id; 
    return this.http.get<any>(url)
    .pipe(
      tap(data=>{
        //console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(500),
      distinctUntilChanged(),
      startWith([]),
      catchError(this.handleError),
    );
  }

  traerBlog():Observable<any[]>{
    this.loader = true;
    const url = this.servidor+'traer-blog.php';  // URL to web api
    return this.http.get<any[]>(url)
    .pipe(
      tap(data=>{
      //console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(500),
      distinctUntilChanged(),
      startWith([]),
      catchError(this.handleError),
    );
  }

   
  traerAlgoPorURLGET(serverUrl:string, objeto:any){
    const url = this.servidor+serverUrl; 
    // Crear HttpParams a partir del objeto
    let params = new HttpParams();
    for (const key in objeto) {
        if (objeto.hasOwnProperty(key)) {
            params = params.append(key, objeto[key]);
        }
    }
    return this.http.get<any[]>(url, { params })
    .pipe(
        tap(data => {
            //console.log(data);
        }),
        map(resp => {
            return resp;
        }),
        debounceTime(500),
        distinctUntilChanged(),
        startWith([]),
        catchError(this.handleError),
    );
  }

 
  traerDatosParaFiltroConStringSeparadosPorColumnas(tabla:string,columna:string,orden:string){
    this.loader = true;
    const url = this.servidor+`traer-datos-unicos-de-columna.php?tabla=${tabla}&columna=${columna}&orden=${orden};`;  
    return this.http.get<any[]>(url)
    .pipe(
      catchError(this.handleError),
      tap(()=>{this.loader = false;})
    );
  }

  traerPlatosBebidasPostres(empresa:string):Observable<any>{
    //console.log(tabla, data);
    const url = this.servidor+'easylunch/traerPlatosBebidasPostres.php'; // URL to web api
    //console.log(url);
    const options = new HttpParams()
      .set('empresa', empresa)
    ;
    return this.http.post<any[]>(url,options)
    .pipe(
      tap(data=>{
        //this.options.next(data);
        //console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(500),
      distinctUntilChanged(),
      startWith([]),
      catchError(this.handleError),
    );
  };

  traer_pedidos_por_id(id_user:number):Observable<any[]>{
    //console.log(tabla, data);
    const url = this.servidor+'easylunch/traer_pedidos_del_usuario.php'; // URL to web api
    //console.log(url);
    const options = new HttpParams()
      .set('id_user', id_user)
    ;
    return this.http.post<any[]>(url,options)
    .pipe(
      tap(data=>{
        //console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(500),
      distinctUntilChanged(),
      startWith([]),
      catchError(this.handleError),
    );
  };

  traer_pedidos_de_todos_los_usuarios():Observable<any[]>{
    //console.log(tabla, data);
    const url = this.servidor+'easylunch/traer_pedidos_de_todos_los_usuarios.php'; // URL to web api
    
    return this.http.get<any[]>(url)
    .pipe(
      tap(data=>{
        //console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(500),
      distinctUntilChanged(),
      startWith([]),
      catchError(this.handleError),
    );
  };

  traer_pedidos_de_todos_los_usuarios_por_empresa(empresa:string):Observable<any[]>{
    //console.log(tabla, data);
    const url = this.servidor+'easylunch/traer_pedidos_de_todos_los_usuarios_por_empresa.php?empresa='+empresa; // URL to web api
    
    return this.http.get<any[]>(url)
    .pipe(
      tap(data=>{
        //console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(500),
      distinctUntilChanged(),
      startWith([]),
      catchError(this.handleError),
    );
  };

  traer_pedidos_por_id_y_fecha(id_user:number,dia:string,mes:string,anio:string):Observable<any[]>{
    //console.log(id_user, dia, mes, anio);
    const url = this.servidor+'easylunch/traer_pedidos_del_usuario_por_fecha.php'; // URL to web api
    //console.log(url);
    const options = new HttpParams()
      .set('id_user', id_user)
      .set('dia', dia)
      .set('mes', mes)
      .set('anio', anio)
    ;
    return this.http.post<any[]>(url,options)
    .pipe(
      tap(data=>{
       // console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(500),
      distinctUntilChanged(),
      startWith([]),
      catchError(this.handleError),
    );
  };

  traerConfiguracionPagos(){
    this.loader = true;
    const url = this.servidor+'traerConfigPedidos.php';  
    return this.http.get<any[]>(url)
    .pipe(
      tap(data=>{
       // console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(500),
      distinctUntilChanged(),
      startWith([]),
      catchError(this.handleError),
    );
  }
  
  traerCarouselElementos(id:string){
    const url = this.servidor+'traer-carousel-elementos.php?id='+id;  // URL to web api
    return this.http.get<Carousel[]>(url)
    .pipe(
      catchError(this.handleError)
    ).pipe(
      tap(
          val=>{this.loading = false;}
        )
    );
  }

  

  directorio(dir:string):Observable<any[]>{
    
    const url = this.servidor+'directories.php?dir='+dir;  // URL to web api
    return this.http.get<any[]>(url)
    .pipe(
      catchError(this.handleError),
      tap((data)=>{
        //console.log(data);
        })
    );
  }


  

  uploadFile(file: File): Observable<number> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const uploadUrl = this.servidor+'upload/guardar-video.php';  // URL to web api
    return this.http.post(uploadUrl, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            return event.total ? Math.round((event.loaded / event.total) * 100) : 0;
          case HttpEventType.Response:
            return 100;
          default:
            return 0;
        }
      })
    );
  }

  uploadFileArchivo(file: File, id_caliopero:string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('id_caliopero', id_caliopero); // Agregar el ID como un campo más
   
    const uploadUrl = this.servidor + 'upload/guardar-archivos.php';
    return this.http.post(uploadUrl, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      tap((event) => { 
        //console.log(event); 
      }),
      map((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            return event.total ? Math.round((event.loaded / event.total) * 100) : 0;
          case HttpEventType.Response:
            return event.body;  // aquí obtenemos el JSON de respuesta
          default:
            return event;
        }
      })
    );
  }

  obtenerDiasHabilesSiguientes(cantidad: number): { dia: number; mes: number; anio: number; nombreDia: string }[] {
  const hoy = new Date();
  const resultado: { dia: number; mes: number; anio: number; nombreDia: string }[] = [];
  const diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  let contador = 0;

  while (resultado.length < cantidad) {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() + contador);

    const diaSemana = fecha.getDay(); // 0 = Domingo, 6 = Sábado

    if (diaSemana !== 0 && diaSemana !== 6) {
      resultado.push({
        dia: fecha.getDate(),
        mes: fecha.getMonth() + 1,
        anio: fecha.getFullYear(),
        nombreDia: diasSemana[diaSemana]
      });
    }

    contador++;
  }

  return resultado;
}


  exportarAExcel(datos: any[]) {
  const url = this.servidor+'bajar-excel.php';  // URL to web api
    return this.http.post(url, datos, {
      responseType: 'blob'
    });
  }

  traerFeriados(){
    this.loader = true;
    const url = this.servidor+'traerFeriados.php';  
    return this.http.get<any[]>(url)
    .pipe(
      tap(data=>{
       // console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(500),
      distinctUntilChanged(),
      startWith([]),
      catchError(this.handleError),
    );
  }
  

}

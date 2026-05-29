import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray } from '@angular/cdk/drag-drop';
import { AdminService } from '../../../services/admin.service';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { MatIconModule } from '@angular/material/icon';
import { Carousel } from '../interface';


@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [
    RouterModule,
    MatIconModule,
    CdkDrag,
    CdkDropList
],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {
  idTabla: string = '';
  tabla: string = '';
  carousel$:Observable<Carousel[]> = new Subject;
  lista:any[] = [];
  directorio:string = '';
  

  
  crearLista(){
    this.carousel$.subscribe(d=>{
      this.lista = d;
    })
  }

  imagenPrincipal(img:string){
    this.service.editar('carousel','img',img,this.idTabla,'id').subscribe(d=>{
      console.log(d);
      if(d===0){
        this._snackBar.open('Ahora es la imagen principal', 'ok',{
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 4000,
        });
      }
    })
  }

  fichaParaEmail(img:string){
    this.directorio = 'assets/fichas/'+this.idTabla+'/'+img;
    this.service.editar('asociados','ficha_email',this.directorio,this.idTabla,'id').subscribe(d=>{
      console.log(d);
      if(d===0){
        this._snackBar.open('Ahora es la ficha para mandar por email', 'ok',{
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 4000,
        });
      }
    })
  }

  borrarImagen(id:string):void{
    this.service.borrarPorId('carousel',id).subscribe(d=>{
      console.log(d);
      if(d===0){
        this._snackBar.open('Se ha borrado la imagen del carousel', 'ok',{
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 4000,
        });
        this.crearLista();
      }
      
    })
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.lista, event.previousIndex, event.currentIndex);
    console.log(event.previousIndex, event.currentIndex);
    //this.service.edit('carousel',[{'orden':event.currentIndex}],'1','id');
    console.log('muevo el id:',this.lista[event.currentIndex].id);
    console.log('lo muevo al espacio',event.currentIndex);
    console.log('ocupa su lugar el id:',this.lista[event.previousIndex].id);
    console.log(this.lista);
    let error = 0;
    for(let x in this.lista){
      this.service.editarOrden(this.tabla,this.lista[x].id,x).subscribe(d=>{
        if(d===1){
          error++;
        }
      })
    }
    if(error===0){
      this._snackBar.open('Se ha actualizado el orden', 'ok',{
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 4000,
      });
    }
    
  }

  esArchivoPDF(archivo:string): boolean {
    const extension = this.obtenerExtension(archivo);
    return extension.toLowerCase() === 'pdf';
  }

  obtenerExtension(nombreArchivo: string): string {
    const partes = nombreArchivo.split('.');
    return partes[partes.length - 1];
  }
  
  constructor(
    private route: ActivatedRoute,
    private service: AdminService,
    private location: Location,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe( (params) => {
      this.idTabla = params['imgId'];
      this.tabla = params['tablaId'];
      console.log(this.idTabla);
      console.log(this.tabla);
      if(this.tabla!=='fichas'){
        this.carousel$ = this.service.traerCarouselElementos(this.idTabla);
      }else{
        this.directorio = '../assets/'+this.tabla+'/'+this.idTabla+'/';
        this.carousel$ = this.service.directorio(this.directorio);
      }
    });
    this.crearLista();
  }

}

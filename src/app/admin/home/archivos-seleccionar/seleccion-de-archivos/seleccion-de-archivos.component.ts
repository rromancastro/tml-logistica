import { ChangeDetectorRef, Component, computed, inject, input, model, output, signal, ViewChild } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminAService } from '../../../../services/adminA.service';
import { CarouselService } from '../../../../services/carousel.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SesionStorageServiceService } from '../../../../services/sesion-storage-service.service';

@Component({
  selector: 'app-seleccion-de-archivos',
  imports: [
    MatIconModule,
        MatButtonModule,
        MatPaginatorModule,
        MatTooltipModule,
        MatCheckboxModule
  ],
  templateUrl: './seleccion-de-archivos.component.html',
  styleUrl: './seleccion-de-archivos.component.css'
})
export class SeleccionDeArchivosComponent {
  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  
  emitoUrl = output<{ folder: any }>();
  actualizarData = input(0);
  
  label = computed(() =>{
      if(this.actualizarData()){
        console.log('hago la funcion...');
        this.actualizar();
      }else{
        console.log('nada');
      }
  }); 
  
  public dataSource = new MatTableDataSource<any>();
  private admservice = inject(AdminAService);
  public carouselServ = inject(CarouselService);
  public carpeta = this.carouselServ.carpeta;
  
  public img = signal<any>([]);
  
  private ref =  inject(ChangeDetectorRef);
  public checked = model(false);
  public tabla = signal('0');
  public imagenes:string[] = []; 
  private _snackBar = inject(MatSnackBar);
  public imagenesCheckeadas:string[]  = [];
  
  public sesionService = inject(SesionStorageServiceService); 
  public caliopero = this.sesionService.getItem('caliopero');

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    public sanitizer: DomSanitizer
  ){

    //console.log(this.caliopero);
    if(this.caliopero){
      //console.log("entre aca...");
      const data = [{'id_caliopero': this.caliopero.id}];
      //console.log(data);
      this.admservice.busquedaPorTabla('archivos',data)
        .subscribe((d:any)=>{
          this.ref.markForCheck();
          this.dataSource.data = d; // Asigna los datos a la tabla
          //console.log('this.dataSource.data' ,this.dataSource.data);
          this.ref.markForCheck();
          if(this.paginator){
            this.ref.markForCheck();
            this.dataSource.paginator = this.paginator; // Conecta el paginador después de la inicialización
            this.ref.markForCheck();
          }
      })
    }else{
     // console.log("busco todo...");
      this.admservice.traerIdDelUnaTabla('archivos','0','DESC','id')
        .subscribe((d:any)=>{
          this.ref.markForCheck();
          this.dataSource.data = d; // Asigna los datos a la tabla
          //console.log('this.dataSource.data' ,this.dataSource.data);
          this.ref.markForCheck();
          if(this.paginator){
            this.ref.markForCheck();
            this.dataSource.paginator = this.paginator; // Conecta el paginador después de la inicialización
            this.ref.markForCheck();
          }
      })
    }
  }

  openSnackBar(msj:string,btn:string) {
    this._snackBar.open(msj, btn);
  }

  borrar(archivo:string,id:string){
    console.log(archivo);
   
    this.admservice.borrarPorId('archivos',id).subscribe((d:any)=>{
      console.log(d);
      this.actualizar();
      this.openSnackBar('Archivo eliminado', 'Ok');
    });
    
    this.admservice.borrarArchivo(archivo)
      .subscribe((d:any)=>{
        this.actualizar();
        this.openSnackBar('Archivo eliminado', 'Ok');
    });
  }

  goBack() {
    this.location.back();
  }
  
  sumar(imagen: string, isChecked: boolean) {
    if (isChecked) {
      if (!this.imagenesCheckeadas.includes(imagen)) {
        this.imagenesCheckeadas.push(imagen);
        //this.emitirFotos(this.imagenesCheckeadas);
        this.openSnackBar('Archivo seleccionado', 'Ok');
        
      }
    } else {
      this.imagenesCheckeadas = this.imagenesCheckeadas.filter(img => img !== imagen);
      //this.emitirFotos(this.imagenesCheckeadas);
      this.openSnackBar('Archivo descartado', 'Ok');
      
    }
  }
  
  onSubmit() {
    const formValue = { 'folder': JSON.stringify(this.imagenesCheckeadas) };
    this.emitirArchivos(formValue);
  }

  emitirArchivos(folder: any) {
    //console.log('🔹 Entre a emitir con:', imagenes);

    if (!folder) {
      console.error('🚨 Error: imagenes es undefined o null');
      return;
    }

    this.emitoUrl.emit({ folder }); // 🔥 Emite correctamente los datos
    this.ref.markForCheck();
  }

  actualizar(){
    if(this.caliopero){
      //console.log("entre aca...");
      const data = [{'id_caliopero': this.caliopero.id}];
      this.admservice.busquedaPorTabla('archivos',data)
        .subscribe((d:any)=>{
          this.ref.markForCheck();
          this.dataSource.data = d; // Asigna los datos a la tabla
          this.ref.markForCheck();
          if(this.paginator){
            this.ref.markForCheck();
            this.dataSource.paginator = this.paginator; // Conecta el paginador después de la inicialización
            this.ref.markForCheck();
          }
      })
    }else{
      console.log("busco todo...");
      this.admservice.traerIdDelUnaTabla('archivos','0','DESC','id')
        .subscribe((d:any)=>{
          this.ref.markForCheck();
          this.dataSource.data = d; // Asigna los datos a la tabla
          this.ref.markForCheck();
          if(this.paginator){
            this.ref.markForCheck();
            this.dataSource.paginator = this.paginator; // Conecta el paginador después de la inicialización
            this.ref.markForCheck();
          }
      })
    }
  }
  

  ngOnInit() {
    if(this.caliopero){
      console.log("entre aca...");
      const data = [{'id_caliopero': this.caliopero.id}];
      this.admservice.busquedaPorTabla('archivos',data)
        .subscribe((d:any)=>{
          this.ref.markForCheck();
          this.dataSource.data = d; // Asigna los datos a la tabla
          this.ref.markForCheck();
          if(this.paginator){
            this.ref.markForCheck();
            this.dataSource.paginator = this.paginator; // Conecta el paginador después de la inicialización
            this.ref.markForCheck();
          }
      })
    }else{
    this.admservice.traerIdDelUnaTabla('archivos', '0', 'DESC', 'id')
      .subscribe((d: any) => {
        this.dataSource.data = d.map((img: any) => ({
          ...img,
          checked: this.imagenesCheckeadas.includes(this.carpeta + img.src)
        }));
        this.dataSource.paginator = this.paginator;  // 💡 Se asigna correctamente
        this.ref.detectChanges();  // 💡 detectChanges() es mejor que markForCheck()
      });
    }
  }
}




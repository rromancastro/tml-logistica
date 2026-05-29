import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, effect, inject, input, model, output, signal, ViewChild } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { CommonModule, Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { NgOptimizedImage } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminAService } from '../../../../services/adminA.service';
import { CarouselService } from '../../../../services/carousel.service';

@Component({
  selector: 'app-seleccionarlas',
  imports: [
    MatIconModule,
    MatButtonModule,
    NgOptimizedImage,
    MatPaginatorModule,
    MatTooltipModule,
    MatCheckboxModule,
  ],
  templateUrl: './seleccionarlas.component.html',
  styleUrl: './seleccionarlas.component.css',
  host: { ngSkipHydration: 'true' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeleccionarlasComponent {

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  
  emitoUrl = output<{ imagenes: any }>();
  reiniciar = input(false);
  
  label = computed(() =>{
    if(this.reiniciar()){
      console.log('hago la funcion...');
      this.actualizar();
    }else{
      console.log('nada');
    }
  }); 
  
  public dataSource = new MatTableDataSource<any>();
  private admservice = inject(AdminAService);
  private carouselServ = inject(CarouselService);
  public carpeta = this.carouselServ.carpeta;
  
  public img = signal<any>([]);
  
  private ref =  inject(ChangeDetectorRef);
  public checked = model(false);
  public tabla = signal('0');
  public imagenes:string[] = []; 
  private _snackBar = inject(MatSnackBar);
  public imagenesCheckeadas:string[]  = [];


  constructor(
    private location: Location,
    private route: ActivatedRoute,
  ){
    effect(() => {
      this.label();
      console.log(`The count is: ${this.reiniciar()}`);
    });
    this.admservice.traerIdDelUnaTabla('carrousel','0','DESC','id')
      .subscribe((d:any)=>{
        this.ref.markForCheck();
        this.dataSource.data = d; // Asigna los datos a la tabla
        console.log(this.dataSource.data);
        this.ref.markForCheck();
        if(this.paginator){
          this.ref.markForCheck();
          this.dataSource.paginator = this.paginator; // Conecta el paginador después de la inicialización
          this.ref.markForCheck();
        }
    })
  }

  openSnackBar(msj:string,btn:string) {
    this._snackBar.open(msj, btn);
  }

  goBack() {
    this.location.back();
  }
  
  sumar(imagen: string, isChecked: boolean) {
    if (isChecked) {
      if (!this.imagenesCheckeadas.includes(imagen)) {
        this.imagenesCheckeadas.push(imagen);
        //this.emitirFotos(this.imagenesCheckeadas);
        this.openSnackBar('Imagen seleccionada', 'Ok');
        
      }
    } else {
      this.imagenesCheckeadas = this.imagenesCheckeadas.filter(img => img !== imagen);
      //this.emitirFotos(this.imagenesCheckeadas);
      this.openSnackBar('Imagen descartada', 'Ok');
      
    }
  }
  
  onSubmit() {
    const formValue = { 'imagenes': JSON.stringify(this.imagenesCheckeadas) };
    this.emitirFotos(formValue);
  }

  emitirFotos(imagenes: any) {
    //console.log('🔹 Entre a emitir con:', imagenes);

    if (!imagenes) {
      console.error('🚨 Error: imagenes es undefined o null');
      return;
    }

    this.emitoUrl.emit({ imagenes }); // 🔥 Emite correctamente los datos
    this.ref.markForCheck();
  }

  actualizar(){
    this.admservice.traerIdDelUnaTabla('carrousel','0','DESC','id')
      .subscribe((d:any)=>{
        this.dataSource.data = d; // Asigna los datos a la tabla
        this.ref.markForCheck();
        if(this.paginator){
          this.dataSource.paginator = this.paginator; // Conecta el paginador después de la inicialización
          this.ref.markForCheck();
        }
    })
  }
  
  borrarFoto(id: string) {
   const confirmacion = confirm("¿Estás seguro de que querés borrar esta imagen?");

    if (confirmacion) {
      this.admservice.borrarPorId('carrousel', id)
        .subscribe(d => {
          // Podés agregar algo acá si querés recargar o mostrar un mensaje
          console.log('Imagen borrada:', d);
          this.actualizar();
        });
    }
  }

  ngOnInit() {
    this.route.params.subscribe(data => {
      this.tabla.set(data['id']);

      if (this.tabla() !== '0') {
        this.admservice.traerIdDelUnaTabla('carrousel', this.tabla(), 'DESC', 'id')
          .subscribe((d: any) => {
            if (d[0]) {
              this.imagenesCheckeadas = JSON.parse(d[0].imagenes); // Cargar imágenes seleccionadas
              this.ref.markForCheck();
            }
          });
      }
    });

    this.admservice.traerIdDelUnaTabla('carrousel', '0', 'DESC', 'id')
      .subscribe((d: any) => {
        this.dataSource.data = d.map((img: any) => ({
          ...img,
          checked: this.imagenesCheckeadas.includes(this.carpeta + img.src)
        }));
        this.ref.markForCheck();
      });
    }
}


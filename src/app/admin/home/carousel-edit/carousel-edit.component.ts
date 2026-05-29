import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, model, signal, ViewChild } from '@angular/core';
import { AdminAService } from '../../../services/adminA.service';
import { MatIconModule } from '@angular/material/icon';
import { Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { NgOptimizedImage } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CarouselService } from '../../../services/carousel.service';
@Component({
  selector: 'app-carousel-edit',
  imports: [
    MatIconModule,
    MatButtonModule,
    NgOptimizedImage,
    MatPaginatorModule,
    MatTooltipModule,
    MatCheckboxModule
  ],
  templateUrl: './carousel-edit.component.html',
  styleUrl: './carousel-edit.component.css',
  host: { ngSkipHydration: 'true' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselEditComponent {

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  
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
  private adminService = inject(AdminAService);  
  public imagenesCheckeadas:string[]  = [];


  constructor(
    private location: Location,
    private route: ActivatedRoute,
  ){
    this.admservice.traerIdDelUnaTabla('img','0','DESC','id')
      .subscribe((d:any)=>{
        this.dataSource.data = d; // Asigna los datos a la tabla
        this.ref.markForCheck();
        if(this.paginator){
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
        this.openSnackBar('Imagen agregada', 'Ok');
      }
    } else {
      this.imagenesCheckeadas = this.imagenesCheckeadas.filter(img => img !== imagen);
      this.openSnackBar('Imagen eliminada', 'Ok');
    }
  }
  
  onSubmit() {
    const formValue = { 'imagenes': JSON.stringify(this.imagenesCheckeadas) };
    this.adminService.edit('carousel', formValue, this.tabla(), 'id').subscribe(respuesta => {
      if (respuesta === 0) {
        this.openSnackBar("SE HA EDITADO CORRECTAMENTE", "Ok");
        this.goBack();
      } else {
        this.openSnackBar("Estamos teniendo un problema, intente más tarde...", "Ok");
      }
    });
  }

  ngOnInit() {
    this.route.params.subscribe(data => {
      this.tabla.set(data['id_carousel']);

      if (this.tabla() !== '0') {
        this.admservice.traerIdDelUnaTabla('carousel', this.tabla(), 'DESC', 'id')
          .subscribe((d: any) => {
            if (d[0]) {
              this.imagenesCheckeadas = JSON.parse(d[0].imagenes); // Cargar imágenes seleccionadas
              this.ref.markForCheck();
            }
          });
      }
    });

    this.admservice.traerIdDelUnaTabla('img', '0', 'DESC', 'id')
      .subscribe((d: any) => {
        this.dataSource.data = d.map((img: any) => ({
          ...img,
          checked: this.imagenesCheckeadas.includes(this.carpeta + img.src)
        }));
        this.ref.markForCheck();
      });
  }
}

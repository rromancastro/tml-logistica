import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, signal, ViewChild } from '@angular/core';
import { AdminAService } from '../../../services/adminA.service';
import { MatIconModule } from '@angular/material/icon';
import { Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CarouselService } from '../../../services/carousel.service';

@Component({
  selector: 'app-imagenes',
  imports: [
    MatIconModule,
    MatButtonModule,
    NgOptimizedImage,
    RouterLink,
    MatPaginatorModule,
    MatTooltipModule
  ],
  templateUrl: './imagenes.component.html',
  styleUrl: './imagenes.component.css',
  host: { ngSkipHydration: 'true' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  
})
export class ImagenesComponent {

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  
  public dataSource = new MatTableDataSource<any>();
  private admservice = inject(AdminAService);
  private carouselService = inject(CarouselService);
  public img = signal<any>([]);
  public carpeta = this.carouselService.carpeta;
  
  private ref =  inject(ChangeDetectorRef);

  constructor(private location: Location){
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

  copiar(url:string){
    this.carouselService.copyToClipboard(url);
  }

  goBack() {
    this.location.back();
  }


  actualizar(){
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

  borrar(id: string) {
    const snackBarRef = this.carouselService._snackBar.open('¿Está seguro de que desea eliminar esta imagen?', 'Confirmar', {
      duration: 5000, // Duración en milisegundos (5s)
      panelClass: ['snackbar-warning'] // Clase CSS opcional
    });
    snackBarRef.onAction().subscribe(() => {
      this.admservice.borrarPorId('img', id)
        .subscribe(d => {
          if (d === 0) {
            this.actualizar();
            this.carouselService.openSnackBar('Se ha borrado correctamente!', 'ok');
          } else {
            this.carouselService.openSnackBar('No hemos podido borrar el item', 'ok');
          }
        });
    });
  }
  
}



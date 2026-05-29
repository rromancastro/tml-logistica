import { Component, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Observable, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../../services/admin.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormatLabelPipe } from '../../../pipes/format-label.pipe';

import { FiltrosComponent } from './filtros/filtros.component';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { DownloadExcelComponent } from './download-excel/download-excel.component';

@Component({
    selector: 'app-listados',
    imports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatIconModule,
        RouterModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        FormatLabelPipe,
        MatSortModule,
        DownloadExcelComponent
    ],
    templateUrl: './listados.component.html',
    styleUrls: ['./listados.component.css'],
    standalone: true,
})
export class ListadosComponent implements OnInit {
  
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort,{ static: false }) sort!: MatSort;

  public dataSource = new MatTableDataSource<any>(); 
  public displayedColumns: string[] = [];
  public columnasFijas : string[] = [];
  public tabla: string = "";
  private destroyRef = inject(DestroyRef);

  public adminService = inject(AdminService);
  private snackBar= inject( MatSnackBar);
  
  public columnas$: Observable<any[]> = new Subject();
  public datos$: Observable<any[]> = new Subject();
  public tengolascolumnas: boolean = false;
  public tengolosdatos: boolean = false;

  constructor(
    private route: ActivatedRoute,
    
   
  ) {} 

  
  accionarFiltros(filtro: any){
    if(filtro==='todos'){
      this.adminService.traerIdDelUnaTabla(this.tabla, '0', 'DESC', 'id').pipe(takeUntilDestroyed(this.destroyRef)).subscribe((d: any[]) => {
        this.dataSource.data = d; // Asigna los datos al MatTableDataSource
        if (this.paginator) {
          this.dataSource.paginator = this.paginator; // Asigna el paginador después de que esté disponible
        }
        if(this.sort){
          this.dataSource.sort = this.sort;
        }
        this.tengolosdatos = true;
      });
    }else{
      const buscar = [{'categoria':filtro}];
      this.adminService.busquedaPorTabla(this.tabla,buscar).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((d: any[]) => {
        console.log(d);
        this.dataSource.data = d; // Asigna los datos al MatTableDataSource
        if (this.paginator) {
          this.dataSource.paginator = this.paginator; // Asigna el paginador después de que esté disponible
        }
        if(this.sort){
          this.dataSource.sort = this.sort;
        }
        this.tengolosdatos = true;
      });
    }
  }

  borrar(tabla: string, id: string) {
    const confirmacion = window.confirm('¿Está seguro de que desea eliminar este dato?');
    if (confirmacion) {
      this.adminService.borrarPorId(tabla, id)
        .subscribe(d => {
          if (d === 0) {
            this.adminService.traerIdDelUnaTabla(this.tabla, '0', 'DESC', 'id').pipe(takeUntilDestroyed(this.destroyRef)).subscribe((d: any[]) => {
              this.dataSource.data = d; // Asigna los datos al MatTableDataSource
              if (this.paginator) {
                this.dataSource.paginator = this.paginator; // Asigna el paginador después de que esté disponible
              }
              if(this.sort){
                this.dataSource.sort = this.sort;
              } 
              
              this.tengolosdatos = true;
            });
            this.snackBar.open('Se ha borrado correctamente!', 'ok', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
          } else {
            this.snackBar.open('No hemos podido borrar el item', 'ok', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
          }
        });
    }
  }

  public obtenerdatos() {
    this.datos$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((d: any[]) => {
      this.dataSource.data = d; // Asigna los datos al MatTableDataSource
      if (this.paginator) {
        this.dataSource.paginator = this.paginator; // Asigna el paginador después de que esté disponible
      }
      if(this.sort){
        this.dataSource.sort = this.sort;
      } 
      this.tengolosdatos = true;
    });
  }

  obtenerTextoLimitado(texto: any): string {
    if (typeof texto === 'string') {
      return texto.slice(0, 100);
    }
    return texto;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    //console.log(this.dataSource.filter);
  }

  
  ngOnInit(): void {
    this.route.params.subscribe(data => {
      this.tabla = data['tabla'] ?? 'noticias';
      this.adminService.traerColumnasTabla(this.tabla).subscribe(d=>{
        this.columnasFijas = ["edit", "erase"];
        if(d.length>0){
          this.displayedColumns = ["edit", ...d ,"erase"];
          //console.log(this.displayedColumns);
        }
      })

      this.adminService.traerIdDelUnaTabla(this.tabla, '0', 'DESC', 'id').pipe(takeUntilDestroyed(this.destroyRef)).subscribe((d: any[]) => {
        this.dataSource.data = d; // Asigna los datos al MatTableDataSource
        if (this.paginator) {
          this.dataSource.paginator = this.paginator; // Asigna el paginador después de que esté disponible
        }
        if(this.sort){
          this.dataSource.sort = this.sort;
        } 
        this.tengolosdatos = true;
      });
      
    });
  }
}

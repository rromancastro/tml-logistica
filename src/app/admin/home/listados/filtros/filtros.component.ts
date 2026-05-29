import { Component, DestroyRef, inject, ChangeDetectionStrategy, ChangeDetectorRef, output, Output, EventEmitter, input, effect } from '@angular/core';
import { AdminService } from '../../../../services/admin.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTableDataSource } from '@angular/material/table';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
    selector: 'app-filtros',
    imports: [MatButtonToggleModule, FormsModule, ReactiveFormsModule],
    templateUrl: './filtros.component.html',
    styleUrl: './filtros.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FiltrosComponent {

  public adminService = inject(AdminService);
  private destroyRef = inject(DestroyRef);
  public dataSource = new MatTableDataSource<any>(); 
  public filtros:any = ""; 
  public mostrar:boolean = false;
  
  @Output() filtroChange = new EventEmitter<string>();
  tabla = input<string>();
  public bases: string[] = ['platos'];
    
    constructor(
      private cdRef: ChangeDetectorRef,
    ){
      this.adminService.traerIdDelUnaTabla('categoria', '0', 'DESC', 'id').pipe(takeUntilDestroyed(this.destroyRef)).subscribe((d: any[]) => {
        this.filtros = d; // Asigna los datos al MatTableDataSource
        this.cdRef.markForCheck();
        //console.log(this.filtros);
      });
      
      effect(() => {
        const tablaValue = this.tabla(); // Guardar el valor en una variable
        //console.log(tablaValue);
        if (tablaValue) {
          this.mostrar = this.buscarStringEnArray(this.bases, tablaValue);
          this.cdRef.markForCheck();
          //console.log(this.mostrar);
        }
      });
      
      
      
    }

    buscarStringEnArray(array: string[], str:  string): boolean {
      //console.log(array.includes(str));
      return array.includes(str);
    }

    setNewFilter(filtro:string) {
      this.filtroChange.emit(filtro);
    }

    
    

}

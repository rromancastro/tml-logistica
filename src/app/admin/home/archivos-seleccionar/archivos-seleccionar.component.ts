import { ChangeDetectorRef, Component, inject, output, signal } from '@angular/core';
import  { MatTabsModule } from '@angular/material/tabs';
import { FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MenuService } from '../../../services/menu.service';
import { MatButtonModule } from '@angular/material/button';
import { SubirArchivosComponent } from '../subir-archivos/subir-archivos.component';
import { SeleccionDeArchivosComponent } from './seleccion-de-archivos/seleccion-de-archivos.component';


@Component({
  selector: 'app-archivos-seleccionar',
  standalone: true,
  imports: [
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    SubirArchivosComponent,
    SeleccionDeArchivosComponent
],
  templateUrl: './archivos-seleccionar.component.html',
  styleUrl: './archivos-seleccionar.component.css',
  host: { ngSkipHydration: 'true' }
})
export class ArchivosSeleccionarComponent {

  private ref =  inject(ChangeDetectorRef);
  public menuServ = inject(MenuService);
  selected = new FormControl(0);
  emitoUrlDesdeArchivosSeleccionar = output<{ folder: any }>();
  public actualizar = signal(0);

  pasarAArchivos(){
    this.selected.setValue(1);
    this.ref.markForCheck();
  }

  recibirArchivos(event: { folder: any }) {
    if (!event || !event.folder) {
      console.error('🚨 Error: No llegaron imágenes o el evento es undefined');
      return;
    }
    this.emitirArchivo(event.folder);
   this.actualizar.set(1);
  }

  emitirArchivo(folder: any) {
    console.log('emitirArchivo: Entre a emitir con:', folder);
    if (!folder) {
      console.error('🚨 Error: imagenes es undefined o null');
      return;
    }
    this.emitoUrlDesdeArchivosSeleccionar.emit({ folder }); // 🔥 Emite correctamente los datos
    this.ref.markForCheck();
  }

}


import { ChangeDetectorRef, Component, inject, output, signal } from '@angular/core';
import  { MatTabsModule } from '@angular/material/tabs';
import { ImgCropNewComponent } from "../img-crop-new/img-crop-new.component";
import { FormControl } from '@angular/forms';
import { SeleccionarlasComponent } from "./seleccionarlas/seleccionarlas.component";
import { MatIconModule } from '@angular/material/icon';
import { MenuService } from '../../../services/menu.service';
import { MatButtonModule } from '@angular/material/button';
import { PexelsGalleryComponent } from '../pexels-gallery/pexels-gallery.component';

@Component({
  selector: 'app-imagenes-seleccionar',
  imports: [
    MatTabsModule,
    ImgCropNewComponent,
    SeleccionarlasComponent,
    MatIconModule,
    MatButtonModule,
    PexelsGalleryComponent
],
  templateUrl: './imagenes-seleccionar.component.html',
  styleUrl: './imagenes-seleccionar.component.css',
  host: { ngSkipHydration: 'true' }
})

export class ImagenesSeleccionarComponent {
  private ref =  inject(ChangeDetectorRef);
  public menuServ = inject(MenuService);
  selected = new FormControl(0);
  emitoUrlDesdeImagenesSeleccionar = output<{ imagenes: any }>();
  actualizar = signal(false);

  pasarAImagenes(){
    this.selected.setValue(1);
    this.ref.markForCheck();
    this.actualizar.set(true);
   // console.log(this.actualizar());
  }

  recibirImagenes(event: { imagenes: any }) {
    if (!event || !event.imagenes) {
      console.error('🚨 Error: No llegaron imágenes o el evento es undefined');
      return;
    }
    this.emitirFotos(event.imagenes);
   //console.log('✅ Imágenes recibidas en Imagenes-seleccionar:', event.imagenes);
  }

  emitirFotos(imagenes: any) {
    //console.log('emitirFotos: Entre a emitir con:', imagenes);
    if (!imagenes) {
      console.error('🚨 Error: imagenes es undefined o null');
      return;
    }
    this.emitoUrlDesdeImagenesSeleccionar.emit({ imagenes }); // 🔥 Emite correctamente los datos
    this.ref.markForCheck();
  }


}

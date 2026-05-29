import { ChangeDetectorRef, Component, inject, output } from '@angular/core';
import  { MatTabsModule } from '@angular/material/tabs';
import { FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MenuService } from '../../../services/menu.service';
import { MatButtonModule } from '@angular/material/button';
//import { PexelsGalleryComponent } from '../pexels-gallery/pexels-gallery.component';
//import { SeleccionarlasComponent } from '../imagenes-seleccionar/seleccionarlas/seleccionarlas.component';
import { VideosSubirComponent } from '../videos-subir/videos-subir.component';
import { PexelsVideoGalleryComponent } from '../pexels-video-gallery/pexels-video-gallery.component';

@Component({
  selector: 'app-videos-seleccionar',
  imports: [
        MatTabsModule,
        VideosSubirComponent,
        //SeleccionarlasComponent,
        MatIconModule,
        MatButtonModule,
        PexelsVideoGalleryComponent
  ],
  templateUrl: './videos-seleccionar.component.html',
  styleUrl: './videos-seleccionar.component.css',
  host: { ngSkipHydration: 'true' }
})
export class VideosSeleccionarComponent {

  private ref =  inject(ChangeDetectorRef);
  public menuServ = inject(MenuService);
  selected = new FormControl(0);
  emitoUrlDesdeVideosSeleccionar = output<{ video: any }>();

  pasarAImagenes(){
    this.selected.setValue(1);
    this.ref.markForCheck();
  }

  recibirVideos(event: { video: any }) {
    if (!event || !event.video) {
      console.error('🚨 Error: No llegaron imágenes o el evento es undefined');
      return;
    }
    this.emitirVideos(event.video);
   //console.log('✅ Imágenes recibidas en Imagenes-seleccionar:', event.imagenes);
  }

  emitirVideos(video: any) {
    console.log('emitir Videos: Entre a emitir con:', video);
    if (!video) {
      console.error('🚨 Error: imagenes es undefined o null');
      return;
    }
    this.emitoUrlDesdeVideosSeleccionar.emit({ video }); // 🔥 Emite correctamente los datos
    this.ref.markForCheck();
  }
}

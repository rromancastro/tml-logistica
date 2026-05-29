import { Component, inject, signal } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AdminAService } from '../../../services/adminA.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CarouselService } from '../../../services/carousel.service';
import { MatButtonModule } from '@angular/material/button';
import { SesionStorageServiceService } from '../../../services/sesion-storage-service.service';

@Component({
  selector: 'app-subir-archivos',
  imports: [MatProgressBarModule,MatButtonModule],
  templateUrl: './subir-archivos.component.html',
  styleUrl: './subir-archivos.component.css'
})
export class SubirArchivosComponent {
  public progresoCargaVideo = signal<number>(0); // % de carga del video
  public videoURL = signal<string | null>(null); // URL para la vista previa

  public progresoSubida = signal<number>(0);
  public selectedFile: File | null = null;
  public fileURL = signal<any>(null);

  public uploadService = inject(AdminAService);
  public carouselServ = inject(CarouselService);

  public sesionService = inject(SesionStorageServiceService); 
  public caliopero = this.sesionService.getItem('caliopero');
  public caliopero_id = '0';

  constructor(public sanitizer: DomSanitizer){
    if(this.caliopero){
      this.caliopero_id = this.caliopero.id;
    }
  }

  fileChangeEvent(event: any): void {
    console.log("fileChangeEvent",event);
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;
    const reader = new FileReader();

    reader.onload = () => {
      this.fileURL.set(reader.result as string);
    };

    reader.readAsDataURL(file);
  }

  subirArchivo() {
    if (!this.selectedFile) {
      alert("Por favor, selecciona un archivo antes de subir.");
      return;
    }

 

  this.uploadService.uploadFileArchivo(this.selectedFile, this.caliopero_id).subscribe(
      (progress) => {
        //console.log(progress);
        this.progresoSubida.set(progress);
        this.carouselServ.openSnackBar(progress.message,"Ok");
      },
      (error) => {
        alert("Error al subir el archivo.");
      }
    );
  }
}

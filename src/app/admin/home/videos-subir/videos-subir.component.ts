import { Component, inject, signal } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AdminAService } from '../../../services/adminA.service';


@Component({
  selector: 'app-videos-subir',
  imports: [MatProgressBarModule],
  templateUrl: './videos-subir.component.html',
  styleUrl: './videos-subir.component.css'
})
export class VideosSubirComponent {

  public progresoCargaVideo = signal<number>(0); // % de carga del video
  public videoURL = signal<string | null>(null); // URL para la vista previa

  public progresoSubida = signal<number>(0);
  public selectedFile: File | null = null;
  public fileURL = signal<string | null>(null);

  public uploadService = inject(AdminAService);

  fileChangeEvent(event: any): void {
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

 

  this.uploadService.uploadFile(this.selectedFile).subscribe(
    (progress) => {
      this.progresoSubida.set(progress);
      if (progress === 100) {
        alert("Archivo subido correctamente.");
      }
    },
    (error) => {
      alert("Error al subir el archivo.");
    }
  );
}



}

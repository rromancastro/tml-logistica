import { Component, inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, signal, output } from '@angular/core';
import { PexelsService } from '../../../services/pexels.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pexels-video-gallery',
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatPaginatorModule,
    MatCheckboxModule,
    CommonModule
  ],
  templateUrl: './pexels-video-gallery.component.html',
  styleUrl: './pexels-video-gallery.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PexelsVideoGalleryComponent {

  emitoUrl = output<{ video: any }>();
  photos: any = [];
  
  pexelsService = inject(PexelsService);
  _snackBar = inject(MatSnackBar);
  
  busqueda = new FormControl('');
  NumPaginaSiguiente = signal(1);
  total_results:number = 0; 
  page:number = 0;
  imagenesCheckeadas:string[]  = [];
  
  constructor(private ref: ChangeDetectorRef) {}

  openSnackBar(msj:string,btn:string) {
    this._snackBar.open(msj, btn);
  }

  sumar(video: string, isChecked: boolean) {
    if (isChecked) {
      if (!this.imagenesCheckeadas.includes(video)) {
        this.imagenesCheckeadas.push(video);
        //this.emitirFotos(this.imagenesCheckeadas);
        this.openSnackBar('Video seleccionado', 'Ok');
        
      }
    } else {
      this.imagenesCheckeadas = this.imagenesCheckeadas.filter(img => img !== video);
      //this.emitirFotos(this.imagenesCheckeadas);
      this.openSnackBar('Video descartado', 'Ok');
      
    }
  }

  ngOnInit(): void {
    
  }

  paginaSiguiente(){
    const buscar: any = this.busqueda?.value;
    this.NumPaginaSiguiente.update(value => value + 1);
    this.pexelsService.searchVideos(buscar, 15,this.NumPaginaSiguiente()).subscribe(response => {
      //console.log(response);
      this.total_results = response.total_results;
      this.ref.markForCheck();
      this.page = response.page;
      this.ref.markForCheck();
      this.photos = response.videos;
      this.ref.markForCheck();
    });
  }

  paginaAnterior(){
    const buscar: any = this.busqueda?.value;
    if(this.NumPaginaSiguiente()>1){
      this.NumPaginaSiguiente.update(value => value - 1);
      this.pexelsService.searchVideos(buscar, 15,this.NumPaginaSiguiente()).subscribe(response => {
        //console.log(response);
        this.total_results = response.total_results;
        this.ref.markForCheck();
        this.page = response.page;
        this.ref.markForCheck();
        this.photos = response.videos;
        this.ref.markForCheck();
      });
    }else{
      return;
    }
    
  }


  buscar(){
    const buscar: any = this.busqueda?.value;
    //console.log(buscar);
    this.pexelsService.searchVideos(buscar, 15,this.NumPaginaSiguiente()).subscribe(response => {
      //console.log(response);
      this.total_results = response.total_results;
      this.ref.markForCheck();
      this.page = response.page;
      this.ref.markForCheck();
      this.photos = response.videos;
      this.ref.markForCheck();
    });
  }


  onSubmit() {
    const formValue = { 'video': JSON.stringify(this.imagenesCheckeadas) };
    this.emitirVideos(formValue);
  }

  emitirVideos(video: any) {
    //console.log('🔹 Entre a emitir con:', imagenes);

    if (!video) {
      console.error('🚨 Error: imagenes es undefined o null');
      return;
    }

    this.emitoUrl.emit({ video }); // 🔥 Emite correctamente los datos
    this.ref.markForCheck();
  }

}

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

@Component({
  selector: 'app-pexels-gallery',
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatPaginatorModule,
    MatCheckboxModule
  ],
  templateUrl: './pexels-gallery.component.html',
  styleUrl: './pexels-gallery.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class PexelsGalleryComponent {
  
  emitoUrl = output<{ imagenes: any }>();
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

  sumar(imagen: string, isChecked: boolean) {
    if (isChecked) {
      if (!this.imagenesCheckeadas.includes(imagen)) {
        this.imagenesCheckeadas.push(imagen);
        //this.emitirFotos(this.imagenesCheckeadas);
        this.openSnackBar('Imagen seleccionada', 'Ok');
        
      }
    } else {
      this.imagenesCheckeadas = this.imagenesCheckeadas.filter(img => img !== imagen);
      //this.emitirFotos(this.imagenesCheckeadas);
      this.openSnackBar('Imagen descartada', 'Ok');
      
    }
  }

  ngOnInit(): void {
    
  }

  paginaSiguiente(){
    const buscar: any = this.busqueda?.value;
    this.NumPaginaSiguiente.update(value => value + 1);
    this.pexelsService.searchPhotos(buscar, 15,this.NumPaginaSiguiente()).subscribe(response => {
      console.log(response);
      this.total_results = response.total_results;
      this.ref.markForCheck();
      this.page = response.page;
      this.ref.markForCheck();
      this.photos = response.photos;
      this.ref.markForCheck();
    });
  }

  paginaAnterior(){
    const buscar: any = this.busqueda?.value;
    if(this.NumPaginaSiguiente()>1){
      this.NumPaginaSiguiente.update(value => value - 1);
      this.pexelsService.searchPhotos(buscar, 15,this.NumPaginaSiguiente()).subscribe(response => {
        console.log(response);
        this.total_results = response.total_results;
        this.ref.markForCheck();
        this.page = response.page;
        this.ref.markForCheck();
        this.photos = response.photos;
        this.ref.markForCheck();
      });
    }else{
      return;
    }
    
  }


  buscar(){
    const buscar: any = this.busqueda?.value;
    //console.log(buscar);
    this.pexelsService.searchPhotos(buscar, 15,this.NumPaginaSiguiente()).subscribe(response => {
      console.log(response);
      this.total_results = response.total_results;
      this.ref.markForCheck();
      this.page = response.page;
      this.ref.markForCheck();
      this.photos = response.photos;
      this.ref.markForCheck();
    });
  }


  onSubmit() {
    const formValue = { 'imagenes': JSON.stringify(this.imagenesCheckeadas) };
    this.emitirFotos(formValue);
  }

  emitirFotos(imagenes: any) {
    //console.log('🔹 Entre a emitir con:', imagenes);

    if (!imagenes) {
      console.error('🚨 Error: imagenes es undefined o null');
      return;
    }

    this.emitoUrl.emit({ imagenes }); // 🔥 Emite correctamente los datos
    this.ref.markForCheck();
  }

}

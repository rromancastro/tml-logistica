import { Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';


import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { AdminAService } from '../../../services/adminA.service';

import { MatCardModule } from '@angular/material/card';
import { CarouselService } from '../../../services/carousel.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
    selector: 'app-img-crop-new',
    standalone: true,
    imports: [
        CommonModule,
        ImageCropperComponent,
        RouterModule,
        MatSelectModule,
        MatFormFieldModule,
        FormsModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatTooltip,
        MatCardModule,
        MatProgressBarModule
    ],
    templateUrl: './img-crop-new.component.html',
    styleUrls: ['./img-crop-new.component.css'],
    host: { ngSkipHydration: 'true' }
    
})
export class ImgCropNewComponent implements OnInit{
  
  insertada = input<boolean>(false);
  seSubioLaImagen = output<void>(); 
  
  public imageChangedEvent: any = '';
  public croppedImage: any = '';
  public croppedImageBlob : any = '';
  public radioAspect:number = 19/16;
  public calidad:number = 100;
  public crop:string = "nueva";
  public idTabla:any = "";
  public tabla:any = "";
  public ImgCargada:any[] = [];
  public width: number = 0;
  public heigth: number = 0;

  public mostrarUpload = signal<boolean>(false);
  public mostrarGuardar = signal<boolean>(false);
  public mostrarEditar = signal<boolean>(false);
  private _snackBar = inject(MatSnackBar);
  private carouselServ = inject(CarouselService);


  public directorioImg = this.carouselServ.carpeta;
  public progresoCarga = signal<number>(0); // % de imagen cargada

 
  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private service: AdminAService,
    
    private http: HttpClient,
    private location: Location
  ) {
    effect(() => {
      console.log(this.insertada());
      if (this.insertada()) {
        this.crop = 'nueva';
        this.mostrarUpload.set(true);
        this.mostrarGuardar.set(false);
        this.mostrarEditar.set(false);
      }
    });
  }


  public aspectRatio:any[] = [
    {
      "aspect":1 / 1, "value":"1/1"
    },
    {
      "aspect":3 / 2, "value":"3/2"
    },
    {
      "aspect":4 / 3, "value":"4/3"
    },
    {
      "aspect":5 / 4, "value":"5/4"
    },
    {
      "aspect":14 / 19, "value":"14/19"
    },
    { 
      "aspect":16 / 9, "value":"16/9"
    },
    { 
      "aspect":21 / 9, "value":"21/9" 
    },
    { 
      "aspect":16 / 10, "value":"16/10"
    },
    {
      "aspect":16 / 19, "value":"16/19"
    },
    {
      "aspect":9 / 16, "value":"9/16"
    },
    {
      "aspect":10 / 16, "value":"10/16"
    },
    {
      "aspect":2 / 1, "value":"2/1"
    }
  ];

  setRatio(e:any){
    //console.log(e);
    this.radioAspect = e;
    //console.log(this.radioAspect)
  }
  setCalidad(e:any){
    this.calidad = e.target.value;
  }

  fileChangeEvent(event: any): void {
      this.imageChangedEvent = event;
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();

      // Captura el progreso de carga de la imagen
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const porcentaje = Math.round((event.loaded / event.total) * 100);
          this.progresoCarga.set(porcentaje);
        }
      };

      reader.onload = () => {
        this.imageChangedEvent = event;
        this.progresoCarga.set(100); // Cuando se completa la lectura
      };

    reader.readAsDataURL(file);
  }
  

  imageCropped(event: ImageCroppedEvent) {
    //console.log(event);
    if (event.objectUrl) {
      
      this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
  
      // Fetch the image data from the objectUrl
      this.http.get(event.objectUrl, { responseType: 'blob' }).subscribe((blob: Blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          // The result of the FileReader contains the base64-encoded image data
          this.croppedImageBlob = reader.result as string;
          //console.log(this.croppedImageBlob);
        };
        reader.readAsDataURL(blob);
      });
    }
    // event.blob can be used to upload the cropped image
  }


  imageLoaded(image: LoadedImage) {
    //console.log("imageLoad",image);
    if(this.crop === 'nueva'){
      this.mostrarUpload.set(false); 
      this.mostrarGuardar.set(true); 
      this.mostrarEditar.set(false); 
    }else{
      this.mostrarEditar.set(true); 
      this.mostrarGuardar.set(false); 
      this.mostrarUpload.set(false); 
    }
  }
  cropperReady() {    
  }

  loadImageFailed() {
      // show message
  }

  guardarImg(){
    this.openSnackBar("Guardando...","Ok");
    //console.log(this.cargoImg);
    if(this.crop==='crop'){
     // console.log("ya tiene foto");
      this.service.GuardarImg(this.tabla,this.idTabla,this.croppedImageBlob,this.radioAspect)
      .subscribe(d=>{
        if(d == 1){
          this.openSnackBar("Hemos tenido un error tratando de editar su imagen","Ok");
        }else{
          this.openSnackBar("Su imagen ha sido actualizada correctamente","Ok");
          this.goBack();
        }
        
      })
    }
    if(this.crop==='nueva'){
     // console.log("entre a nuevo");
      this.service.GuardarImgEnCarousel(this.idTabla,this.croppedImageBlob,this.radioAspect)
      .subscribe(d=>{
        //console.log(d);
        this.openSnackBar("Su imagen ha sido ingresada correctamente","Ok");
        this.goBack();
      })
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action,{
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 4000,
    });
  }

  goBack() {
    if(this.insertada()){
      this.seSubioLaImagen.emit();
    }else{
      this.location.back();
    }
  }

  reemplazarFoto(){
    this.mostrarUpload.set(true); 
    //console.log(this.mostrarUpload());
  }
  
  eliminarFoto(){
    this.mostrarUpload.set(false); 
  }

  ngOnInit(){
    if (!this.insertada()) {
      this.route.params.subscribe( (params) => {
      //console.log(params);
      this.idTabla = params['expId'];
      this.tabla = params['tablaId'];
      this.crop = params['idNueva'];
        if(this.crop === 'crop'){
          this.service.traerImgPorIdObs(this.idTabla,this.tabla).subscribe(img=>{
            if(img.length !== 0){
            // console.log(img);
              this.ImgCargada[0] = img;
            // console.log(this.ImgCargada[0]?.src);
              this.mostrarUpload.set(false);
              this.mostrarGuardar.set(false);
              this.mostrarEditar.set(true);
            // console.log(this.ImgCargada[0].src);
              this.imageLoaded(this.ImgCargada[0]);
            }
          })
        }

        if(this.crop === 'nueva'){
          this.mostrarUpload.set(true);
          this.mostrarGuardar.set(false);
          this.mostrarEditar.set(false);
        }
      });
    }
  }
  
}

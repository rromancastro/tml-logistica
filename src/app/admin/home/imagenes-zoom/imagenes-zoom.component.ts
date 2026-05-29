import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { AdminAService } from '../../../services/adminA.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CarouselService } from '../../../services/carousel.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MenuService } from '../../../services/menu.service';
import { FormControl,FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-imagenes-zoom',
  imports: [
    NgOptimizedImage,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './imagenes-zoom.component.html',
  styleUrl: './imagenes-zoom.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ImagenesZoomComponent {
  
  
  private admservice = inject(AdminAService);
  private ref = inject(ChangeDetectorRef);
  private carouselServ = inject(CarouselService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer); // Inyectamos el sanitizer
  public menuservice = inject(MenuService);

  public defaultImage = this.carouselServ.carpeta+'/assets/img/upload/02-45-27-186_512.webp';
  public img  = signal<SafeUrl>('');
  public imgId:string ='0';
  public aspect:number = 1;
  public noexiste:boolean = false;

  public imgForm = new FormGroup({
    alt: new FormControl(''),
    title: new FormControl(''),
  });

  constructor() {
    this.route.params.subscribe(params => {
      this.imgId = params['imgId'] || '0';
      this.traerImagen();
    });
  }

  traerImagen() {
    if (this.imgId === '0') return;

    this.admservice.traerIdDelUnaTabla('img', this.imgId, 'DESC', 'id')
      .subscribe((d: any) => {
        //console.log(d);
        if (d.length !== 0 && d[0].src) {
          this.aspect = d[0].aspect;
          this.noexiste = false;
          const imageUrl = this.carouselServ.carpeta + d[0].src;
          this.img.set(this.sanitizer.bypassSecurityTrustUrl(imageUrl)); // 🔹 Sanitiza la URL
          
            this.imgForm.patchValue({
              alt: d[0].alt || '',
              title: d[0].title || ''
            });
          
        } else {
          this.img.set(this.sanitizer.bypassSecurityTrustUrl(this.carouselServ.carpeta+'/assets/img/upload/02-45-27-186_512.webp'));
          this.noexiste = true;
          this.ref.markForCheck();
        }
        
      });
  }

  navigateToImage(change: number) {
    const newId = Number(this.imgId) + Number(change);
    if (Number(newId) >= 1) { // Evita números negativos
      this.router.navigate(['/admin/img', 'zoom', newId]);
    }
  }

  guardarImagen() {
    this.admservice.edit('img', this.imgForm.value, this.imgId, 'id').subscribe(respuesta => {
      //console.log(respuesta);
      if (respuesta === 0) {
        this.carouselServ.openSnackBar("SE HA EDITADO CORRECTAMENTE", "Ok");
      } else {
        this.carouselServ.openSnackBar("Estamos teniendo un problema, intente más tarde...", "Ok");
      }
    });
  }
}


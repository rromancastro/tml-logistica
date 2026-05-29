import { CommonModule, Location } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuillEditorComponent, QuillModule } from 'ngx-quill';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AdminAService } from '../../../services/adminA.service';
import { TitleToUrlServiceService } from '../../../services/title-to-url-service.service';
import { ImagenesSeleccionarComponent } from '../imagenes-seleccionar/imagenes-seleccionar.component';

interface NoticiaFormValue {
  titulo: string;
  fecha: string;
  actualizado: string;
  descripcion: string;
  imagen: string;
  imagenMini: string;
  link: string;
  url: string;
}

@Component({
  selector: 'app-editar-blog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    QuillModule,
    QuillEditorComponent,
    ImagenesSeleccionarComponent,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './editar-blog.component.html',
  styleUrl: './editar-blog.component.css',
})
export class EditarBlogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly adminService = inject(AdminAService);
  private readonly titleToUrl = inject(TitleToUrlServiceService);
  private readonly location = inject(Location);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  readonly idBase = signal('0');
  readonly subirOpcionesImagenes = signal(false);
  readonly campoImagenActivo = signal<'imagen' | 'imagenMini'>('imagen');

  public EditFormGroup: FormGroup = this.fb.group({
    titulo: [''],
    fecha: [''],
    actualizado: [''],
    descripcion: [''],
    imagen: [''],
    imagenMini: [''],
    link: [''],
    url: [''],
  });

  // Bloque anterior: el componente manejaba campos de blog como categoria, autor, subtitulo, resumen y bloques.
  // Ahora el formulario queda alineado a la tabla noticias.
  // this.EditFormGroup = this.fb.group({
  //   bloques: this.fb.array([]),
  //   titulo: [''],
  //   subtitulo: [''],
  //   categoria: [''],
  //   mostrar: ['si'],
  //   url: [''],
  //   fecha: [''],
  //   sub_region: [[]],
  //   region: [''],
  //   resumen: [''],
  //   img: [''],
  //   autor: [''],
  // });

  goBack(): void {
    this.location.back();
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 4000,
    });
  }

  private decodeHtml(value: string): string {
    if (!value) {
      return '';
    }

    const textarea = document.createElement('textarea');
    textarea.innerHTML = value;
    return textarea.value;
  }

  abrirImagenes(event: Event, campo: 'imagen' | 'imagenMini'): void {
    event.preventDefault();
    this.campoImagenActivo.set(campo);
    this.subirOpcionesImagenes.set(true);
  }

  cerrarModal(): void {
    this.subirOpcionesImagenes.set(false);
  }

  recibirImagenes(event: { imagenes: unknown }): void {
    if (!event?.imagenes) {
      return;
    }

    const urls = this.normalizarImagenes(event.imagenes);
    const imagenSeleccionada = urls[0] ?? '';

    if (!imagenSeleccionada) {
      return;
    }

    this.EditFormGroup.get(this.campoImagenActivo())?.setValue(imagenSeleccionada);
    this.subirOpcionesImagenes.set(false);
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const datoId = params['datoId'];
      this.idBase.set(datoId === 'nuevo' || !datoId ? '0' : String(datoId));

      if (this.idBase() === '0') {
        this.EditFormGroup.reset({
          titulo: '',
          fecha: '',
          actualizado: '',
          descripcion: '',
          imagen: '',
          imagenMini: '',
          link: '',
          url: '',
        });
        return;
      }

      this.adminService
        .traerIdDelUnaTabla('noticias', this.idBase(), 'ASC', 'id')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((d: any[]) => {
          const data = d?.[0];
          if (!data) {
            return;
          }

          this.EditFormGroup.patchValue({
            titulo: data.titulo ?? '',
            fecha: data.fecha ?? '',
            actualizado: data.actualizado ?? '',
            descripcion: this.decodeHtml(data.descripcion ?? ''),
            imagen: data.imagen ?? '',
            imagenMini: data.imagenMini ?? '',
            link: data.link ?? '',
            url: data.url ?? '',
          });
        });
    });
  }

  onSubmit(form: FormGroup): void {
    const raw = form.getRawValue() as Partial<NoticiaFormValue>;
    const payload: NoticiaFormValue = {
      titulo: String(raw.titulo ?? '').trim(),
      fecha: String(raw.fecha ?? '').trim(),
      actualizado: String(raw.actualizado ?? '').trim(),
      descripcion: String(raw.descripcion ?? '').trim(),
      imagen: String(raw.imagen ?? '').trim(),
      imagenMini: String(raw.imagenMini ?? '').trim(),
      link: String(raw.link ?? '').trim(),
      url: String(raw.url ?? '').trim() || this.titleToUrl.generarSlug(String(raw.titulo ?? '')),
    };

    // Bloque anterior: el alta/edicion serializaba texto en bloques y enviaba campos de blog.
    // Ahora solo se envian las columnas reales de la tabla noticias.
    // const dataToSend = {
    //   texto: formValue.texto,
    //   img: formValue.img,
    //   titulo: formValue.titulo,
    //   subtitulo: formValue.subtitulo,
    //   url: this.txtservice.generarSlug(formValue.titulo),
    //   fecha: formValue.fecha,
    //   resumen: formValue.resumen,
    //   mostrar: formValue.mostrar,
    //   categoria: formValue.categoria,
    //   region: formValue.region,
    //   sub_region: formValue.sub_region,
    //   autor: formValue.autor,
    // };

    if (this.idBase() === '0') {
      this.adminService.insertBlog('noticias', payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((respuesta) => {
        const res = respuesta as { error?: string };
        if (res?.error === '0') {
          this.openSnackBar('Hecho. La noticia fue ingresada correctamente.', 'Ok');
          this.goBack();
        } else {
          this.openSnackBar('Problema al insertar la noticia.', 'Ok');
        }
      });
      return;
    }

    this.adminService.editBlog('noticias', payload, this.idBase(), 'id').pipe(takeUntilDestroyed(this.destroyRef)).subscribe((respuesta) => {
      if (respuesta === 0) {
        this.openSnackBar('La noticia fue editada correctamente.', 'Ok');
        this.goBack();
      } else {
        this.openSnackBar('Problema al editar la noticia.', 'Ok');
      }
    });
  }

  private normalizarImagenes(value: unknown): string[] {
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === 'string');
    }

    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed.filter((item): item is string => typeof item === 'string');
        }
        return [];
      } catch {
        return value ? [value] : [];
      }
    }

    if (value && typeof value === 'object' && 'imagenes' in value) {
      const nested = (value as { imagenes?: unknown }).imagenes;
      return this.normalizarImagenes(nested);
    }

    return [];
  }
}

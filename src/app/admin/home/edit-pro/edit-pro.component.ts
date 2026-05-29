import { ChangeDetectorRef, Component,inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, delay, map, Observable, of, retryWhen, startWith, switchMap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { FormatLabelPipe } from '../../../pipes/format-label.pipe';
import { MatExpansionModule } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AdminAService } from '../../../services/adminA.service';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { QuillEditorComponent, QuillModule } from 'ngx-quill';
import { MatIconModule } from '@angular/material/icon';
import { ImagenesSeleccionarComponent } from "../imagenes-seleccionar/imagenes-seleccionar.component";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CarouselService } from '../../../services/carousel.service';
import { VideosSeleccionarComponent } from '../videos-seleccionar/videos-seleccionar.component';
import { ArchivosSeleccionarComponent } from '../archivos-seleccionar/archivos-seleccionar.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

interface Respuesta {
  error: string; // Asegúrate de que esto es string
  last_id: number;
}

@Component({
    selector: 'app-edit-pro',
    standalone: true,
    imports: [
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    CommonModule,
    FormatLabelPipe,
    MatCheckboxModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    QuillModule,
    QuillEditorComponent,
    MatIconModule,
    ImagenesSeleccionarComponent,
    VideosSeleccionarComponent,
    MatAutocompleteModule,
    ArchivosSeleccionarComponent
    
],
    providers: [provideNativeDateAdapter()],  
    templateUrl: './edit-pro.component.html',
    styleUrl: './edit-pro.component.css',
    host: { ngSkipHydration: 'true' }
})
export class EditProComponent {

  public arrayEdits:any = [];
  public datosDelaTabla:any = [];
  public empezarFormulario = signal(false);
  
  public idBase = signal('');
  public tabla = signal('');
  
  public EditFormGroup: FormGroup;
  public dynamicProperties: Record<string, BehaviorSubject<any>> = {};
  private adminService = inject(AdminAService);  
  public carouselServ = inject(CarouselService);
  public textoBoton:string = 'Editar';
  public originalData: any;

  public subirOpcionesImagenes: boolean = false;
  public subirOpcionesVideos: boolean = false;
  public subirOpcionesArchivos: boolean = false;

  public arrayDeImagenesRecibidas :string[] = [];

  imagenSanitizada: SafeUrl | null = null;
  public nombreDelaTabla:string = "";
  filteredOptions: { [key: string]: Observable<{ id: number; nombre: string; apellido: string }[]> } = {};
  options: { [key: string]: { id: number; nombre: string; apellido: string }[] } = {};


  
  constructor(
    private _snackBar:MatSnackBar,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
    public sanitizer: DomSanitizer
  ) {
    this.EditFormGroup = this.fb.group({});
    
   }
  
  abrirModal() {
    this.subirOpcionesImagenes = true;
  }
  
  cerrarModal() {
    this.subirOpcionesImagenes = false;
  }

  abrirModalVideo() {
    this.subirOpcionesVideos = true;
  }
  
  cerrarModalVideo() {
    this.subirOpcionesVideos = false;
  }

  abrirModalArchivos() {
    this.subirOpcionesArchivos = true;
    
  }
  
  cerrarModalArchivos() {
    this.subirOpcionesArchivos = false;
  }
  
  private _filter(value: string, key: string): { id: number; nombre: string; apellido: string }[] {
    const filterValue = value.toLowerCase();

    return this.options[key]
        ?.filter(option => 
            option.nombre.toLowerCase().includes(filterValue) || 
            option.apellido.toLowerCase().includes(filterValue)
        ) || [];
  }



  /*
  POR SI NO SE VE QUILL EL FORMATO HTML EDITADO
  replaceNbsp(text: string): string {
    return text.replace(/&nbsp;/g, ' '); // Reemplaza todas las ocurrencias de &nbsp; por un espacio
  }
  public formattedText: string = '';
  public texto = signal<string>('');

  this.formattedText = this.replaceNbsp(d[0].texto);
  this.texto.set(this.formattedText);
  */

  setImagen(url: string) {
    this.imagenSanitizada = this.carouselServ.sanitizeUrl(url);
  }

  borrarImagen(event: Event) {
    event.preventDefault(); // Previene el submit del formulario
    this.EditFormGroup.get('img')?.setValue('');
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action,{
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 4000,
    });
  }

  goBack() {
    this.location.back();
  }

  recibirImagenes(event: { imagenes: any }) {
    console.log(event.imagenes);
    if (!event || !event.imagenes) {
      console.error('🚨 Error: No llegaron imágenes o el evento es undefined');
      this.cdRef.markForCheck();
      return;
    }
    //console.log('✅ Imágenes recibidas en EDIT PRO:', event.imagenes);
    this.arrayDeImagenesRecibidas = JSON.parse(event.imagenes.imagenes);
    this.EditFormGroup.get('img')?.setValue(this.arrayDeImagenesRecibidas);
    //console.log(this.EditFormGroup);
    this.cdRef.markForCheck();
    this.subirOpcionesImagenes = false;
    this.subirOpcionesVideos = false;
  }

  recibirVideos(event: { video: any }) {
    //console.log(event.video);
    if (!event || !event.video) {
      //console.error('🚨 Error: No llegaron videos o el evento es undefined');
      this.cdRef.markForCheck();
      return;
    }
    //console.log('✅ Imágenes recibidas en EDIT PRO:', event.imagenes);
    this.arrayDeImagenesRecibidas = JSON.parse(event.video.video);
    this.EditFormGroup.get('video')?.setValue(this.arrayDeImagenesRecibidas);
    //console.log(this.EditFormGroup);
    this.cdRef.markForCheck();
    this.subirOpcionesImagenes = false;
    this.subirOpcionesVideos = false;
  }

  recibirArchivos(event: { folder: any }) {
    //console.log(event.folder);
    if (!event || !event.folder) {
      console.error('🚨 Error: No llegaron videos o el evento es undefined');
      this.cdRef.markForCheck();
      return;
    }
  
    
    //console.log(event.folder.folder);
    this.arrayDeImagenesRecibidas = JSON.parse(event.folder.folder);
    
    
    this.EditFormGroup.get(this.nombreDelaTabla)?.setValue(this.arrayDeImagenesRecibidas);
    //console.log(this.EditFormGroup);
    this.cdRef.markForCheck();
    this.subirOpcionesImagenes = false;
    this.subirOpcionesArchivos = false;
    this.subirOpcionesVideos = false;
  }
  


  abrirImagenes(event: Event){
    //console.log('abrirImagenes',"Botón presionado sin hacer submit");
    event.preventDefault(); // Previene el submit del formulario
    this.subirOpcionesImagenes = !this.subirOpcionesImagenes;
    //console.log(this.subirOpcionesImagenes);
  }
  
  abrirVideos(event: Event){
    //console.log('abrirVideos',"Botón presionado sin hacer submit");
    event.preventDefault(); // Previene el submit del formulario
    this.subirOpcionesVideos = !this.subirOpcionesVideos;
    //console.log(this.subirOpcionesImagenes);
    
  }

  abrirArchivos(event: Event, nombre:string){
    event.preventDefault(); // Previene el submit del formulario
    this.subirOpcionesArchivos = !this.subirOpcionesArchivos;
    this.nombreDelaTabla = nombre;
  }

  onSubmit(formulario: FormGroup) {
    
    //console.log(formulario);
    const formValue = { ...formulario.getRawValue() };
    Object.keys(formValue).forEach(key => {
      if (Array.isArray(formValue[key])) {
        // Convertir arrays a texto (separado por comas, por ejemplo)
        formValue[key] = formValue[key].join(', ');
      }
      if (key.startsWith('check')) {
        delete formValue[key];
      }
    });
    if(this.idBase()=== '0'){
      
      this.adminService.insertArray(this.tabla(),formValue).subscribe(respuesta=>{
        const res = respuesta as Respuesta; // Afirmar que respuesta es del tipo Respuesta
       if(res.error === '0'){
         this.openSnackBar("Hemos ingresado los datos con éxito","Ok");
         this.goBack();
       }else{
        //console.log(respuesta);
         this.openSnackBar("Estamos teniendo un problema:"+respuesta,"Ok");
       }
     });
    }else{
      this.adminService.edit(this.tabla(), formValue, this.idBase(), 'id').subscribe(respuesta => {
        console.log('respuesta', respuesta);
        if (respuesta === 0) {
          this.openSnackBar("SE HA EDITADO CORRECTAMENTE", "Ok");
          this.goBack();
        } else {
          this.openSnackBar("Estamos teniendo un problema, intente más tarde...", "Ok");
          
        }
      });
    }
    
  }

  runCheck(name: string) {
  // Busca el objeto donde n es 'condicion'
    const editItem = this.arrayEdits.find((item: { n: string; }) => item.n === name);
    if (editItem) {
      editItem.t = 'check'; // Cambia el valor de t a 'check'
    }
    //console.log(this.arrayEdits);
    this.adminService.traerIdDelUnaTabla(this.tabla(), this.idBase(), 'ASC', 'nombre').subscribe(data => {
      if (data) {
        //console.log(data);
        this.armarFormulario(data, this.arrayEdits);
        this.cdRef.markForCheck();
      }
    });
  }
  
  resetForm() {
    if (!this.originalData) {
        console.warn("No hay datos originales para restaurar.");
        return;
    }

    // Reinicia el FormGroup
    this.EditFormGroup.reset();

    // Asigna los valores originales a los controles del formulario
    Object.keys(this.originalData).forEach(key => {
        const control = this.EditFormGroup.get(key);
        if (control) {
            control.setValue(this.originalData[key]);
        }
    });

    // Si tienes un FormArray para 'check', restablece también sus valores
    const formArray = this.EditFormGroup.get('check') as FormArray;
    if (formArray) {
        const checkValues = this.originalData.check || []; // Asegúrate de que este array esté presente
        formArray.controls.forEach((control, index) => {
            control.setValue(checkValues[index] || false);
        });
    }

    this.cdRef.markForCheck(); // Asegúrate de que la vista se actualice
}

  formatMenuInput(input: string | string[]): string {
    // Si el input es un string, lo convertimos en un array separando por comas y eliminando corchetes
    let arr: string[];
  
    if (typeof input === 'string') {
        // Eliminamos los corchetes al principio y al final
        arr = input.replace(/^\[|\]$/g, '').split('], [');
    } else {
        arr = input;
    }
  
    // Eliminar los corchetes en cada elemento individual
    arr = arr.map(item => item.replace(/^\[/, '').replace(/\]$/, ''));

    // Unir todos los elementos con ", " y agregar corchetes alrededor
    return '[' + arr.join(', ') + ']';  
  }

  getNombrePorId(key: string, id: number): string {
    const selectedOption = this.options[key]?.find(option => option.id === id);
    return selectedOption ? `${selectedOption.nombre} ${selectedOption.apellido}` : '';
  }

  armarFormulario(datosPersonales: any, array: any) {
    if (!datosPersonales || datosPersonales.length === 0) {
        console.warn("Datos personales no disponibles aún.");
        return;
    } 
    
    if (!this.EditFormGroup) {
        this.EditFormGroup = new FormGroup({});
    }

    array.forEach((obj: { n: string, t: string, b: string, d?: string,v?: string }) => {
        const controlName = obj.n;
        const valorPorDefecto = datosPersonales[0][controlName] || ''; // Usa valor por defecto si no existe en la base de datos
            
        if (obj.t === 'autocomplete') {
          const control = new FormControl(valorPorDefecto);
          this.EditFormGroup.addControl(controlName, control);

          // Inicializar filteredOptions con un observable vacío si aún no existe
          this.filteredOptions[controlName] = control.valueChanges.pipe(
              startWith(''),
              map(value => this._filter(value || '', controlName))
          );

          // Obtener opciones desde la API y guardar ID, nombre y apellido
          this.adminService.traerIdDelUnaTabla(obj.b, '0', 'ASC', 'nombre').subscribe(data => {
              this.options[controlName] = data.map((item: any) => ({
                  id: item.id, 
                  nombre: item.nombre, 
                  apellido: item.apellido
              }));
          });
        }else if (obj.t === 'selectM') {
              // Primero, se hace el split del valor por defecto y se recorta cualquier espacio innecesario
              const defaultValuesArray = valorPorDefecto 
                  ? valorPorDefecto.split('], [').map((val: string) => val.trim()) 
                  : [];
          
              // Llamamos a la función formatMenuInput para agregar los corchetes
              const formattedValues = defaultValuesArray.map((val: any) => this.formatMenuInput(val));
          
              //console.log(formattedValues);  // Ver los valores formateados
          
              const control = new FormControl(formattedValues, Validators.required);
              this.EditFormGroup.addControl(controlName, control);
              this.originalData = { ...datosPersonales[0] };
          }
        
        // Lógica para 'check' (a completar según necesidades)
        else if (obj.t === 'check') {
          
            const propertyName = `${obj.n}$`;
            this.dynamicProperties[propertyName] = new BehaviorSubject<any[]>([]);
          
            this.adminService.traerIdDelUnaTabla(obj.b, '0', 'ASC', 'nombre').subscribe(data => {
              //console.log(data);
              this.dynamicProperties[propertyName].next(data);
              
          
              // Obtener los valores predeterminados desde this.data.datosFormulario
              const valoresPorDefectoArray = datosPersonales[0][obj.n]
                ? datosPersonales[0][obj.n].split(',').map((val: string) => val.trim())
                : [];
          
              // Crear el FormArray para los checkboxes
              const formArray = this.fb.array(
                data.map((item: any) => {
                  // Verificar si el nombre está en los valores predeterminados
                  const isChecked = valoresPorDefectoArray.includes(item.nombre);
                  return new FormControl(isChecked);
                })
              );
          
              // Asegúrate de que 'check' sea el nombre correcto del FormArray en el FormGroup
              this.EditFormGroup.setControl('check', formArray);
          
              // Crear un control para almacenar los nombres seleccionados como texto
              const control = new FormControl('');
              this.EditFormGroup.setControl(obj.n, control);
          
              // Escuchar cambios en el FormArray
              formArray.valueChanges.subscribe(values => {
                // Filtrar valores `null` y asegurarse de que sean booleanos
                const booleanValues = values.filter((value): value is boolean => value !== null);
                // Actualizar el campo con los nombres seleccionados
                this.updateTipoDeTerapiaField(booleanValues, data, obj.n);
              });
          
              this.cdRef.markForCheck();
            });
          
        }
        // Lógica para 'acordeon' (a completar según necesidades)
        else if (obj.t === 'acordeon') {
            // Aquí puedes implementar la lógica para acordeones si es necesario
        }
        // Lógica para otros tipos de control
        else {
            if (!this.EditFormGroup.contains(controlName)) {
                const control = valorPorDefecto !== '' 
                    ? new FormControl(valorPorDefecto) 
                    : new FormControl(valorPorDefecto); // Crear control aunque el valor sea vacío
                this.EditFormGroup.addControl(controlName, control);
            }
        }
    });
    //console.log(this.EditFormGroup);
    this.empezarFormulario.set(true);
}

updateTipoDeTerapiaField(values: boolean[], properties: any[], name:string): void {
  // Filtra los nombres de los items seleccionados
  const selectedNames = properties
    .map((prop: any, index: number) => values[index] ? prop.nombre : null)
    .filter(name => name !== null);

  // Convierte el array a una cadena separada por comas
  const tipoDeTerapiaText = selectedNames.join(', ');

  // Obtén el FormControl y establece el valor
  const control = this.EditFormGroup.get(name);
  if (control) {
    control.setValue(tipoDeTerapiaText);
  }
}

armarFormularioSinValores(array: any) {
  if (!this.EditFormGroup) {
      this.EditFormGroup = new FormGroup({});
  }

  array.forEach((obj: { n: string, t: string, b: string, d?: string, v?: string }) => {
      const controlName = obj.n;

      if (!this.EditFormGroup.contains(controlName)) {
          let control: FormControl;

          // 🚀 Si el tipo es autocomplete, inicializamos correctamente
          if (obj.t === 'autocomplete') {
              control = new FormControl(null);
              this.filteredOptions[controlName] = control.valueChanges.pipe(
                  startWith(''),
                  map(value => this._filter(value || '', controlName))
              );

              // Obtener opciones desde la API
              this.adminService.traerIdDelUnaTabla(obj.b, '0', 'ASC', 'nombre').subscribe(data => {
                  this.options[controlName] = data.map((item: any) => ({
                      id: item.id, 
                      nombre: item.nombre, 
                      apellido: item.apellido
                  }));
              });
          } else {
              control = new FormControl(null); // 👈 Asigna un valor inicial nulo a los demás tipos de input
          }

          this.EditFormGroup.addControl(controlName, control);
      }
  });

  this.empezarFormulario.set(true);
}


    cambiartextoBoton(base:string){
      if (base === '0') {
        this.textoBoton = 'Guardar';
      } else {
        this.textoBoton = 'Guardar';
      }
    }
  
   

    ngOnInit() {
      this.route.params.subscribe(data => {
        this.tabla.set(data['tabla']);
        this.idBase.set(data['datoId']);
        console.log(this.tabla(), this.idBase());
    
        // Establecer el texto del botón según el valor de idBase
        if (this.idBase() === '0') {
          this.textoBoton = 'Guardar';
        } else {
          this.textoBoton = 'Editar';
        }
    
        // Hacemos la llamada directa a adminService para obtener la tabla
        const nombreTabla = 'configuracion_bases';
        const datos = [{'nombre': this.tabla()}];
    
        this.adminService.busquedaPorTabla(nombreTabla, datos).pipe(
          map(d => {
            // Procesa los datos eliminando las propiedades
            d.forEach((item: any) => {
              delete item.nombre;
              delete item.id;
            });
            return d;
          }),
          // Si el array está vacío, esperamos 2 segundos y reintentamos hasta 5 veces
          retryWhen(errors => errors.pipe(
            // Intentar 5 veces con 2 segundos de espera entre intentos
            delay(2000),
            switchMap((error, index) => index >= 5 ? of(error) : of(true)) // Detener después de 5 intentos
          ))
        ).subscribe(array => {
          if (array && array.length > 0) {  // Verificamos que el array no esté vacío
            this.arrayEdits = array;
            //console.log(this.arrayEdits);
            // Procesamos cada elemento de arrayEdits
            this.arrayEdits?.forEach((obj: { n: string, t: string, b: string, v: string}) => {
              if ((obj.t === 'select') || (obj.t === 'selectM')) {
                const propertyName = `${obj.n}$`;
                this.dynamicProperties[propertyName] = new BehaviorSubject<any[]>([]);
    
                this.adminService.traerIdDelUnaTabla(obj.b, '0', 'ASC', 'id').subscribe(data => {
                  this.dynamicProperties[propertyName].next(data);
                  this.cdRef.markForCheck();
                });
              }
            });
    
            // Si el idBase no es '0', obtenemos los datos correspondientes a la tabla e idBase
            if (this.idBase() !== '0') {
              this.adminService.traerIdDelUnaTabla(this.tabla(), this.idBase(), 'ASC', 'id').subscribe(data => {
                if (data) {
                  //console.log(data);
                  this.armarFormulario(data, this.arrayEdits);
                  this.cdRef.markForCheck();
                }
              });
            } else {
              // Si idBase es '0', inicializamos el formulario sin valores
              //console.log('el id es 0');
              this.armarFormularioSinValores(this.arrayEdits);
            }
          } else {
            console.log("No hay datos disponibles, intentando nuevamente...");
          }
        });
      });
    }

  }



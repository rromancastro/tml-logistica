import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { EmailService } from '../../services/email.service';
import { Email } from '../../services/email';

@Component({
  selector: 'app-inicio-formulario',
  imports: [ReactiveFormsModule],
  templateUrl: './inicio-formulario.html',
  styleUrl: './inicio-formulario.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InicioFormulario {
  // Bloque anterior: el componente no manejaba estado ni submit.
  // export class InicioFormulario {}

  private readonly fb = inject(FormBuilder);
  private readonly emailService = inject(EmailService);

  readonly enviando = signal(false);
  readonly enviado = signal(false);
  readonly error = signal<string | null>(null);

  readonly contactoForm = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    telefono: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
    email: ['', [Validators.required, Validators.email]],
    consulta: [''],
  });

  enviarFormulario(): void {
    if (this.contactoForm.invalid || this.enviando()) {
      this.contactoForm.markAllAsTouched();
      return;
    }

    const { nombre, telefono, email, consulta } = this.contactoForm.getRawValue();

    const payload: Email = {
      // Bloque anterior: solo se enviaban nombre, celular, email y mensaje.
      // nombre,
      // celular: telefono,
      // email,
      // mensaje: consulta,
      nombre,
      apellido: '',
      celular: telefono,
      email,
      mensaje: consulta,
      seccion: 'Formulario de contacto',
    };

    this.enviando.set(true);
    this.enviado.set(false);
    this.error.set(null);

    this.emailService
      .mandarEmail(payload)
      .pipe(finalize(() => this.enviando.set(false)))
      .subscribe({
        next: () => {
          this.enviado.set(true);
          this.contactoForm.reset({
            nombre: '',
            telefono: '',
            email: '',
            consulta: '',
          });
        },
        error: () => {
          this.error.set('No se pudo enviar el formulario. Intenta nuevamente.');
        },
      });
  }
}

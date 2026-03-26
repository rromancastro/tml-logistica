import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';
import { ServiciosHeader } from './servicios-header/servicios-header';
import { ServiciosTipos } from './servicios-tipos/servicios-tipos';
import { ServiciosTrazabilidad } from './servicios-trazabilidad/servicios-trazabilidad';
import { InicioClientes } from '../inicio/inicio-clientes/inicio-clientes';
import { InicioFormulario } from '../inicio/inicio-formulario/inicio-formulario';

@Component({
  selector: 'app-servicios',
  imports: [
    Navbar,
    Footer,
    ServiciosHeader,
    ServiciosTipos,
    ServiciosTrazabilidad,
    InicioClientes,
    InicioFormulario
  ],
  templateUrl: './servicios.html',
  styleUrl: './servicios.scss',
})
export class Servicios {}

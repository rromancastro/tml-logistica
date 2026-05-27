import { Component } from '@angular/core';
import { InicioHeader } from './inicio-header/inicio-header';
import { InicioServicios } from './inicio-servicios/inicio-servicios';
import { InicioBeneficios } from './inicio-beneficios/inicio-beneficios';
import { InicioPlataformas } from './inicio-plataformas/inicio-plataformas';
import { InicioClientes } from './inicio-clientes/inicio-clientes';
import { InicioTestimonios } from './inicio-testimonios/inicio-testimonios';
import { InicioFormulario } from './inicio-formulario/inicio-formulario';
import { InicioRedes } from './inicio-redes/inicio-redes';
import { Footer } from '../footer/footer';


@Component({
  selector: 'app-inicio',
  imports: [InicioHeader, InicioServicios, InicioBeneficios, InicioPlataformas, InicioClientes, InicioTestimonios, InicioFormulario, InicioRedes, Footer],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss',
})
export class Inicio {}

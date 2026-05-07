import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';
import { NosotrosHeader } from './nosotros-header/nosotros-header';
import { NosotrosPilares } from './nosotros-pilares/nosotros-pilares';
import { NosotrosCedol } from './nosotros-cedol/nosotros-cedol';
import { NosotrosHistoria } from './nosotros-historia/nosotros-historia';
import { NosotrosVisionMision } from './nosotros-vision-mision/nosotros-vision-mision';
import { NosotrosValores } from './nosotros-valores/nosotros-valores';
import { NosotrosOds } from './nosotros-ods/nosotros-ods';

@Component({
  selector: 'app-nosotros',
  imports: [
    Navbar,
    Footer,
    NosotrosHeader,
    NosotrosPilares,
    NosotrosCedol,
    NosotrosHistoria,
    NosotrosVisionMision,
    NosotrosValores,
    NosotrosOds,
  ],
  templateUrl: './nosotros.html',
  styleUrl: './nosotros.scss',
})
export class Nosotros {}

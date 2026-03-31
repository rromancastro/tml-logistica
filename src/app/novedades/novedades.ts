import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';
import { NovedadesHeader } from './novedades-header/novedades-header';
import { NovedadesMain } from './novedades-main/novedades-main';

@Component({
  selector: 'app-novedades',
  imports: [Navbar, Footer, NovedadesHeader, NovedadesMain],
  templateUrl: './novedades.html',
  styleUrl: './novedades.scss',
})
export class Novedades {}

import { Component, inject, viewChild } from '@angular/core';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

import { RouterModule } from '@angular/router';




import { MatIconModule } from '@angular/material/icon';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { MenuService } from '../../../services/menu.service';
import { DrawerService } from '../../../services/drawer.service';


@Component({
  selector: 'app-imghome',
  imports: [
    MatSidenavModule,
    MatListModule,
    ToolbarComponent,
    RouterModule,
    MatIconModule,
    MatExpansionModule
],
  templateUrl: './imghome.component.html',
  styleUrl: './imghome.component.css'
})
export class ImghomeComponent {

    opened = false;
    accordion = viewChild.required(MatAccordion);
    private menuService = inject(MenuService);
    public folders = this.menuService.folders;
  
    constructor(
      private sidenavService: DrawerService,
      ) {
      this.sidenavService.isOpened$.subscribe((isOpened) => {
        this.opened = isOpened;
      });
    }
}

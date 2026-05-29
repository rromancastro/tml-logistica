import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

import { MatMenuModule } from '@angular/material/menu';
import { DrawerService } from '../../../services/drawer.service';
import { AuthService } from '../../../services/auth.service';


@Component({
    selector: 'app-toolbar',
    imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  sidenavService = inject(DrawerService);
  authService = inject(AuthService);

  openSidenav() {
    this.sidenavService.open();
  }

  closeSidenav() {
    this.sidenavService.close();
  }
  toggleSidenav() {
    this.sidenavService.toggle();
  }

}

import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AdminService } from '../../../../services/admin.service';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
    selector: 'app-download-excel',
    imports: [MatIconModule, MatButtonModule, MatMenuModule],
    templateUrl: './download-excel.component.html',
    styleUrl: './download-excel.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DownloadExcelComponent {
  public adminService = inject(AdminService);
  tabla = input<string>();

  constructor(){}

  downloadExcel() {
    const tabla = this.tabla();
    const dir = this.adminService.servidor;
    //console.log(dir);
    if(tabla){
      window.location.href = dir+'bajar-excel-new.php?tabla='+tabla;
    }
  }
}

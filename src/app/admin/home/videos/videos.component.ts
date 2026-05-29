import { Component, inject } from '@angular/core';
import { AdminAService } from '../../../services/adminA.service';

@Component({
  selector: 'app-videos',
  imports: [],
  templateUrl: './videos.component.html',
  styleUrl: './videos.component.css'
})
export class VideosComponent {
  public uploadService = inject(AdminAService);
}

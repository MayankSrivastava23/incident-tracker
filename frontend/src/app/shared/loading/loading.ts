import { Component, Input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-loading',
  imports: [MatProgressBarModule],
  templateUrl: './loading.html',
  styleUrl: './loading.css',
})
export class Loading {
    @Input() text = 'Loading...';
}

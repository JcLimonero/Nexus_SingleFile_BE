import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaterialExampleComponent } from './material-example/material-example.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MaterialExampleComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'singlefile-frontend';
}

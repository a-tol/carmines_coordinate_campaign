import { Component, signal, input, output } from '@angular/core';
import { Mode } from "../../shared/interfaces/mode"

@Component({
  selector: 'app-ui-core',
  standalone: true,
  imports: [],
  templateUrl: './ui-core.component.html',
  styleUrl: './ui-core.component.css'
})
export class UiCoreComponent {
  set_mode = input.required<Mode>()
}

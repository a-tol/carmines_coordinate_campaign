import { Component, input, output} from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { Mode } from '../../../shared/interfaces/mode';

@Component({
  selector: 'app-chara-details',
  imports: [MatButtonModule],
  templateUrl: './chara-details.html',
  styleUrl: './chara-details.css'
})
export class CharaDetailsComponent {

  key = input.required<string>();
  return = output<Mode>();

  return_to_select(){
    this.return.emit({mode : "chara"});
  }
}

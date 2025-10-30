import { Component, input, output, computed} from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { Mode } from '../../../../shared/interfaces/mode';
import { chara_data_list_default } from '../../../../shared/defaults/chara-data-defaults';
import { CharaData } from '../../../../shared/interfaces/chara-data';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-chara-details',
  imports: [MatButtonModule, MatDividerModule],
  templateUrl: './chara-details.html',
  styleUrl: './chara-details.css'
})
export class CharaDetailsComponent {
  
  chara_key = input.required<string>()
  return = output<Mode>();
  edit_mode = input<boolean>();
  set_to_edit = output<string>();

  //todo make this into a database query
  
  chara_data_set = computed<CharaData | undefined>(() => chara_data_list_default.find((val) => val.key === this.chara_key()))

  return_to_select(){
    this.return.emit({mode : "chara"});
  }

  modify_chara_data(){
    console.log("Will change shortly.")
  }
  
  set_to_edit_handler(){
    this.set_to_edit.emit(this.chara_key())
  }
}

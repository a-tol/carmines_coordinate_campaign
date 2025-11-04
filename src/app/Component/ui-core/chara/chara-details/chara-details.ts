import { Component, input, output, computed, signal, inject} from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { Mode } from '../../../../shared/interfaces/mode';
import { chara_data_list_default } from '../../../../shared/defaults/chara-data-defaults';
import { CharaData } from '../../../../shared/interfaces/chara-data';
import { MatDividerModule } from '@angular/material/divider';
import { CharaDataEntry, CharaDataEntryList } from '../../../../shared/interfaces/chara-data-entries';
import { chara_data_entries_defaults } from '../../../../shared/defaults/chara-data-entries-defaults';
import { chara_submit_config } from '../../../../shared/defaults/submit_configs';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { DBRequestor } from '../../../../shared/services/dbrequestor';

@Component({
  selector: 'app-chara-details',
  imports: [MatButtonModule, MatDividerModule],
  templateUrl: './chara-details.html',
  styleUrl: './chara-details.css'
})
export class CharaDetailsComponent {
  
  db_service = inject(DBRequestor)

  chara_key = input.required<string>()
  return = output<Mode>();
  edit_mode = input<boolean>();
  set_to_edit = output<string>();
  chara_data_entries = signal(chara_data_entries_defaults);
  chara_submit_config = chara_submit_config

  //todo make this into a database query
  chara_data_set = computed<CharaData | undefined>(() => chara_data_list_default.find((val) => val.key === this.chara_key()))
  chara_log_set = computed<CharaDataEntry[] | undefined>(() => chara_data_entries_defaults.find((val) => val.key === this.chara_key())?.entries)

  return_to_select(){
    this.return.emit({mode : "chara"});
  }

  //todo: connect to database
  modify_chara_data(){ 
    
  }
  
  set_to_edit_handler(){

  }

  //todo: connect to database
  submit_log_entry(){

  }
}

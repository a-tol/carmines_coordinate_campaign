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
import { AsyncPipe } from '@angular/common';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-chara-details',
  imports: [MatButtonModule, MatDividerModule],
  templateUrl: './chara-details.html',
  styleUrl: './chara-details.css'
})
export class CharaDetailsComponent {

  db_service = inject(DBRequestor)

  chara_key = input.required<number>();
  selected_group = input.required<string>();
  return = output<Mode>();
  edit_mode = input<boolean>();
  set_to_edit = output<number>();
  chara_data_entries = signal(chara_data_entries_defaults);
  chara_submit_config = chara_submit_config

  //initial database query for character details
  chara_data_set_observ : Observable<CharaData> | undefined
  subscriptions : Subscription[] | undefined
  chara_data_set = signal<CharaData>(chara_data_list_default[0])
  chara_log_set = computed<CharaDataEntry[] | undefined>(() => this.chara_data_set()?.entries)

  ngOnInit(){
    this.subscriptions = []
    if(this.chara_key() != -1){
      this.chara_data_set_observ = this.db_service.get_chara_details(this.chara_key())
      this.subscriptions?.push(this.chara_data_set_observ.subscribe({
        next : (response) => {
          console.log("Character data received?");
          this.chara_data_set.set(response)
        },
        error : (response) => {
          console.log("Error! character data not received")
          return null;
        }
      }))

    }else{
      //default character ocnfiguration
      this.chara_data_set.set(
        {
          key: -1,
          name: "[Character Name]",
          subtitle: "[Engaging Subtitle]",
          group: this.selected_group(),
          img_filename: "mao_zedong.png",
          bio: "Character Biography Here",
          relation:"[Party Relationship]",
          faction:"[Faction]",
          status: "[Alive, Dead, etc.]",
          entries: []
        }
      )
    }
  }

  ngOnDestroy(){
    this.subscriptions?.map((s) => s.unsubscribe())
  }

  return_to_select(){
    this.return.emit({mode : "chara"});
  }

  //todo: connect to database
  modify_chara_data(){ 
    // this.db_service.update_chara_details(this.chara_data_set())

    if(this.chara_key() == -1){
      //upload a new character   
      this.chara_data_set_observ = this.db_service.get_chara_details(this.chara_key())
      this.subscriptions?.push(this.chara_data_set_observ.subscribe({
        next : (response) => {
          console.log("New character data sent?");
          this.chara_data_set.set(response)
        },
        error : (response) => {
          console.log("Error! character data not sent?")
          return null;
        }
      }))
    }else{
      //
      this.chara_data_set_observ = this.db_service.get_chara_details(this.chara_key())
      this.subscriptions?.push(this.chara_data_set_observ.subscribe({
        next : (response) => {
          console.log("Character data modified?");
          this.chara_data_set.set(response)
        },
        error : (response) => {
          console.log("Error! character data not received")
          return null;
        }
      }))
    }
  }
  
  set_to_edit_handler(){
    this.set_to_edit.emit(this.chara_key())
  }

  //todo: connect to database
  submit_log_entry(){

  }
}

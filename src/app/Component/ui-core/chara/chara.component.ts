import { Component, signal, computed, ViewChild, output, inject} from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CharaBrief, CharaData } from '../../../shared/interfaces/chara-data';
import { chara_data_list_default, character_default, group_data_list_default } from '../../../shared/defaults/chara-data-defaults';
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu'
import { ElementRef } from '@angular/core';
import { CharaDetailsComponent } from './chara-details/chara-details';
import { FormGroup, FormsModule } from '@angular/forms'
import { group_submit_config as gsc} from '../../../shared/defaults/submit_configs';
import { DBRequestor } from '../../../shared/services/dbrequestor';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chara',
  standalone: true,
  imports: [MatSidenavModule, MatDividerModule, MatCardModule, MatButtonModule, CharaDetailsComponent, FormsModule, MatMenuModule],
  templateUrl: './chara.component.html',
  styleUrl: './chara.component.css'
})
export class CharaComponent {



  //todo: mongodb query for UNIQUE GROUPS to fill list of groups
  //      get stuff

  db_service =  inject(DBRequestor)
  subs : Subscription[] | undefined

  public chara_brief_list = signal<CharaBrief[] | undefined>(undefined);
  // public group_data = computed<string[]>(() => this.chara_data_list().map((chara_data) => chara_data.group).filter((val, ind, arr) => arr.indexOf(val) === ind))
  public group_data = computed<string[] | undefined>(() => this.chara_brief_list()?.map((value) => value.group).filter((val, ind, arr) => arr.indexOf(val) === ind))
  public selected_group = signal<string>("default");
  public selected_chara_list = computed<CharaBrief[] | undefined>(() => this.chara_brief_list()?.filter((val, ind, arr) => this.selected_group() === val.group))

  public load_chara_data = output<string>();

  inspecting_character = false;
  in_edit_mode = signal<boolean>(false);
  selected_chara_key = signal<string>("-1");

  new_group_name = signal<string>("Create a new group...")
  group_submit_config = gsc

  @ViewChild('group_name_entry')
  group_name_input!: ElementRef;

  ngOnInit(){
    this.subs = []
    this.refresh_groups()
  }

  ngOnDestroy(){
    this.subs?.forEach((val) => val.unsubscribe())
  }

  private refresh_groups(){
      this.subs?.push(this.db_service.get_chara_list_temp().subscribe({
      next: (response) => {
        this.chara_brief_list.set(response)
        console.log("Brief list received")
      },
      error: (response) => {
        console.log("Error! Brief list not retrieved")
      }
    }))
  }

  //connect to database later
  create_group(){
    //insert a stock character with the new group name
    const stock_chara = character_default
    stock_chara.group = this.new_group_name()
    
    this.db_service.insert_new_chara(stock_chara, null).subscribe({
      next : (response) => {this.refresh_groups(); console.log("Character Updated?" + response)},
      error : (response) => {this.refresh_groups(); console.log("Error! character not inserted" + response)}
    })
    
  }

  remove_group(group_name : string){
    //todo
  }

  open_details(chara_key : string){
    this.inspecting_character = true;
    this.selected_chara_key.set(chara_key);
    this.in_edit_mode.set(false);
  }

  return_to_chara_list(){
    this.inspecting_character = false;
    this.refresh_groups()
  }

  return_to_inspect(){
    this.in_edit_mode.set(false)
  }

  change_selected_group(to_group : string){
    this.selected_group.set(to_group);
    this.inspecting_character = false;
  }

  make_new_character(){
    this.inspecting_character = true;
    this.selected_chara_key.set("-1");
    this.in_edit_mode.set(true);
  }

  set_edit_mode(chara_key : string){
    this.selected_chara_key.set(chara_key);
    this.in_edit_mode.set(true);
  }

  set_group_name(value : any){
    this.new_group_name.set(value);
  }

  prompt_delete(key : string){
    this.db_service.remove_chara(key).subscribe({
      next : (response) => {
        console.log("Deleted character, refreshing.")
        this.refresh_groups()
      },
      error: (response) => {
        console.log("Character delete failed?")
      }
    })
  }

}
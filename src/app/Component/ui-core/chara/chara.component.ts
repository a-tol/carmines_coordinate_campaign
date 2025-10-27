import { Component, signal, computed, ViewChild, output} from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CharaData } from '../../../shared/interfaces/chara-data';
import { chara_data_list_default, group_data_list_default } from '../../../shared/defaults/chara-data-defaults';
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button';
import { ElementRef } from '@angular/core';

@Component({
  selector: 'app-chara',
  standalone: true,
  imports: [MatSidenavModule, MatDividerModule, MatCardModule, MatButtonModule],
  templateUrl: './chara.component.html',
  styleUrl: './chara.component.css'
})
export class CharaComponent {

  //todo: mongodb query for UNIQUE GROUPS to fill list of groups
  //      mongodb query for list of characters to fill character list

  public chara_data_list = signal<CharaData[]>(chara_data_list_default);
  // public group_data = computed<string[]>(() => this.chara_data_list().map((chara_data) => chara_data.group).filter((val, ind, arr) => arr.indexOf(val) === ind))
  public group_data = signal<string[]>(group_data_list_default);
  public selected_group = signal<string>((this.group_data().length == 0 ? "default" : this.group_data()[0]));
  public selected_chara_list = computed<CharaData[]>(() => this.chara_data_list().filter((val, ind, arr) => this.selected_group() === val.group))

  public load_chara_data = output<string>();

  @ViewChild('group_name_entry')
  group_name_input!: ElementRef;

  //connect to database later
  create_group(){
    this.group_data.update((list) => ([...list, this.group_name_input.nativeElement.value]))
  }

  remove_group(group_name : string){
    this.group_data.update((list) => (list.filter((val, ind, arr) => val != group_name)))
  }

  open_details(chara_key : string){
    this.load_chara_data.emit(chara_key)
  }

}
import { Component, signal, input, output } from '@angular/core';
import { Mode, ModeWithDataKey } from "../../shared/interfaces/mode"
import { CharaComponent } from './chara/chara.component';
import { ItemComponent } from './item/item.component';
import { LogComponent } from './log/log.component';
import { MapComponent } from './map/map.component';
import { HomeComponent } from './home/home.component';
import { CharaDetailsComponent } from './chara-details/chara-details';
import { ItemDetailsComponent } from './item-details/item-details';

@Component({
  selector: 'app-ui-core',
  standalone: true,
  imports: [HomeComponent, CharaComponent, ItemComponent, LogComponent, MapComponent, CharaDetailsComponent, ItemDetailsComponent],
  templateUrl: './ui-core.component.html',
  styleUrl: './ui-core.component.css'
})

export class UiCoreComponent {
  set_mode = input.required<Mode>()
  key = input.required<string>()

  load_data_handler = output<ModeWithDataKey>()
  return = output<Mode>()

  load_chara_data(chara_key : string){
    this.load_data_handler.emit({mode : "chara_data", key : chara_key})
  }

  load_item_data(item_key : string){
    this.load_data_handler.emit({mode : "item_data", key : item_key})
  }

  return_to_mode(to_mode : Mode){
    this.return.emit(to_mode)
  }
}

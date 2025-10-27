import { Component, signal, input, output } from '@angular/core';
import { Mode } from "../../shared/interfaces/mode"
import { CharaComponent } from './chara/chara.component';
import { ItemComponent } from './item/item.component';
import { LogComponent } from './log/log.component';
import { MapComponent } from './map/map.component';
import { HomeComponent } from './home/home.component';
import { CharaDetailsComponent } from './chara/chara-details/chara-details';
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
}

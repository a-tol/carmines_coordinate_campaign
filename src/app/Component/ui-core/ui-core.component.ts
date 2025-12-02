import { Component, signal, input, output } from '@angular/core';
import { Mode } from "../../shared/interfaces/mode"
import { CharaComponent } from './chara/chara.component';
import { ItemComponent } from './item/item.component';
import { LogComponent } from './log/log.component';
import { MapComponent } from './map/map.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login';

@Component({
  selector: 'app-ui-core',
  standalone: true,
  imports: [HomeComponent, CharaComponent, ItemComponent, LogComponent, MapComponent, LoginComponent],
  templateUrl: './ui-core.component.html',
  styleUrl: './ui-core.component.css'
})

export class UiCoreComponent {
  set_mode = input.required<Mode>()

  upstream_key_eval_call = output<string>()

  upstream_key_eval(campaign_key : string){
    this.upstream_key_eval_call.emit(campaign_key)
  }

}

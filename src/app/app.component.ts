import { Component, signal, output, ElementRef, viewChild} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav'
import { MatCardModule } from "@angular/material/card"
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatButtonModule } from "@angular/material/button"
import { MatDividerModule } from "@angular/material/divider"
import { UiCoreComponent } from './Component/ui-core/ui-core.component';
import { Mode, ModeWithDataKey } from "./shared/interfaces/mode"
import { mode_default } from './shared/defaults/mode-defaults';
import { DOCUMENT } from "@angular/common"

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatSidenavModule, MatCardModule, MatToolbarModule, MatButtonModule, MatDividerModule, UiCoreComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {

  sidenav = viewChild(MatSidenav)

  title = 'DND_campaign_front';
  mode = signal<Mode>(mode_default);
  key = signal<string>("null");

  ngOnInit(){

  }

  swap_mode(mode : number){
    this.sidenav()?.toggle()
    switch(mode){
      case 0:
        this.mode.set({mode : "home"});
        break;
      case 1:
        this.mode.set({mode : "chara"});
        break;
      case 2:
        this.mode.set({mode : "item"});
        break;
      case 3:
        this.mode.set({mode : "log"});
        break;
      case 4:
        this.mode.set({mode : "map"});
        break;
      default:
        break;
    }
  }

  swap_mode_submode(mode : Mode){
    this.mode.set(mode);
  }

  swap_mode_with_key(mode_with_key : ModeWithDataKey){
    this.key.set(mode_with_key.key)
    this.mode.set({mode : mode_with_key.mode})
  }
  
}
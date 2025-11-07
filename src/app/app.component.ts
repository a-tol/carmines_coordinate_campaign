import { Component, signal, output, ElementRef, viewChild, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav'
import { MatCardModule } from "@angular/material/card"
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatButtonModule } from "@angular/material/button"
import { MatDividerModule } from "@angular/material/divider"
import { UiCoreComponent } from './Component/ui-core/ui-core.component';
import { Mode } from "./shared/interfaces/mode"
import { mode_default } from './shared/defaults/mode-defaults';
import { DOCUMENT } from "@angular/common"
import { DBRequestor } from './shared/services/dbrequestor';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatSidenavModule, MatCardModule, MatToolbarModule, MatButtonModule, MatDividerModule, UiCoreComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {

  db_service = inject(DBRequestor)
  sidenav = viewChild(MatSidenav)

  check_sub : Subscription | undefined

  title = 'DND_campaign_front';
  mode = signal<Mode>(mode_default);

  ngOnInit(){
    //initialize the database, if there is no character.
    console.log("Attempting to check or initialize the database.")
    this.check_sub = this.db_service.check_or_initialize_database()
  }

  ngOnDestroy(){
    this.check_sub?.unsubscribe()
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
  
}
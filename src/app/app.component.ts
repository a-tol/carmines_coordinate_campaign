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
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatSidenavModule, MatCardModule, MatToolbarModule, MatButtonModule, MatDividerModule, UiCoreComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {

  cookie_service = inject(CookieService)
  db_service = inject(DBRequestor)
  sidenav = viewChild(MatSidenav)

  subs : Subscription[] | undefined

  title = 'DND_campaign_front';
  mode = signal<Mode>(mode_default);
  authority = signal<boolean>(false)

  campaign_key = signal<string | null>(null)

  ngOnInit(){
    this.subs = []
    const saved_key = this.cookie_service.get("campaign_key")
    //redundant?
    if(saved_key == null || saved_key == ""){
      this.mode.set({mode : "login"})
    }else{
      this.eval_campaign_key(saved_key)
    }
  }

  ngOnDestroy(){
    this.subs?.forEach((sub) => sub.unsubscribe())
  }

  eval_campaign_key(key : string){
    if(key != null){
      //non-null assertion cause ^^
      this.subs?.push(this.db_service.eval_campaign_key(key).subscribe({
          next: (res : boolean) => {
            console.log("Do you have authority?", res)
            if(res){
              this.authority.set(true)
            }else{
              this.authority.set(false)
            }
            //cookie lasts for a day.
            this.cookie_service.set("campaign_key", key, Date.now()+1000*60*60*24)
            this.campaign_key.set(key)
            this.mode.set({mode : "home"})
          },
          error: () => {
            console.log("Key doesn't work.")
          }
        }
      ))
    }
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
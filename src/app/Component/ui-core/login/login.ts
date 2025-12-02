import { Component, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { DBRequestor } from '../../../shared/services/dbrequestor';
import { Subscription } from 'rxjs';
import { CreateCampaignParams } from '../../../shared/interfaces/create-campaign-params';
import { CookieService } from 'ngx-cookie-service'

@Component({
  selector: 'app-login',
  imports: [MatButton, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  providers: [CookieService]
})
export class LoginComponent {

  cookie_service = inject(CookieService)

  subs : Subscription[] = []

  db_service = inject(DBRequestor)
  new_campaign_details_revealed = signal<boolean>(false)
  campaign_name = signal<string>("default")
  gm_name = signal<string>("default")
  join_key_field = signal<string>("default")

  campaign_key = output<string>();

  ngOnInit(){
    this.subs = []
  }

  ngOnDestroy(){
    this.subs.forEach((sub) => {sub.unsubscribe()})
  }

  create_new_campaign(){
    this.subs.push(this.db_service.create_new_campaign({campaign_name : this.campaign_name(), gm_name : this.gm_name()}).subscribe({
        next: (res) => {
          //set-cookie doesn't work for some reason. backend sends cookie in response
          //it is still the app component's responsibility to evaluate keys
          this.campaign_key.emit(res)
          console.log("Confirming that the cookie is " + document.cookie)
        },
        error: () => {
          console.log("Error creating the campaign.")
        }
      })
    )
  }

  eval_campaign_field(){
    this.campaign_key.emit(this.join_key_field())
  }

}
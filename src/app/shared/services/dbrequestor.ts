import { HttpClient } from '@angular/common/http';
import { Injectable, inject} from '@angular/core';
import { CharaBrief, CharaData } from '../interfaces/chara-data';
import { CharaDetailsComponent } from '../../Component/ui-core/chara/chara-details/chara-details';
import { CharaDataEntry } from '../interfaces/chara-data-entries';
import { Observable, Subscription } from 'rxjs';
import { server_hostname, user_img_location } from '../defaults/server-settings';


@Injectable({
  providedIn: 'root'
})

export class DBRequestor {

  //db details
  //campaign has:
  //  --map
  //  --item list
  //  --character list
  //  --event log

  
  private readonly API_HOSTNAME = "http://127.0.0.1:8002"
  private readonly API_BASE_URL = this.API_HOSTNAME + "/api"
  private http = inject(HttpClient)

  //POST to initialize the database
  check_or_initialize_database() : Subscription{
    return this.http.get<string>((this.API_BASE_URL + "/check_init_db")).subscribe({
      next : (response) => {console.log("Database is " + response)},
      error : (response) => {console.log("Error! Database is " + response)}
    })
  }

  //POST to remove a character from the database
  remove_chara(chara_key : string){
    this.http.post((this.API_BASE_URL + "/remove_chara"), chara_key).subscribe({
      next : (response) => {console.log("Character Removed?")},
      error : (response) => {console.log("Error! character not removed")}
    })
  }

  //GET to receive character details
  get_chara_details(chara_key: string) : Observable<CharaData>{
    return this.http.get<CharaData>(
      (this.API_BASE_URL + "/get_chara"),
      {
        params: {
          'key' : chara_key
        }
      }
    )
    // .subscribe({
    //   next : (response) => {
    //     console.log("Character data received?");
    //     return response;
    //   },
    //   error : (response) => {
    //     console.log("Error! character data not received")
    //     return null;
    //   }
    // })
  }

  //POST to update character details using CharaData object
  update_chara_details(chara_details : CharaData, img : File | null) : Observable<string> {
    const form_data = new FormData()
    Object.keys(chara_details).map((key) => {form_data.append(key, (chara_details as any)[key])})
    if(img != null){
      form_data.append("img", img)
    }
    return this.http.post<string>((this.API_BASE_URL + "/update_chara"), form_data)
  }

  //POST to insert a new character
  insert_new_chara(chara_details : CharaData, img : File | null) : Observable<string>{
    const form_data = new FormData()
    Object.keys(chara_details).map((key) => {form_data.append(key, (chara_details as any)[key])})
    if(img != null){
      form_data.append("img", img)
    }
    return this.http.post<string>((this.API_BASE_URL + "/insert_chara"), form_data)
  }

  //POST to insert a single chara data log entry
  insert_single_chara_log_entry(chara_key : string, entry: CharaDataEntry) : Observable<string>{
    return this.http.post<string>((this.API_BASE_URL + "/insert_chara_log"), {key : chara_key, entry : entry})
  }

  //POST to remove a single chara data log entry
  remove_single_chara_log_entry(chara_key : string, entry_index : number){
    this.http.post((this.API_BASE_URL + "/remove_chara_log"), {key : chara_key, index : entry_index}).subscribe({
      next : (response) => {console.log("Character log entry removed?")},
      error : (response) => {console.log("Error! character log entry not removed")}
    })
  }

  //GET to get a list of characters in the campaign (and the character brief)
  get_chara_list(campaign_key : string){
    return this.http.get<CharaData>(
      (this.API_BASE_URL + "/get_chara_list"),
      {
        headers: {
          "campaign_key" : campaign_key
        }
      }
    )
  }

  get_chara_list_temp() : Observable<CharaBrief[]>{
    return this.http.get<CharaBrief[]>(
      (this.API_BASE_URL + "/get_chara_briefs"),
    )
  }

  // get_chara_img(filename : string | undefined) :  Observable<any> | undefined {
  //   if(filename === undefined) return undefined;
  //   return this.http.get(this.API_BASE_URL + "/get_chara_img", 
  //     {
  //       params: {
  //         img_filename : filename
  //       },
  //       responseType : 'arraybuffer'
  //     })
  // }

  get_chara_img_url(img_filename : string | undefined){
    if(img_filename == undefined || img_filename == "undefined"){
      return this.API_HOSTNAME + "/default.png"
    }else{
      return this.API_BASE_URL + "/get_chara_image?img_filename=" + img_filename
    }
  }

}

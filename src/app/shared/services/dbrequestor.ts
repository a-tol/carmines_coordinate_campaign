import { HttpClient } from '@angular/common/http';
import { Injectable, inject} from '@angular/core';
import { CharaBrief, CharaData } from '../interfaces/chara-data';
import { CharaDetailsComponent } from '../../Component/ui-core/chara/chara-details/chara-details';
import { CharaDataEntry } from '../interfaces/chara-data-entries';
import { Observable, Subscription } from 'rxjs';


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

  private readonly API_BASE_URL = "http://127.0.0.1:8002/api"
  private http = inject(HttpClient)

  //POST to initialize the database
  check_or_initialize_database() : Subscription{
    return this.http.get<string>((this.API_BASE_URL + "/check_init_db")).subscribe({
      next : (response) => {console.log("Database is " + response)},
      error : (response) => {console.log("Error! Database is " + response)}
    })
  }

  //POST to remove a character from the database
  remove_chara(chara_key : number){
    this.http.post((this.API_BASE_URL + "/remove_chara"), chara_key).subscribe({
      next : (response) => {console.log("Character Removed?")},
      error : (response) => {console.log("Error! character not removed")}
    })
  }

  //GET to receive character details
  get_chara_details(chara_key: number) : Observable<CharaData>{
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
  update_chara_details(chara_details : CharaData){
    this.http.post((this.API_BASE_URL + "/update_chara"), chara_details).subscribe({
      next : (response) => {console.log("Character Updated?")},
      error : (response) => {console.log("Error! character not updated")}
    })
  }

  //POST to insert a new character
  insert_new_chara(chara_details : CharaData) : Observable<string>{
    return this.http.post<string>((this.API_BASE_URL + "/insert_chara"), chara_details)
  }

  //POST to insert a single chara data log entry
  insert_single_chara_log_entry(chara_key : number, entry: CharaDataEntry){
    this.http.post((this.API_BASE_URL + "/insert_chara_log"), {key : chara_key, entry : entry}).subscribe({
      next : (response) => {console.log("Character log entry inserted?")},
      error : (response) => {console.log("Error! character log entry not removed")}
    })
  }

  //POST to remove a single chara data log entry
  remove_single_chara_log_entry(chara_key : number, entry_index : number){
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

}

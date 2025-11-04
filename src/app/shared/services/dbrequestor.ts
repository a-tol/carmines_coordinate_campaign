import { HttpClient } from '@angular/common/http';
import { Injectable, inject} from '@angular/core';
import { CharaData } from '../interfaces/chara-data';
import { CharaDetailsComponent } from '../../Component/ui-core/chara/chara-details/chara-details';


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

  private readonly API_BASE_URL = "http://127.0.0.1/api"
  private http = inject(HttpClient)

  //POST information to insert a single character into the database
  insert_new_chara(chara_details: CharaData){
    this.http.post((this.API_BASE_URL + "/new_chara"), chara_details).subscribe({
      next : (response) => {console.log("Character inserted?")},
      error : (response) => {console.log("Error! Character not inserted")}
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
  get_chara_details(chara_key: string) : CharaData | undefined{
    this.http.get<CharaData>(
      (this.API_BASE_URL + "/remove_chara"),
      {
        headers: {
          'key' : chara_key
        }
      }
    ).subscribe({
      next : (response) => {
        console.log("Character data received?");
        return response;
      },
      error : (response) => {
        console.log("Error! character data not received")
        return null;
      }
    })
    return;
  }

  //POST to update character details using CharaData object
  update_chara_details(chara_details : CharaData){
    this.http.post((this.API_BASE_URL + "/update_chara"), chara_details).subscribe({
      next : (response) => {console.log("Character Removed?")},
      error : (response) => {console.log("Error! character not removed")}
    })
  }

}

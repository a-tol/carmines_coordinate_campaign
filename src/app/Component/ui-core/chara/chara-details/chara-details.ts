import { Component, input, output, computed, signal, inject} from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { Mode } from '../../../../shared/interfaces/mode';
import { chara_data_list_default } from '../../../../shared/defaults/chara-data-defaults';
import { CharaData } from '../../../../shared/interfaces/chara-data';
import { MatDividerModule } from '@angular/material/divider';
import { CharaDataEntry, CharaDataEntryList } from '../../../../shared/interfaces/chara-data-entries';
import { chara_data_entries_defaults } from '../../../../shared/defaults/chara-data-entries-defaults';
import { chara_submit_config, log_submit_config } from '../../../../shared/defaults/submit_configs';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { DBRequestor } from '../../../../shared/services/dbrequestor';
import { AsyncPipe } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms'
import { server_hostname, user_img_location } from '../../../../shared/defaults/server-settings';


@Component({
  selector: 'app-chara-details',
  imports: [MatButtonModule, MatDividerModule, FormsModule],
  templateUrl: './chara-details.html',
  styleUrl: './chara-details.css'
})
export class CharaDetailsComponent {

  db_service = inject(DBRequestor)

  chara_key = input.required<string>();
  selected_group = input.required<string>();
  return = output<Mode>();
  edit_mode = input<boolean>();
  set_to_edit = output<string>();
  chara_data_entries = signal(chara_data_entries_defaults);
  chara_submit_config = chara_submit_config
  log_submit_config = log_submit_config
  is_loading = signal<boolean>(false)

  //initial database query for character details
  chara_data_set_observ : Observable<CharaData> | undefined
  subscriptions : Subscription[] | undefined
  chara_data_set = signal<CharaData>(chara_data_list_default[0])

  image_link = computed<string>(() => {
    return this.db_service.get_chara_img_url(this.chara_data_set().img_filename)
  })

  in_edit_image_url = signal<string>(this.db_service.get_chara_img_url(undefined))

  uploaded_image : File | null = null

  //new log entry field
  new_log_entry_field = signal<CharaDataEntry>({title: "[New Entry]", entry: "[New Entry Body]"})

  private refresh_chara_details(){
    this.is_loading.set(true)
      this.subscriptions?.push(this.db_service.get_chara_details(this.chara_key()).subscribe({
      next : (response) => {
        console.log("Character data received?");
        this.chara_data_set.set(response)
        this.in_edit_image_url.set(this.db_service.get_chara_img_url(response.img_filename))
        this.is_loading.set(false)
        // const img_sub = this.db_service.get_chara_img(this.chara_data_set().img_filename)?.subscribe({
        //   next: (response) => {
        //     console.log("Got the character image file.")
        //     const reader = new FileReader()
        //     reader.onload = (data) => {
        //       this.image_file.set(data.target?.result)
        //       console.log("loaded the image file.")
        //     }
        //     reader.onerror = (error) => {
        //       console.log("Error in the image FileReader")
        //     }
        //     reader.readAsDataURL(new Blob(response))
        //   },
        //   error: (error) => {
        //     console.log("Could not get the character image file.", error)
        //   }
        // })
        
      },
      error : (response) => {
        console.log("Error! character data not received")
        return null;
      }
    }))
  }

  ngOnInit(){
    this.subscriptions = []
    if(this.chara_key() != "-1"){
      this.refresh_chara_details()

    }else{
      //default character ocnfiguration
      this.init_edit_mode()
    }
  }

  init_edit_mode(){
      this.is_loading.set(false)
      this.chara_data_set.set(
        {
          key: "-1",
          name: "[Character Name]",
          subtitle: "[Engaging Subtitle]",
          group: this.selected_group(),
          img_filename: undefined,
          bio: "Character Biography Here",
          relation:"[Party Relationship]",
          faction:"[Faction]",
          status: "[Alive, Dead, etc.]",
          entries: []
        }
      )
    }

  ngOnDestroy(){
    this.subscriptions?.map((s) => s.unsubscribe())
  }

  return_to_select(){
    this.return.emit({mode : "chara"});
  }

  //todo: connect to database
  modify_chara_data(){ 
    // this.db_service.update_chara_details(this.chara_data_set())

    if(this.chara_key() == "-1"){
      //upload a new character; 
      this.subscriptions?.push(this.db_service.insert_new_chara(this.chara_data_set(), this.uploaded_image).subscribe({
        next : (response) => {
          console.log("New character data sent?");
          this.refresh_chara_details();
          this.return.emit({mode : "chara"})
        },
        error : (response) => {
          console.log("Error! character data not sent?")
          return null;
        }
      }))
    }else{
      //
      this.subscriptions?.push(this.db_service.update_chara_details(this.chara_data_set(), this.uploaded_image).subscribe({
        next : (response) => {
          console.log("Character data modified?");
          this.refresh_chara_details();
          this.return.emit({mode : "chara"})
        },
        error : (response) => {
          console.log("Error! character data not received")
          return null;
        }
      }))
    }
  }
  
  set_to_edit_handler(){
    this.set_to_edit.emit(this.chara_key())
  }

  //todo: connect to database
  submit_log_entry(){
    this.db_service.insert_single_chara_log_entry(
      this.chara_data_set().key, 
      this.new_log_entry_field()
    ).subscribe({
      next: (data) => {
        console.log("Submitted log entry.")
        this.refresh_chara_details()
        this.new_log_entry_field.set({title : "[New Entry]", entry : "[New Entry Body]"})
      },
      error: (error) => {
        console.log("Couldn't submit log entry!")
      }
    })
  }

  update_data_signal(id : string, to_val : string){
    this.chara_data_set.update(data => {(data as any)[id] = to_val; return data;})
    console.log("Updated data signal")
  }

  update_log_signal(id : string, to_val : string){
    this.new_log_entry_field.update(data => {(data as any)[id] = to_val; return data;})
    console.log("Updated log signal")
  }

  update_log_list_title_signal(index : number, to_val : string){
    this.chara_data_set.update((data) => {data.entries[index].title = to_val; return data})
  }

  update_log_list_entry_signal(index : number, to_val : string){
    this.chara_data_set.update((data) => {data.entries[index].entry= to_val; return data})
    console.log(index)
  }

  update_image(files : FileList | null){
    if(files != null && files.item(0) != null){
      this.uploaded_image = files.item(0)
      this.update_data_signal("img_filename", files.item(0)?.name!)
      this.in_edit_image_url.set(URL.createObjectURL((this.uploaded_image!))) //non-null assertion
    }
  }

  get_entry_from_signal(index : number){
    console.log("Getting entry from", index)
    return this.chara_data_set().entries[index]
  }
}

import { CharaDataEntryList } from "../interfaces/chara-data-entries";
import { CharaDataEntry } from "../interfaces/chara-data-entries";

export const chara_data_entries_defaults : CharaDataEntryList[] =
[
    {
        key : "good_man1",
        entries : [
            {
                index : 0,
                title : "Who he is",
                entry : "A new man"
            }, 
            {   index : 1, 
                title : "what he isn't",
                entry : "An old man"
            }
        ]
    },
    {
        key : "evil_man1",
        entries : [
            {
                index : 0,
                title : "Look at this guy",
                entry : "A settled man"
            }, 
            {   index : 1, 
                title : "I mean really what is he?",
                entry : "An young man"
            }
        ]
    },
]
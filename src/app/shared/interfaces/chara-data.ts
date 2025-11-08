import { CharaDataEntry } from "./chara-data-entries";

export interface CharaData extends CharaBrief {
    bio: string,
    faction: string,
    relation: string,
    status: string,
    entries : CharaDataEntry[]
}

export interface CharaBrief {
    key: string,
    group: string,
    name: string,
    subtitle: string,
    img_filename: string | undefined
}
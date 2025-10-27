export interface Mode {
    mode : "home" | "chara" | "item" | "log" | "map" | "chara_data" | "item_data"
}

export interface ModeWithDataKey extends Mode {
    key : string
}
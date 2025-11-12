export interface SubmitConfig{
    id : string
    type : string
}

export const group_submit_config : SubmitConfig = {
    id : "group",
    type : "text"
}

export const chara_submit_config : SubmitConfig[] = [
    {
        id : "key",
        type : "text"
    },
    {
        id: "group",
        type: "text"
    },
    {
        id : "name",
        type : "text"
    },
    {
        id : "bio",
        type : "text"
    },
    {
        id : "subtitle",
        type : "text"
    },
    {
        id : "faction",
        type : "text"
    },
    {
        id : "relation",
        type : "text"
    },
    {
        id : "status",
        type : "text"
    }
]

export const log_submit_config : SubmitConfig[] = [
    {
        id : "index",
        type : "string"
    },
    {
        id : "title",
        type : "string"
    },
    {
        id : "entry",
        type : "string"
    }
]
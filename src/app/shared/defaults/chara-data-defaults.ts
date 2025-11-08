import { CharaData } from "../interfaces/chara-data"

export const chara_data_list_default : CharaData[] = [
    {
      key: "",
      group: "",
      faction: "",
      bio: "",
      subtitle: "",
      relation: "",
      name: "",
      status: "",
      entries: [],
      img_filename : undefined
    },
    {
      key: "smitty",
      group: "group1",
      faction: "good",
      bio: "asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdf",
      subtitle: "the first good man",
      relation: "friendly",
      name: "Smity Werben Jaegerman Jensen",
      status: "alive",
      entries: [{index: 0, title: "Invisible", entry: "Metal Gear Solid 5"}],
      img_filename : undefined
    },
    {
      key: "EVIL",
      group: "group2",
      faction: "evil",
      bio: "he evil man 1",
      subtitle: "the first evil man",
      relation: "hostile",
      name: "evil man",
      status: "missing",
      entries: [{index: 0, title: "Snake Eater", entry: "Metal Gear Solid 3"}],
      img_filename : undefined
    },
    {
      key: "sllim shady",
      group: "group1",
      faction: "good",
      bio: "he good man",
      subtitle: "the second good man",
      relation: "friendly",
      name: "man 2",
      status: "????",
      entries: [{index: 0, title: "Alert!", entry: "Metal Gear Solid"}],
      img_filename : undefined
    },
    {
      key: "big balls",
      group: "group3",
      faction: "evil",
      bio: "he evil man 1",
      subtitle: "the second evil man",
      relation: "hostile",
      name: "evil man 2",
      status: "missing",
      entries: [{index: 0, title: "Guns of the Patriots", entry: "Metal Gear Solid 4"}],
      img_filename : undefined
    }
  ]

export const group_data_list_default : string[] = ['group1', 'group2', 'group3', 'group4']

export const character_default : CharaData =  {
  key: "-1",
  name: "[Character Name]",
  subtitle: "[Engaging Subtitle]",
  group: "group",
  bio: "Character Biography Here",
  relation:"[Party Relationship]",
  faction:"[Faction]",
  status: "[Alive, Dead, etc.]",
  entries: [],
  img_filename : undefined
}
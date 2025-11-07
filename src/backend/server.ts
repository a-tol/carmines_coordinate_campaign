//typescript is fun! i love typescript (a little less)
const __dirname = import.meta.dirname
const __filename = import.meta.filename

import express from "express"
import { MongoClient, MongoCryptCreateEncryptedCollectionError, ServerApiVersion } from "mongodb"
import bodyParser from "body-parser"
import multer, { diskStorage } from 'multer'
import cookieParser from "cookie-parser"
import path from "path"
import cors from 'cors'
import crypto from 'crypto'
import fs from 'fs'
import { CharaData } from "../app/shared/interfaces/chara-data"
import { FOCUS_MONITOR_DEFAULT_OPTIONS } from "@angular/cdk/a11y"
import { character_default } from "../app/shared/defaults/chara-data-defaults"
import { filter } from "rxjs"
import { error } from "console"
import { ObjectId } from "mongodb"

const port = 8002

/* Database Setup */
const uri = "mongodb://localhost:27017"
const client = new MongoClient(uri)


/* Express Setup */
const app = express()
// app.use('/static_img', express.static(path.join(__dirname, "./public/static_img")))

//express middleware (json parser, disk storage interface, multipart/form-data body reader)
const json_parser = bodyParser.json()
app.use(json_parser)
// const img_storage = multer.diskStorage({destination : path.join(__filename, "./public/user_img")})
// const upload_middleware = multer({storage : img_storage})
const cookie_parser = cookieParser()
app.use(cookie_parser)

/* Utility Functions */

//update the list of cookies with a new one
/*
async function add_cookie(username : String){
    //establish database connection
    client.connect()
    const db = client.db("bookstore_db")
    const active_sessions_collection = db.collection("active_sessions")
    
    //set a user cookie to remember future accesses (big nonce hashed with date)
    const cookie = crypto.hash("sha256", (Math.random()*2^63).toString() + Date.now().toString())

    //model sessions as username to list of active cookies;
    //if a username exists, update the list. otherwise insert a new one
    if(await active_sessions_collection.findOne({username: username}) != null){
        const filter = {username: username}
        const action = {$addToSet : {cookies : cookie}}
        const cookie_result = await active_sessions_collection.updateOne(filter, action)
        console.log("Updated sessions for", username, "with cookie", cookie, "DB output:", cookie_result)
    }else{
        const cookie_result = await active_sessions_collection.insertOne({username : username, cookies : [cookie]})
        console.log("Updated sessions for", username, "with cookie", cookie, "DB output:", cookie_result)
    }

    client.close()

    return cookie
}

async function get_username_from_cookie(cookie : String){
    client.connect()
    const db = client.db("bookstore_db")
    const active_sessions_collection = db.collection("active_sessions")

    const filter = {cookies: {$elemMatch : {cookie}}}
    const result = await active_sessions_collection.findOne(filter)

    if(result != null){
        const username = result["username"]
        client.close()
        return username
    }else{
        client.close()
        return null
    }
}
*/

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next()
})


/* Server Routes */

app.options('/api', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

//todo: make this host the built angular chunks
app.get("/", (req, res) => {
    res.send("Welcome")
})

app.get("/api/check_init_db", async (req, res) => {
    await client.connect();
    const db = client.db("campaign_db")
    let reply = "Success!"

    //if the user collection db does not exist, make it
    if(!(await db.listCollections({name : "characters"}).hasNext())){
        console.log("Character Table initialization")
        await db.createCollection("characters")
        const character_collection = db.collection("characters")
        await character_collection.insertOne(
            character_default
        ).catch((error) => {console.log("Error from the database: " + error); reply = "Bad DB Character Initialization"})
    }

    //todo: init other tables
    
    console.log("Initialization/Check complete.")
    res.statusCode = 200
    res.send(reply)
    
})

//returns a list of character briefs for the entire campaign.
app.get("/api/get_chara_briefs", async (req, res) => {
    await client.connect();
    const db = client.db("campaign_db")
    let reply = "Success Status"

    await db.createCollection("characters")
    const character_collection = db.collection("characters")
    const project_fields =  {"key" : "$_id", "_id": 0, name : 1, subtitle: 1, group: 1, img_filename: 1}
    const brief_list = await character_collection.find().project(project_fields).toArray()
    res.send(brief_list)
})

//insert a new character to the database
app.post("/api/insert_chara", async (req, res) => {


    //setup database connection
    await client.connect();
    const db = client.db("campaign_db")
    //if the user collection db does not exist, make it
    if(!(await db.listCollections({name : "characters"}).hasNext())){
        await db.createCollection("characters")
    }
    const character_collection = db.collection("characters")

    //use the request body to insert a character details as supplied
    const chara_details : CharaData = req.body
    await character_collection.insertOne(chara_details).catch((reason) =>{
        console.log("Unsuccessful Character Insertion: ", reason)
        res.sendStatus(400)
        return;
    });

    console.log("Successful Character Insertion")
    res.send("Success!")


})

//update an existing character in the database
app.post("/api/update_chara", async (req, res) => {
    //establish database connection
    // await client.connect();
    // const db = client.db("campaign_db")

    // //if the user collection db does not exist, make it then add a unique index on the usernames
    // if(!(await db.listCollections({name : "characters"}).hasNext())){
    //     // await (await db.createCollection("characters")).createIndex({key : 1}, {unique : true})
    //     await db.createCollection("characters")
    // }

    // const character_collection = db.collection("characters")
    // const chara_details : CharaData = req.body
    
    // if(chara_details.key=="newchara"){
    //     await character_collection.insertOne(chara_details).catch((reason) =>{
    //         console.log("Unsuccessful Account Creation")
    //         return;
    //     });
    // }else{
    //     const filter = {_id : chara_details.key}
    //     const action = {$set : {
            
    //         name: chara_details.name,
    //         group : chara_details.group,
    //         subtitle : chara_details.subtitle,
    //         bio : chara_details.bio,
    //         faction: chara_details.faction,
    //         relation: chara_details.relation,
    //         status: chara_details.status,
    //         entries: chara_details.entries

    //     }};
    //     await character_collection.updateOne(filter, action).catch((reason) =>{
    //         console.log("Unsuccessful Account Creation")
    //         return;
    //     });
    // }

    res.send("Success")

})


app.get("/api/get_chara",  async (req, res) => {
        //setup database connection
    await client.connect();
    const db = client.db("campaign_db")
    //if the user collection db does not exist, make it
    if(!(await db.listCollections({name : "characters"}).hasNext())){
        await db.createCollection("characters")
    }
    const character_collection = db.collection("characters")

    //we can find one using the key as passed in the request headers
    const objectid_from_param = new ObjectId(req.query['key']?.toString())
    console.log("The object is actually", objectid_from_param)
    const filter = {
        _id : objectid_from_param
    }
    const options = {
        projection: {"key" : "$_id", _id : 0, name : 1, group : 1, subtitle: 1, bio : 1, faction : 1, relation : 1, status : 1, entries : 1}
    }
    const result = await character_collection.findOne(filter, options).catch((err) =>{
        console.log("DB error in get_chara")
        res.send("Error in the DB: " + err)
        return
    })

    console.log("Character Retrieval")
    console.log(result)
    res.send(result)
})
app.post("/api/remove_chara", async (req, res) => {

})

//logout by clearing cookie
app.get("/api/insert_chara_log", async (req, res) =>{
    //establish database connection
    await client.connect()
    const db = client.db("bookstore_db")
    const active_sessions = db.collection("active_sessions")

    //in the cookie registry, match a user with the cookie then remove it from the list
    const filter = {cookies: {$elemMatch: req.cookies["user-session"]}}
    const action = {$pull : {cookies : req.cookies["user-session"]}}
    const logout_result = active_sessions.updateOne(filter, action)
    console.log("Removing cookie with result", logout_result)

    client.close()

    res.clearCookie("user-session")
    res.redirect("/static/logout.html")
})

//endpoint to handle a new entry in the item database
app.post("/api/remove_chara_log", async (req, res) => {

    
})

app.get("/api/get_chara_list", (req, res) => {
    res.send()
})



app.listen(port)
console.log("Listening on port " + port)
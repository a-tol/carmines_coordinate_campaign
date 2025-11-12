__dirname = import.meta.dirname
__filename = import.meta.filename
const url = import.meta.url
import {fileURLToPath} from "url"
import {join, dirname} from "path"


console.log(__dirname)
console.log(__filename)
console.log(url)
console.log(dirname(fileURLToPath(url)))
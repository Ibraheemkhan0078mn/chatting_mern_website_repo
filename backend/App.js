import express from 'express'
const app= express()
import dbConnection from './db/dbConnect.js';
dbConnection()
import cors from 'cors'
import cookieParser from 'cookie-parser';
import path from 'path'
import { fileURLToPath } from 'url';



import UserRoutes from './routes/userRoutes.js'
import MessageRoutes from './routes/messageRoute.js'



app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials:true
}))


















app.use("/api/userRoutes", UserRoutes)
app.use("/api/messageRoutes", MessageRoutes )
















// path is comes with node.js with the help of which we play with current path etc
// import.meta.url give the path till current file from the root folder of entire computer
// fileURLTo Path only remove the extra thing from this url like file:// which we dont need
// path.dirname now make a copy of this url but till to directry means it does not inclue the file 


// Resolve __dirname for ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// app.use(express.static(path.join(__dirname, "dist")))


// app.use("*", (req, res)=>{
//     res.sendFile(path.resolve( __dirname, "dist" , "index.html"))
// })






















export default app;


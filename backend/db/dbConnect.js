import mongoose from 'mongoose'


const dbConnection= async function (){
    mongoose.connect(`${process.env.Mongodb_Uri}/chatting_mern_website`)
    .then(()=>{
        console.log("The mongodb database is connected")
    })
    .catch((error)=>{
        console.log(error)
    })
}




export default dbConnection
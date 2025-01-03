import blockedJwtModel from '.././models/blockJwt.js'

  


async function isLoggedIn(req, res, next){
    let userJwtToken= req.cookies.userToken;

    if(!userJwtToken){
        return res.send({status:"failed", msg:"You are not logged in so please first loggin and then use"})
    }

    let existingBlockedJwt= await blockedJwtModel.findOne({token:userJwtToken})

    if(existingBlockedJwt){
        return res.send({status:"failed", msg:"This jwt is blocked"})
    }else{ 
        next()
    }


}





export default isLoggedIn;
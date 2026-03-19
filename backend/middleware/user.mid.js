import { config } from "dotenv";
import jwt from "jsonwebtoken";

function userMiddleware (req,res,next){
     
    const authHeader =req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer")){
        return res.status(401).json({errors:"no token provided"})
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded =jwt.verify( token,process.env.JWT_USER_PASSWORD)
        console.log(decoded);
        req.userId =decoded.id
        next()
        
    } catch (error) {
        res.status(500).json({errors:"inavlid token or expired token"})
        console.log("inavlid token or expired token")
        
    }
}

export default userMiddleware
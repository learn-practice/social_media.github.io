import jwt from 'jsonwebtoken'
const generateTokenAndSetCookies = (userId,res)=>{
const token = jwt.sign({userId},process.env.JWT_SECRET,{
    expiresIn:'15d'
})
res.cookie("jwt",token,{
    httpOnly:true,//more secure
    maxAge:15*24*60*60*1000,//15days
    sameSize:"strict",//csrf
})
return token;
}
export default generateTokenAndSetCookies;
const { isTokenIncluded, getAccessToken } = require("../../helpers/authorization/tokenHelper");
const customError = require("../../helpers/error/CustomError");
const jwt = require("jsonwebtoken"); 
const asyncErrorWrapper = require("express-async-handler");

const getAccess = asyncErrorWrapper(async (req, res, next)=>{

    const {JWT_SECRET_KEY} = process.env;

    
    if(!isTokenIncluded(req)) return next(new customError("You are not authorized", 401));

    const accessToken = getAccessToken(req);
    
    jwt.verify(accessToken, JWT_SECRET_KEY, (err, decoded)=>{
        if(err) return next(new customError("You re not authorized. Token Expired", 401));

        
        req.user = {
            id : decoded.id,
            username : decoded.username,
        }
        return next();
    });
});

module.exports = {
    getAccess,
};
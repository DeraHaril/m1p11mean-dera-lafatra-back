const jwt = require('jsonwebtoken');

const verifictionToken = (req,res,next) => {
    let token = req.headers.authorization;
    if(!token){
        return res.status(401).json({ message:"utilisateur non connecté, aucun token trouvé"});
    } 
    key = process.env.TOKEN_KEY;
    token = token.replace("Bearer ", "");

    jwt.verify(token, key, (err, decoded) => {
        if(err){
            return res.status(401).json({ message:"utilisateur non connecté, token invalide"});
        }
        req.user = decoded;
        next();
    });
};

const isAdmin = (req, res, next) => {
    if(req.user.role =='administrateur'){
        next();
    } else {
        return res.status(401).json({ message:"accès non autorisé, uniquement aux administrateurs"});
    }
};



module.exports = {
    verifictionToken, isAdmin
}
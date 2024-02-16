const jwt = require('jsonwebtoken');

const verifictionToken = (req,res,next) => {
    const token = req.headers.authorization;
    if(!token){
        return res.status(401).json({ message:"utilisateur non connecté, aucun token trouvé"});
    } 
    clé = process.env.TOKEN_KEY;
    jwt.verify(token, clé, (err, decoded) => {
        if(err){
            return res.status(401).json({ message:"utilisateur non connecté, token invalide"});
        }
        req.user = decoded;
        console.log(req.user);
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
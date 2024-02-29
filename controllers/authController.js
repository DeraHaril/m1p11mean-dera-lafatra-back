const jwt = require('jsonwebtoken');
const secretKey = process.env.TOKEN_KEY || 'clé_secrète_par_défaut';
const bcrypt = require('bcrypt');
const {ObjectId} = require("mongodb");
const {collections} = require("../database");

const getCurrentUser = async (req, res) => {
    try {
        const user = await collections.users.findOne({_id: new ObjectId(req.user.userId)});

        if (user) {
            res.json(user);
        } else {
            res.status(401).json({message: "Information de l'utilisateur avec le token renseigné non trouvé"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

const login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await collections.users.findOne({email: email});
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                const token = jwt.sign({userId: user._id, role: user.role}, secretKey, {expiresIn: '2h'});
                res.json({token: token});
            } else {
                res.status(401).json({message: "Mot de passe incorrecte"});
            }
        } else {
            res.status(401).json({message: "Adresse email non trouvé"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { getUserByToken: getCurrentUser, login}

const jwt = require('jsonwebtoken');
const secretKey = process.env.TOKEN_KEY || 'clé_secrète_par_défaut';
const {collections} = require("../database");
const {hashPassword} = require("../services/bcryptService");

module.exports = {
    list: async (req, res) => {
        try {
            const data = await collections.users.find().toArray();
            if (data.length > 0) {
                res.json(data);
            } else {
                res.json([])
            }
        } catch (error) {
            console.error(error);
            throw new Error("Erreur lors de la récupération des utilisateurs");
        }
    },
    create: async (req, res) => {
        const nom = req.body.nom;
        const prenom = req.body.prenom;
        const email = req.body.email;
        let password = req.body.password;
        const role = req.body.role;

        if (!password) {
            password = process.env.DEFAULT_PASSWORD || '!pa$$word'
        }

        try {
            const hashedPassword = await hashPassword(password);

            await collections.users.insertOne({
                nom: nom,
                prenom: prenom,
                email: email,
                password: hashedPassword,
                role: role
            });

            //Connexion de l'user apres inscription
            const userInscrit = await collections.users.findOne({email: email});
            const token = jwt.sign({
                userId: userInscrit._id,
                userInscrit: userInscrit.role
            }, secretKey, {expiresIn: '1h'});

            res.status(201).header('Authorization', `Bearer ${token}`).json({
                success: true,
                message: 'Inscription terminée avec succès'
            });

        } catch (error) {
            console.error(error);
            res.status(400).json({success: false, message: "Erreur de traitement d'inscription", error});
        }
    },
}

const jwt = require('jsonwebtoken');
const secretKey = process.env.TOKEN_KEY || 'clé_secrète_par_défaut';
const bcrypt = require('bcrypt');

module.exports = (userCollection) =>{
    const hashPassword = async (password) => {
        try {
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
    
            const hashedPassword = await bcrypt.hash(password, salt);
            return hashedPassword;
        } catch (error) {
            console.error(error);
            throw new Error('Erreur lors du hachage du mot de passe');
        }
    };        

    const getAllClient = () =>{
        const user = userCollection.find().toArray();
        return user;            
    };

    const getUserByEmail = (email) => {
        try{
            const user = userCollection.findOne({ email: email});
            if(user){
                return user;  
            }            
        } catch(error){
            console.error(error);
            return false;
        }
                   
    };
    
    createUser = async(nom, prenom, email, password, role) => {
        try{
            if(role == "client"){
                await userCollection.insertOne({nom: nom, prenom: prenom, email: email,password: password, role: role,point_fidelite: 0});                   
            } else{
                await userCollection.insertOne({nom: nom, prenom: prenom, email: email,password: password, role: role});
            }
            return true; 
        } catch(error){
            console.error(error);
            return false;
        }
    };
    return{
        traitementConnexionUser: async (req, res, next) => {
            const email = req.body.email;
            const password = req.body.password;
            try {
                const user = await getUserByEmail(email);
                if (user) {
                    const passwordMatch = await bcrypt.compare(password, user.password);
                    if (passwordMatch) {
                        const token = jwt.sign({ userId: user._id, role: user.role }, secretKey, { expiresIn: '1h' });
                        res.status(200).json({ success: true, message: 'Connexion réussie',token });
                    } else {
                        res.json({ success: false, message: "mot de passe incorrecte" });
                    }
                } else {
                    res.json({ success: false, message: "cet email est invalide" });
                }
            } catch (error) {
                console.error(error);
                res.status(500).send('Internal Server Error');
            }
        },

        traitementInscription: async(req,res) =>{
            const nom = req.body.nom;
            const prenom = req.body.prenom;
            const email = req.body.email;
            const password = req.body.password;
            const password_verification = req.body.password_verification;
            const role = req.body.role;
        
            if(password === password_verification){
              try{
                const hashedPassword = await hashPassword(password);
                const ajoutUser = await createUser(nom,prenom,email, hashedPassword, role); 
                if(ajoutUser){
                    //Connexion de l'user apres inscription
                    const userInscrit = await getUserByEmail(email);
                    const token = jwt.sign({ userId: userInscrit._id, userInscrit: userInscrit.role}, secretKey, { expiresIn: '1h' });
                    res.status(201).json({ success: true, message: 'Inscription terminée avec succès', token});                    
                } else{
                    res.status(500).json({ success: false, message: 'Inscription dans la base échouée'});     
                }
              } catch(error){
                console.error(error);
                res.status(500).json({success: false, message:"Erreur de traitement d'inscription"});
              }
            }
            else{
              res.status(400).json({ success: false, message: 'mot de passe et vérification du mot de passe non identique' })
            }
        },

    };
}

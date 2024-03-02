const {collections} = require("../database");
const {hashPassword} = require("../services/bcryptService");
const {ObjectId} = require("mongodb");

const ajoutColonnePreference = async (id) => {
    try {
        const colonnePreference = 'preference';
        const colonne_id_employe = 'id_employe';
        const colonne_id_service = 'id_service';

        const addColonnePreference = await collections.users.updateOne(
            {
                _id: new ObjectId(id)
            },
            {
                $set: {
                    [colonnePreference]: {
                        [colonne_id_employe]: [],
                        [colonne_id_service]: []
                    }
                }
            }
        );

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};


const ajoutServicePrefere = async(id, id_service) =>{
    try{
        const colonnePreference = 'preference';
        const colonne_id_service = 'id_service';
        
        const updateResult = await collections.users.updateOne(
            {
                _id: new ObjectId(id)
            },
            {
                $addToSet: {
                    [`${colonnePreference}.${colonne_id_service}`]: id_service !== null ? new ObjectId(id_service) : null
                }
            }
        );
        console.log(updateResult.modifiedCount > 0);
        return true;

    } catch (error) {
        console.error(error);
        return false;
    }
};

const ajoutEmployePrefere = async(id, id_employe) =>{
    try{
        const colonnePreference = 'preference';
        const colonne_id_employe = 'id_employe';
        
        const updateResult = await collections.users.updateOne(
            {
                _id: new ObjectId(id)
            },
            {
                $addToSet: {
                    [`${colonnePreference}.${colonne_id_employe}`]: id_employe !== null ? new ObjectId(id_employe) : null,
                }
            }
        );
        console.log(updateResult.modifiedCount > 0);
        return true;

    } catch (error) {
        console.error(error);
        return false;
    }
};

const getUserById = async(id) =>{
    try{
        const user = await collections.users.findOne({ _id: new ObjectId(id)});
        return user;
    } catch(error){
        console.error(error);
        return null;
    }
};

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
            res.status(500).json({message: error.message});
        }
    },
    item: async (req, res) => {
        try {
            const item = await collections.users.findOne({_id: new ObjectId(req.params.id)});
            if (item){
                res.json(item);
            }else{
                res.status(404).json({message: "Element non trouvé"})
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({message: error.message});
        }
    },
    suppr: async (req, res) => {
        try {
            const id = req?.params?.id
            const result = await collections.users.deleteOne({ _id: new ObjectId(id) });

            if (result && result.deletedCount) {
                res.status(202).json({message: "Element supprimer"});
            } else if (!result) {
                res.status(400).json({message: `Failed to remove object with: ID ${id}`});
            } else if (!result.deletedCount) {
                res.status(404).json({message: `Failed to find object with: ID ${id}`});
            }
        } catch (error) {
            console.error(error.message);
            res.status(400).json({message: error.message});
        }
    },
    create: async (req, res) => {
        const nom = req.body.nom;
        const prenom = req.body.prenom;
        const email = req.body.email;
        let password = req.body.password;
        const role = req.body.role;

        if (!password) {
            password = process.env.DEFAULT_PASSWORD || 'Pa$$word!'
        }

        try {
            const hashedPassword = await hashPassword(password);

            const result = await collections.users.insertOne({
                nom: nom,
                prenom: prenom,
                email: email,
                password: hashedPassword,
                role: role
            });

            if (result.acknowledged) {
                const item = await collections.users.findOne({_id: new ObjectId(result.insertedId)});
                if (item){
                    res.status(201).json(item);
                }else{
                    res.status(404).json({message: "Element non trouvé"})
                }
            } else {
                res.status(500).send("Failed to create a new employee.");
            }
        } catch (error) {
            console.error(error);
            res.status(400).json({success: false, message: "Erreur de traitement d'inscription", error});
        }
    },
    update: async (req, res) => {
        try {
            const id = req?.params?.id;
            const user = req.body;
            const query = { _id: new ObjectId(id) };
            const result = await collections.users.updateOne(query, { $set: user });

            if (result && result.matchedCount) {
                const item = await collections.users.findOne(query);
                if (item){
                    res.status(200).json(item);
                }else{
                    res.status(404).json({message: `Failed to find object with: ID ${id}`});
                }
            } else if (!result.matchedCount) {
                res.status(404).json({message: `Failed to find object with: ID ${id}`});
            } else {
                res.status(304).json({message: `Failed to update an object: ID ${id}`});
            }
        } catch (error) {
            console.error(error.message);
            res.status(400).send(error.message);
        }
    },
    
    addPreference: async(req,res) =>{
        try{
            const id = req.params.id;
            const id_employePrefere = req.body.id_employe;
            const id_servicePrefere = req.body.id_service;

            const user = await getUserById(id);
            if(user.preference == undefined){
                const ajoutColonnePref = await ajoutColonnePreference(id);
            }
            if(id_employePrefere != undefined){
                const addEmployePreference = await ajoutEmployePrefere(id,id_employePrefere);
            }
            if(id_servicePrefere != undefined){
                const addservicePreference = await ajoutServicePrefere(id,id_employePrefere);
            }
            res.status(201).json({success:true, message:"préférence ajoutée"});
        }catch(error){
            console.error(error);
            res.status(500).json({success:false, message:"erruer interne", error: error.message });
        }

    }
}

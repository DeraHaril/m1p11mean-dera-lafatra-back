const {collections} = require("../database");
const {hashPassword} = require("../services/bcryptService");
const {ObjectId} = require("mongodb");

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
            password = process.env.DEFAULT_PASSWORD || '!Pa$$word'
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
    }
}

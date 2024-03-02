const {ObjectId} = require('mongodb');
const {collections} = require("../database");

const getByName = async (name) => {
    try {
        return await collections.depenses.findOne({nom: name});
    } catch (error) {
        console.error(error);
        throw new Error("Erreur lors de la récupération du service par nom");
    }
};

const getById = async (id) => {
    try {
        return await collections.depenses.findOne({_id: id});
    } catch (error) {
        console.error(error);
        throw new Error("Erreur lors de la récupération du service par id");
    }
};

const ajout = async (nom, montant, date) => {
    try {
        await collections.services.insertOne({
            nom,
            montant,
            date: new Date(date),
        });

        return true;
    } catch (error) {
        console.error(error);
        return false
    }
}

update = async (id, nom, montant, date) => {
    try {
        const result = await collections.services.updateOne(
            {_id: id},
            {
                $set: {
                    nom,
                    montant,
                    date: new Date(date)
                }
            });
        return result.matchedCount > 0 && result.modifiedCount > 0;
    } catch (error) {
        console.error(error);
        return false;
    }
};

module.exports = {
    list: async (req, res) => {
        try {
            const data = await collections.depenses.find().toArray();
            if (data.length > 0) {
                res.json(data);
            } else {
                res.status(204).json([])
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Erreur lors de la récupération de tous les services"});
        }
    },

    item: async (req, res) => {
        try {
            const id = req?.params?.id
            const item = await getById(new ObjectId(id) );
            if (item) {
                res.json(item);
            } else {
                res.status(404).json([])
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Erreur lors de la récupération de tous les services"});
        }
    },

    suppression: async (req, res) => {
        try {
            const id = req?.params?.id
            const result = await collections.depenses.deleteOne({ _id: new ObjectId(id) });

            if (result && result.deletedCount) {
                res.status(202).json({message: "Element supprimé"});
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

    ajout: async (req, res) => {
        const nom = req.body.nom;
        const montant = req.body.montant;
        const date = req.body.date;

        if (nom && montant && date) {
            const depense = await ajout(nom, parseInt(montant), date);
            if (depense) {
                res.status(201).json({success: true, message: 'service ajouté avec succès'});
            } else {
                res.status(400).json({success: false, message: "erreur lors de l'ajout de service"});
            }
        } else {
            res.status(400).json({success: false, message: "les données reçues sont manquantes"});
        }
    },

    maj: async (req, res) => {
        const id = req.params.id;
        const nom = req.body.nom;
        const montant = req.body.montant;
        const date = req.body.date;

        if (id) {
            try {
                const item = await update(new ObjectId(id), nom, parseInt(montant), date);

                if (item) {
                    res.status(201).json({success: true, message: "Tarif mis a jour avec succès"});
                } else {
                    res.status(400).json({success: false, message: "Tarif non mis a jour"});
                }

            } catch (error) {
                console.error(error);
            }
        } else {
            res.status(400).json({success: false, message: "les données reçues sont manquantes"});
        }
    }
}
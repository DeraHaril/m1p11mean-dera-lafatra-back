const {ObjectId} = require('mongodb');
const {collections} = require("../database");

const getServiceByName = async (serviceName) => {
    try {
        return await collections.services.findOne({service: serviceName});
    } catch (error) {
        console.error(error);
        throw new Error("Erreur lors de la récupération du service par nom");
    }
};

const getServiceAvecPromotion = async() => {
    try{
        const data = await collections.services.aggregate([
            {
                $lookup: {
                  from: "offre_special",
                  localField: "_id",
                  foreignField: "id_service",
                  as: "offre_speciale"
                }
            },
            {
                $unwind: {
                    path: "$offre_speciale",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    service: 1,
                    tarif: 1,
                    commission: 1,
                    offre_speciale: {
                        $cond: {
                        if: {
                            $and: [
                            { $gt: ["$offre_speciale.date_fin",new Date()] }, //greater(ilay offre spéciial mbol date ao arinan'ny date actuelle)
                            ]
                        },
                        then: {
                            _id: "$offre_speciale._id",
                            promotion: "$offre_speciale.promotion",
                            date_ajout: "$offre_speciale.date_ajout",
                            date_fin: "$offre_speciale.date_fin"
                        },
                            else: null
                        }
                    }
                }
            }
        ]);
        return data.toArray();
    } catch(error){
        console.error(error.message);
        data = [];
        return data;
    }
}

const getServiceById = async (id) => {
    try {
        return await collections.services.findOne({_id: id});
    } catch (error) {
        console.error(error);
        throw new Error("Erreur lors de la récupération du service par id");
    }
};

const ajoutService = async (service, tarif, duree, commission) => {
    const dateActuelle = new Date().toISOString();
    try {
        await collections.services.insertOne({
            nom: service,
            tarif: tarif,
            duree: duree,
            commission: commission,
            date_ajout: new Date(dateActuelle),
            date_modification: null
        });
        return true;
    } catch (error) {
        console.error(error);
        return false
    }
}

updateService = async (id, nomService, tarif, duree, commission) => {
    const dateActuelle = new Date().toISOString();
    try {
        const result = await collections.services.updateOne(
            {_id: id},
            {
                $set: {
                    nom: nomService,
                    tarif: tarif,
                    duree: duree,
                    commission: commission,
                    date_modification: dateActuelle
                }
            });
        if (result.matchedCount > 0 && result.modifiedCount > 0) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
};

module.exports = {
    listeService: async (req, res) => {
        try {
            const serviceList = await collections.services.find().toArray();
            if (serviceList.length > 0) {
                res.json(serviceList);
            } else {
                res.status(204).json([])
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Erreur lors de la récupération de tous les services"});
        }
    },
    listeServicePromotion: async(req,res) =>{
        try {
            const serviceListAvecPromotion = await getServiceAvecPromotion();
            if (serviceListAvecPromotion.length > 0) {
                res.status(200).json({success:true, data:serviceListAvecPromotion});
            } else {
                res.status(204).json([])
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Erreur lors de la récupération de tous les services"});
        }
    },

    suppressionService: async (req, res) => {
        try {
            const id = req?.params?.id
            const result = await collections.services.deleteOne({ _id: new ObjectId(id) });

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
    ajoutService: async (req, res) => {
        const service = req.body.service;
        const tarif = req.body.tarif;
        const duree = req.body.duree;
        const commission = req.body.commission;

        const dateActuelle = new Date().toISOString();
        if (service && tarif && duree) {
            tarifInt = parseInt(tarif);
            const creationService = await ajoutService(service, tarifInt, duree, commission);
            if (creationService) {
                res.status(201).json({success: true, message: 'service ajouté avec succès'});
            } else {
                res.status(400).json({success: false, message: "erreur lors de l'ajout de service"});
            }
        } else {
            res.status(400).json({success: false, message: "les données reçues sont manquantes"});
        }
    },

    majService: async (req, res) => {
        const id = req.params.id;
        const nomService = req.body.service;
        const tarif = req.body.tarif;
        const duree = req.body.duree;
        const commission = req.body.commission;

        if (id && tarif) {
            const idservice = new ObjectId(id);
            const tarifService = parseInt(tarif);
            try {
                const update = await updateService(idservice, nomService, tarifService, duree, commission);
                console.log(update);
                if (update) {
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
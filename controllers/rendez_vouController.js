const {ObjectId} = require('mongodb');
const {collections} = require("../database");
const insertRendez_vous = async (date, id_service, id_client, id_employe) => {
    try {
        const dateActuelle = new Date().toISOString();
        const insertRDV = await collections.rdvs.insertOne({
            date_rdv: new Date(date),
            id_service: new ObjectId(id_service),
            id_client: new ObjectId(id_client),
            id_employe: id_employe,
            effectue: false,
            date_ajout: new Date(dateActuelle)
        });
        //console.log(insertRDV);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

const getAllRendez_vous = async () => {
    try {
        const allRDV = await collections.rdvs.aggregate([
            {
                $lookup: {
                    from: 'user',
                    localField: 'id_client',
                    foreignField: '_id',
                    as: 'client'
                }
            },
            {
                $lookup: {
                    from: 'user',
                    localField: 'id_employe',
                    foreignField: '_id',
                    as: 'employe'
                }
            },
            {
                $lookup: {
                    from: 'service',
                    localField: 'id_service',
                    foreignField: '_id',
                    as: 'service'
                }
            },
            {
                $unwind: '$client'
            },
            {
                $unwind: '$employe'
            },
            {
                $unwind: '$service'
            },
            {
                $project: {
                    id: 1,
                    date_rdv: 1,
                    id_client: '$client.id',
                    nom_client: '$client.nom',
                    email_client: '$client.email',
                    id_service: '$service.id',
                    nom_service: '$service.nom',
                    tarif: '$service.tarif',
                    duree: '$service.duree',
                    id_employe: '$employe.id',
                    effectue: 1
                }
            }

        ]);
        const AllRDVArray = await allRDV.toArray();
        console.log(AllRDVArray)
        return AllRDVArray;
    } catch (error) {
        console.error(error);
        allRDV = [];
        return allRDV;
    }
}

const getRealizedRendez_vous = async (realized) => {
    try {
        const allRDV = await collections.rdvs.aggregate([
            {
                $match: {
                    effectue: realized
                }
            },
            {
                $lookup: {
                    from: 'user',
                    localField: 'id_client',
                    foreignField: '_id',
                    as: 'client'
                }
            },
            {
                $lookup: {
                    from: 'user',
                    localField: 'id_employe',
                    foreignField: '_id',
                    as: 'employe'
                }
            },
            {
                $lookup: {
                    from: 'service',
                    localField: 'id_service',
                    foreignField: '_id',
                    as: 'service'
                }
            },
            {
                $unwind: '$client'
            },
            {
                $unwind: '$employe'
            },
            {
                $unwind: '$service'
            },
            {
                $project: {
                    id: 1,
                    date_rdv: 1,
                    id_client: '$client.id',
                    nom_client: '$client.nom',
                    email_client: '$client.email',
                    id_service: '$service.id',
                    nom_service: '$service.nom',
                    tarif: '$service.tarif',
                    duree: '$service.duree',
                    id_employe: '$employe.id',
                    effectue: 1
                }
            }
        ]);

        return await allRDV.toArray();
    } catch (error) {
        console.error(error);
        allRDV = [];
        return allRDV;
    }
}

module.exports = {
    listeRendez_vous: async (req, res) => {
        try {
            const liste_rdv = await getAllRendez_vous();
            //console.log(liste_rdv);
            if (liste_rdv.length > 0) {
                res.status(200).json({success: true, message: "Rendez-vous envoyés", data: liste_rdv});
            } else {
                res.status(200).json({success: true, message: "Aucun rendez-vous enregistré dans la base"});
            }
        } catch (error) {
            console.error(error);
            res.status(400).json({success: false, message: 'Erreur interne'});
        }
    },
    listeRendez_vousEffectue: async (req, res) => {
        try {
            const liste_rdv = await getRealizedRendez_vous(true);
            console.log(liste_rdv.length);
            if (liste_rdv.length > 0) {
                res.status(200).json({success: true, message: "Rendez-vous envoyés", data: liste_rdv});
            } else {
                res.status(200).json({success: true, message: "Aucun rendez-vous déjà effectué"});
            }
        } catch (error) {
            console.error(error);
            res.status(400).json({success: false, message: 'Erreur interne'});
        }
    },

    ajoutRendez_vous: async (req, res) => {
        const date = req.body.date;
        const id_service = req.body.id_service;
        const id_client = req.body.id_client;
        var id_employe = req.body.id_employe;
        const dateActuelle = new Date();
        console.log(id_employe);
        if (date <= dateActuelle.toISOString()) {
            res.status(400).json({
                success: false,
                message: "La date de rendez-vous ne doit pas précéder la date à laquelle vous avez ajouté le rendez-vous"
            });
        }
        try {
            let ajoutRDV = null;
            if (id_employe == null) {
                ajoutRDV = await insertRendez_vous(date, id_service, id_client, id_employe);
            } else {
                ajoutRDV = await insertRendez_vous(date, id_service, id_client, new ObjectId(id_employe));
            }
            if (ajoutRDV) {
                res.status(201).json({
                    success: true,
                    message: 'Rendez-vous ajouté avec succès',
                    insertedId: ajoutRDV.insertedId
                });
            } else {
                res.status(400).json({success: false, message: "Erreur lors de l'insertion dans la base"});
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({success: false, message: "Erreur interne"});
        }
    }
}
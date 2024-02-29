const {ObjectId} = require('mongodb');
const {collections} = require("../database");
const rdvController = require('./rendez_vouController');

const insertTache = async(id_service, id_client, id_employe, montant, carte_paiement,id_rdvs) => {
    try{
        const dateActuelle = new Date().toISOString();
        await collections.taches.insertOne({
            id_service: new ObjectId(id_service),
            id_client: new ObjectId(id_client),
            id_employe: new ObjectId(id_employe),
            montant: montant,
            carte_paiement: carte_paiement,
            date_tache: new Date(dateActuelle),
            id_rdvs: id_rdvs ? new ObjectId(id_rdvs) : null
        });
        return true;
    } catch(error){
        console.error(error.message);
        return false;
    }
};

const getAllTasks = async() => {
    try{
        const data = await collections.taches.aggregate([
            {
                $lookup: {
                    from: 'user',
                    localField: 'id_client',
                    foreignField: '_id',
                    as: 'client'
                }
            },
            {
              $unwind: {
                  path: '$client',
                  preserveNullAndEmptyArrays: true
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
                $unwind: {
                    path: '$employe',
                    preserveNullAndEmptyArrays: true
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
                $unwind: {
                  path: '$service',
                  preserveNullAndEmptyArrays: true
              }
            },
            {
                $project: {
                    _id: 1,
                    id_service: 1,
                    nom_service: '$service.nom',
                    client: {
                        id_client: 1,
                        nom: '$client.nom',
                        prenom: '$client.prenom',
                        email: '$client.email',
                    },
                    employe: {
                        id_employe: 1,
                        nom: '$employe.nom',
                        prenom: '$employe.prenom',
                        email: '$employe.email',
                    },
                    montant: 1,
                    carte_paiement: 1,
                    date_tache:1,
                    id_rdvs:1
                }
            }
        ]);
        console.log(data.toArray());
        return data.toArray();
    } catch(error){
        console.error(error);
        return data=[];
    }
}

module.exports ={
    ajoutTache: async(req,res) => {
        const {id_service, id_client, id_employe, montant, carte_paiement,id_rdvs} = req.body;
        //console.log(id_rdvs);
        try{
            const insert = await insertTache(id_service, id_client, id_employe, montant, carte_paiement,id_rdvs);
            if(id_rdvs != null){
                const majrdv = await rdvController.updateRdvDone(id_rdvs);
                if(majrdv){
                    console.log("rdv mis a jour");
                }
                else{
                    console.log("rdv non mis a jour");
                }
            }
            if(insert){
                res.status(201).json({success: true, message:"Ajout de tache réussi"});
            } else{
                res.status(400).json({success: true, message:"Ajout de tache à la base échoué"});
            }
        } catch(error){
            console.error(error);
            res.status(500).json({success: true, message:"erreur interne", error: error.message});
        }
    },

    listeTache: async(req,res) =>{
        try{
            const data = await getAllTasks();
            if(data.length > 0){
                res.status(200).json({ success: true, message: data.length+" tache(s) enregistrée(s)", data: data});
            } else if(data.length == 0){
                res.status(200).json({ success: true, message:" aucune tache enregistrée"});
            } 
        } catch(error){
            console.error(error);
            res.status(500).json({ success: false, message:"erreur interne", error: error.message});
        }
    }

}
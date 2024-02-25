const { ObjectId } = require('mongodb');
const {collections} = require("../database");

module.exports = () => {
    const serviceCollection = collections.services

    const getServiceByName = async (serviceName) => {
        try {
            return await serviceCollection.findOne({service: serviceName});
        } catch (error) {
            console.error(error);
            throw new Error("Erreur lors de la récupération du service par nom");
        }
    };

    const getServiceById = async (id) => {
        try {
            const service = await serviceCollection.findOne({ _id: id });
            return service;
        } catch (error) {
            console.error(error);
            throw new Error("Erreur lors de la récupération du service par id");
        }
    };

    const ajoutService = async(service, tarif, duree, commission) => {
        const dateActuelle = new Date().toISOString();
        try{
            await serviceCollection.insertOne({
                service: service,
                tarif: tarif,
                duree:duree,
                commission:commission,
                date_ajout: dateActuelle,
                date_modification: null
            });
            return true;
        }catch(error){
            console.error(error);
            return false
        }
    }

    updateService = async(id, nomService, tarif, duree, commission) => {
        const dateActuelle = new Date().toISOString();
        try{
            const result = await serviceCollection.updateOne(
                { _id: id },
                {
                    $set: {
                        service: nomService,
                        tarif: tarif,
                        duree: duree,
                        commission:commission,
                        date_modification: dateActuelle
                    }
                });
            if (result.matchedCount > 0 && result.modifiedCount > 0) {
                return true;
            } else {
                return false;
            }
        } catch(error){
            console.error(error);
            return false;
        }
    };

    return{
        listeService: async(req, res) =>{
            try{
                const serviceList = await serviceCollection.find().toArray();
                if(serviceList.length > 0){
                    res.json(serviceList);
                } else{
                    res.status(204).json([])
                }
            } catch(error){
                console.error(error);
                res.status(500).json({ message: "Erreur lors de la récupération de tous les services"});
            }
        },

        ajoutService: async (req, res) =>{
            const service = req.body.service;
            const tarif = req.body.tarif;
            const duree = req.body.duree;
            const commission = req.body.commission;

            const dateActuelle = new Date().toISOString();
            if(service && tarif && duree){
                tarifInt = parseInt(tarif);
                const creationService = await ajoutService(service, tarifInt,duree, commission);
                if(creationService){
                    res.status(201).json({ success: true, message:'service ajouté avec succès'});  
                } else{
                    res.status(400).json({ success: false, message:"erreur lors de l'ajout de service"});
                }
            } else {
                res.status(400).json({ success: false, message:"les données reçues sont manquantes"});
            }
        },

        majService: async(req,res) => {
            const id = req.params.id;
            const nomService = req.body.service;
            const tarif = req.body.tarif;
            const duree = req.body.duree;
            const commission = req.body.commission;

            if(id && tarif){
                const idservice = new ObjectId(id);
                const tarifService = parseInt(tarif);
                try{
                    const update = await updateService(idservice, nomService, tarifService, duree, commission);
                    console.log(update);
                    if(update){
                        res.status(201).json({ success: true, message:"Tarif mis a jour avec succès"});
                    } else{
                        res.status(400).json({ success: false, message:"Tarif non mis a jour"});
                    }
                    
                } catch(error){
                    console.error(error);
                }
            } else{
                res.status(400).json({ success: false, message:"les données reçues sont manquantes"});
            }
        }
    }
}
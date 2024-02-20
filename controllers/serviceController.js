const { ObjectId } = require('mongodb');

module.exports = (serviceCollection) => {
    getServiceByName= async (serviceName) => {
        try {
            const service = await serviceCollection.findOne({ service: serviceName });
            return service;
        } catch (error) {
            console.error(error);
            throw new Error("Erreur lors de la récupération du service par nom");
        }
    };
    getServiceById = async (id) => {
        try {
            const service = await serviceCollection.findOne({ _id: id });
            return service;
        } catch (error) {
            console.error(error);
            throw new Error("Erreur lors de la récupération du service par id");
        }
    };

    updateService = async(id, nomService, tarif, duree) => {
        try{
            const result = await serviceCollection.updateOne(
                { _id: id },
                {
                    $set: {
                        service: nomService,
                        tarif: tarif,
                        duree: duree
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
        listeService: async(req,res) =>{
            try{
                const serviceList = await serviceCollection.find().toArray();
                if(serviceList.length > 0){
                    res.json(serviceList);
                } else{
                    res.json([])
                }
            } catch(error){
                console.error(error);
                throw new Error("Erreur lors de la récupération de tous les services");
            }
        },

        ajoutService: async (req, res) =>{
            const service = req.body.service;
            const tarif = req.body.tarif;
            const duree = req.body.duree;
            
            if(service && tarif && duree){
                tarifInt = parseInt(tarif);
                try{    
                    const creationService = await serviceCollection.insertOne({ service: service, tarif: tarifInt, duree:duree });
                    res.status(201).json({ success: true, message:'service ajouté avec succès'});  
                } catch(error){
                    console.error(error);
                    res.status(400).json({ success: false, message:"erreur lors de l'ajput de service"});
                }
            } else {
                res.status(400).json({ success: false, message:"les données reçues sont manquantes"});
            }
        },

        majService: async(req,res) => {
            const id = req.body.id;
            const nomService = req.body.service;
            const tarif = req.body.tarif;
            const duree = req.body.duree;

            if(id && tarif){
                const idservice = new ObjectId(id);
                const tarifService = parseInt(tarif);
                try{
                    const update = await updateService(idservice, nomService, tarifService, duree);
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
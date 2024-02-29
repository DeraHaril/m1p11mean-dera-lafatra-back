const {ObjectId} = require('mongodb');
const {collections} = require("../database");

const insertOffreSpecial= async(id_service, promotion, date_fin) => {
    try{
        const dateActuelle = new Date().toISOString();
        await collections.offre_special.insertOne({
            id_service: new ObjectId(id_service),
            promotion: promotion,
            date_ajout: new Date(dateActuelle),
            date_fin: new Date(date_fin)
        });
        return true;
    } catch(error){
        console.error(error.message);
        return false;
    }
};

const getAllOffreNotExpired = async() => {
    try{
        const data = await collections.offre_special.aggregate([
            {
                $match: {
                    date_fin: { $gt: new Date() }
                }
            },
            {
                $lookup:{
                    from:"service",
                    localField: 'id_service',
                    foreignField: '_id',
                    as:'service'
                }
            },
            {
                $unwind: {
                    path: "$service",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project:{
                    _id: 1,
                    promotion:1,
                    date_ajout:1, 
                    date_fin:1,
                    id_service: '$service._id',
                    nom_service: '$service.service',
                    tarif_normal: '$service.tarif',
                }
            }
        ]);
    } catch(error){
        console.error(error.message);
        data = [];
        return data;
    }
}


module.exports = {
    getAllOffre: async(req, res) => {
        try{
            const data = await collections.offre_special.find().toArray();
            if(data.length > 0){
                res.status(200).json({success:true, data:data});
            } else {
                res.status(200).json({success:true, message:"aucune donnée enregistrée",data:[]});
            }
        } catch(error){
            console.error(error.message);
            res.status(500).json({success:false, message:error.message});
        }
    },

    getSpecificOffre: async(req,res) => {
        const id = req.params.id;
        try{
            const data = await collections.offre_special.findOne({_id: new ObjectId(id)});
            if(data){
                res.status(200).json({success:true, data:data});
            } else {
                res.status(200).json({success:true, message:"aucune donnée trouvée"});
            }
        } catch(error){
            console.error(error.message);
            res.status(500).json({success:false, message:error.message});
        }
    },

    getOffreNotExpired: async(req,res) => {
        try{
            const data = await getAllOffreNotExpired().toArray();
            if(data.length > 0){
                res.status(200).json({success:true, message: data.length+' offre(s) spéciale(s) disponible(s)', data:data});
            } else{
                res.status(200).json({success:true, message:'aucune offre sspécial disponible',data: []});
            }
        } catch(error){
            console.error(error.message);
            res.status(500).json({success:false, message:error.message});
        }
    },
    
    createOffre: async(req, res) => {
        const { id_service, promotion, date_fin} = req.body;
        try{
            const ajoutOffre = insertOffreSpecial(id_service, promotion,date_fin);
            if(ajoutOffre){
                res.status(201).json({success:true, message:"Ajout d'offre spécial avec succès"});
            } else{
                res.status(400).json({ success:false, message:"ajout d'offre spécial à la base échouée"});
            }
        } catch(error){
            console.error(error.message);
            res.status(500).json({ success:false, message:"création d'offre échouée"})
        }
    },

    updateOffre: async(req,res) => {
        const id = req?.params?.id;
        const offre = req.body;
        try{
            const query = {_id: new ObjectId(id)};
            const result = collections.offre_special.upddateOne(query, { $set: offre});
            if(result && result.matchedCount){
                res.status(200).json({success:true, message:"mise a jour avec succès"});
            } else{
                res.status(304).json({success:false, message:"Offre non mis a jour"});
            }

        } catch(error){
            console.error(error.message);
            res.status(500).send(error.message);
        }
    }

}
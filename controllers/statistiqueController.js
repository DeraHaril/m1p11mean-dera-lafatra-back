const {collections} = require("../database");

const getNbRDVParJour = async() =>{
    try{
        const data = await collections.rdvs.aggregate([
            {
                $group: {
                    _id: {
                        day: { $dayOfMonth: "$date_rdv" },
                        month: { $month: "$date_rdv" },
                        year: { $year: "$date_rdv" }
                    },
                    nb_rdv: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: {
                        $dateFromParts: {
                            year: "$_id.year",
                            month: "$_id.month",
                            day: "$_id.day",
                            hour: 0,
                            minute: 0,
                            second: 0,
                            millisecond: 0
                        }
                    },
                    nb_rdv: 1
                }
            },
            {
                $sort: {
                    date: 1
                }
            }
        ]);
        return data.toArray();
    }catch(error){
        console.error(error);
        return false;
    }
};

const getNbRDVParMois = async() =>{
    try{
        const data = await collections.rdvs.aggregate([
            {
                $group: {
                    _id: {
                        month: { $month: "$date_rdv" },
                        year: { $year: "$date_rdv" }
                    },
                    nb_rdv: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: {
                        $dateFromParts: {
                            year: "$_id.year",
                            month: "$_id.month",
                            day: 1,
                            hour: 0,
                            minute: 0,
                            second: 0,
                            millisecond: 0
                        }
                    },
                    nb_rdv: 1
                }
            },
            {
                $sort: {
                    date: 1
                }
            }
        ]);
        return data.toArray();
    }catch(error){
        console.error(error);
        return false;
    }
};

const getChiffreAffaireJour = async() =>{
    try{
        const data = await collections.taches.aggregate([
            {
                $group: {
                    _id: {
                        day: { $dayOfMonth: "$date_tache" },
                        month: { $month: "$date_tache" },
                        year: { $year: "$date_tache" }
                    },
                    chiffreAffaires_jour: { $sum: "$montant" }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: {
                        $dateFromParts: {
                            year: "$_id.year",
                            month: "$_id.month",
                            day: "$_id.day",
                            hour: 0,
                            minute: 0,
                            second: 0,
                            millisecond: 0
                        }
                    },
                    chiffreAffaires_jour: 1
                }
            },
            {
                $sort: {
                    date: 1
                }
            }
            
        ]);
        return data.toArray();
    } catch(error){
        console.error(error);
        return false;
    }
};

const getChiffreAffaireMois = async() =>{
    try{
        const data = await collections.taches.aggregate([
            {
                $group: {
                    _id: {
                        month: { $month: "$date_tache" },
                        year: { $year: "$date_tache" }
                    },
                    chiffreAffaires_jour: { $sum: "$montant" }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: {
                        $dateFromParts: {
                            year: "$_id.year",
                            month: "$_id.month",
                            day: 1,
                            hour: 0,
                            minute: 0,
                            second: 0,
                            millisecond: 0
                        }
                    },
                    chiffreAffaires_jour: 1
                }
            },
            {
                $sort: {
                    date: 1
                }
            } 
        ]);
        return data.toArray();
    } catch(error){
        console.error(error);
        return false;
    }
};

module.exports = {
    nbRDVParJourParMois: async(req,res) =>{
        try{
            const rdv_jour = await getNbRDVParJour();
            const rdv_mois = await getNbRDVParMois();
            if(rdv_jour != false || rdv_mois != false){
                if(rdv_jour.length>0){
                    res.status(200)
                        .json({success:true, 
                            message:"statistique sur nb_rdv/jour ,/mois envoyé", 
                            data:{
                                rdv_jour: rdv_jour,
                                rdv_mois: rdv_mois
                            }}
                        );
                }if(rdv_jour.length == 0){
                    res.status(200).json({success:true, message:"aucune statistique possible à établir, aucun rendez-vous"});
                } 
            }else{
                res.status(500).json({success:false, message:"erreur de requete"});
            } 
        } catch(error){
            console.error(error);
            res.status(500).json({success:false, message:"erreur interne", error: error.message});
        }
    },

    chiffreAffaireParJourParMois: async(req,res) =>{
        try{
            const chiffreAffaire_jour = await getChiffreAffaireJour();
            const chiffreAffaire_mois = await getChiffreAffaireMois();
            if(chiffreAffaire_jour !=false){
                if(chiffreAffaire_jour.length > 0){
                    res.status(200)
                    .json({success:true, 
                        message:"statistique sur chiffre d'affaire par jour, par mois envoyé", 
                        data:{
                            chiffreAffaire_jour: chiffreAffaire_jour,
                            chiffreAffaire_mois: chiffreAffaire_mois
                        }}
                    );
                }
                if(chiffreAffaire_jour.length == 0){
                    res.status(200).json({success:true, message:"aucune statistique possible à établir, aucune tache effectuée"});
                }
            } else{
                res.status(500).json({success:false, message:"erreur de requete"});
            }
        } catch(error){
            console.error(error);
            res.status(500).json({success:false, message:"erreur interne", error: error.message});
        }
    },

    
}
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

module.exports = {
    nbRDVParJour: async(req,res) =>{
        try{
            const data = await getNbRDVParJour();
            if(data.length>0){
                res.status(200).json({success:true, message:"statistique sur nb_rdv/jour envoyé", data:data});
            } else if(data.length == 0){
                res.status(200).json({success:true, message:"aucune statistique possible à établir, aucun rendez-vous"});
            } 
        } catch(error){
            console.error(error);
            res.status(500).json({success:false, message:"erreur interne", error: error.message});
        }
    },
}
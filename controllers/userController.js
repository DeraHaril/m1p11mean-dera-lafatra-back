module.exports = (userCollection) =>{
    return{
        //GET tous les users
        getAllClient: async(req, res) =>{
            try{
                const user = await userCollection.find().toArray();
                return user             
            } catch(error) {
                console.log(error);
                throw new Error('erreur durant la récupération des données')
            }
        },

        getAllEmploye: (req,res) =>{

        },

        getAllAdmin: (req, res) => {

        },

        //GET specific user
        getUserByEmail: async(email) => {
            try{
                const user = await userCollection.findOne({ email: email});
                return user;             
            } catch(error) {
                console.log(error);
                throw new Error('erreur durant la récupération des données')
            }
        },

        getEmployeByEmail: (req, res , email) => {

        },

        getAdminByEmail: (req, res , email) => {

        },

        //CREATE user
        createUser: (nom, prenom, email, password, role) => {
            try{
                if(role == "client"){
                    userCollection.insertOne({nom: nom, prenom: prenom, email: email,password: password, role: role,point_fidelite: 0});                   
                } else{
                    userCollection.insertOne({nom: nom, prenom: prenom, email: email,password: password, role: role});
                }
                console.log("réussi"); 
            } catch(error){
                console.error(error);
                console.log("erreur d'insertion"); 
            }
        },
    };
}
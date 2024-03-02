const { MongoClient } = require('mongodb');

const collections = {};

const connectToDatabase = async () => {
    const {MONGODB_URI: uri, DB_NAME: dbName} = process.env;

    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db(dbName);

    collections.users = db.collection('user');
    collections.services = db.collection('service');
    collections.rdvs = db.collection('rendez_vous');
    collections.offre_special = db.collection('offre_special');
    collections.taches = db.collection('taches');
    collections.depenses = db.collection('depenses');

    console.log(`Connected to Database ${uri} ${dbName}`);
}

module.exports = { connectToDatabase, collections };
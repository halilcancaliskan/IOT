const { MongoClient } = require('mongodb');
// Module qui récupère les arguments de la ligne de commande
const argv = require('yargs').argv;

// Connexion à la base de données MongoDB
const mongoUrl = 'mongodb+srv://hcaliskan:hcaliskan@iot.i2m1jq2.mongodb.net';
const dbName = 'sample_mflix';

let db;
let collection;

MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        console.log('-> Connecté à MongoDB <-');
        db = client.db(dbName);
        collection = db.collection('movies');
        paginateData();
    })
    .catch(error => console.error('Erreur de connexion à MongoDB:', error));

// Fonction pour paginer les données
async function paginateData() {
    try {
        const field = argv._[0]; // Champ sur lequel trier les données, récupérer le premier argument de la ligne de commande
        const pageNumber = parseInt(argv._[1]) || 1; // Numéro de page par défaut, récupérer le deuxième argument de la ligne de commande
        const pageSize = parseInt(argv._[2]) || 10; // Nombre de documents par page par défaut, récupérer le troisième argument de la ligne de commande
        const skip = (pageNumber - 1) * pageSize; // Calcul du nombre de documents à ignorer pour la pagination

        // Requête pour récupérer les données de la collection 'movies', triées par le champ spécifié dans la commande
        const cursor = collection.find({})
            .sort({ [field]: 1 }) // Tri par le champ spécifié (ascendant)
            .skip(skip)
            .limit(pageSize);

        const docs = await cursor.toArray(); // Conversion en tableau
        const totalDocs = await collection.countDocuments({}); // Récupération du nombre total de documents dans la collection
        const hasNextPage = skip + pageSize < totalDocs; // Vérification de la présence d'une page suivante

        // Création de l'objet JSON de réponse
        const result = {
            docs,
            page: pageNumber,
            limit: pageSize,
            totalDocs,
            hasNextPage
        };

        // Affichage du résultat
        console.log(result);
    } catch (error) {
        console.error('Erreur de pagination:', error);
    }
}
const { MongoClient } = require('mongodb');
const argv = require('yargs').argv;

const mongoUrl = 'mongodb+srv://hcaliskan:hcaliskan@iot.i2m1jq2.mongodb.net';
const dbName = 'sample_mflix';

let db;
let collection;

MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        console.log('Connecté à MongoDB');
        db = client.db(dbName);
        collection = db.collection('movies');
        paginateData();
    })
    .catch(error => console.error('Erreur de connexion à MongoDB:', error));

// Fonction pour paginer les données
async function paginateData() {
    try {
        const field = argv._[0]; // Champ sur lequel trier les données
        const pageNumber = parseInt(argv._[1]) || 1; // Numéro de page par défaut
        const pageSize = parseInt(argv._[2]) || 10; // Nombre de documents par page par défaut

        // Calcul du nombre de documents à ignorer pour la pagination
        const skip = (pageNumber - 1) * pageSize;

        // Requête pour récupérer les données de la collection 'movies', triées par le champ spécifié dans la commande
        const cursor = collection.find({})
            .sort({ [field]: 1 }) // Tri par le champ spécifié (ascendant)
            .skip(skip)
            .limit(pageSize);

        // Conversion en tableau
        const docs = await cursor.toArray();

        // Récupération du nombre total de documents dans la collection
        const totalDocs = await collection.countDocuments({});

        // Vérification de la présence d'une page suivante
        const hasNextPage = skip + pageSize < totalDocs;

        // Création de l'objet JSON de réponse
        const result = {
            docs,
            page: pageNumber,
            limit: pageSize,
            totalDocs,
            hasNextPage
        };

        // Affichage ou retour du résultat
        console.log(result);
    } catch (error) {
        console.error('Erreur de pagination:', error);
    }
}
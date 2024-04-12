Projet de pagination de données avec MongoDB
Ce projet est une application Node.js qui utilise MongoDB pour paginer les données d'une collection en fonction des paramètres de pagination fournis par l'utilisateur.

Installez les dépendances nécessaires :
```npm install```

Utilisation
Exécutez l'application en spécifiant les paramètres de pagination dans la ligne de commande. Par exemple :
```node app.js title 5 10 asc```

Dans cet exemple, les données seront paginées par le champ "title", affichant la 5eme page avec 10 documents par page, triés par ordre ascendant.
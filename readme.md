# Step Post

Pour faciliter les taches quotidiennes des nos collaborateus, nous avons créé une application qui permet de rendre le travail des facteurs, le suivi des colis et l'expedition tracable, maintenanble et plus facile

Pour faire fonctionner l'application client :
- ouvrir un terminal et se rendre dans le répertoire : step-post-be
- composer install

intstaller le bundle pour gérer les tokens d'authentification :
- composer require "lexik/jwt-authentication-bundle"

générer les clés :
- symfony console lexik:jwt:generate-keypair

modifier le fichier .env afin de pouvoir créer une base de données vide

créer la base de données :
- symfony console doctrine:database:create

faire les migrations :
- symfony console make:migration
- symfony console doctrine:migrations:migrate

enregistrer des données fictives dans la base de données :
- symfony console doctrine:fixtures:load
- (si ça ne fonctionne pas, installer le bundle fixtures) :
- composer require orm-fixtures

lancer le serveur :
symfony -d serve

aller dans le répertoire step-post-fe 
- npm install
- npm start

logins pour la version dev :

email : tata@toto.fr
password : Abcd@1234

enjoy

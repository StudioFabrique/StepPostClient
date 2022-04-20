<?php

namespace App\DataFixtures;

use App\Entity\Client;
use App\Entity\Courrier;
use App\Entity\Destinataires;
use App\Entity\Expediteur;
use App\Entity\Statut;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private $passwordHasher;

    public function __construct(UserPasswordHasherInterface $userPasswordHasherInterface)
    {
        $this->passwordHasher = $userPasswordHasherInterface;
    }

    public function load(ObjectManager $manager): void
    {


        $client = new Client();
        $client->setRaisonSociale("fSociety");
        $manager->persist($client);

        $expediteurs = ["toto@toto.fr", "tata@toto.fr"];
        $expediteur1 = null;
        foreach ($expediteurs as $expediteur) :
            $exp = new Expediteur();
            $exp->setEmail($expediteur);
            $hash = $this->passwordHasher->hashPassword($exp, "aze");
            $exp->setPassword($hash);
            $exp->setNom("Dupont");
            $exp->setClient($client);
            $expediteur1 = $exp;
            $manager->persist($exp);
        endforeach;

        $statuts = ["remise", "avisé", "instancié", "distribué", "retour", "npai"];
        foreach ($statuts as $statut) :
            $etat = new Statut();
            $etat->setEtat($statut);
            $manager->persist($etat);
        endforeach;

        $destinataires = [
            [
                'civilite' => 'mr',
                'prenom' => 'xavier',
                'nom' => 'pinson',
                'email' => 'xav.pinson@gelos.fr',
                'adresse' => '12 rue Kevin Troisquarts',
                'codePostal' => 64666,
                'ville' => 'gelos',
                'telephone' => 'alpha tango 123',
                'bordereau' => '12345',
            ],
            [
                'civilite' => '',
                'prenom' => 'service presse',
                'nom' => 'mairie',
                'email' => 'presse.mairie@pau.fr',
                'adresse' => '2 place de la mairie',
                'codePostal' => 64000,
                'ville' => 'pau',
                'telephone' => '0559567854',
                'bordereau' => '23456',
            ],
            [
                'civilite' => 'mlle',
                'prenom' => 'Clarisse',
                'nom' => 'david',
                'email' => 'clarisse.david@yahoo.fr',
                'adresse' => '56 rue Xavier Pinson',
                'codePostal' => 64360,
                'ville' => 'jurançon',
                'telephone' => '07851234',
                'bordereau' => '34567',
                ]
        ];
        $bordereau = ['12345', '23456', '34567'];
        foreach($destinataires as $destinataire) :
            $dest = new Destinataires();
            $dest->setCivilite($destinataire['civilite']);
            $dest->setNom($destinataire['nom']);
            $dest->setPrenom($destinataire['prenom']);
            $dest->setEmail($destinataire['email']);
            $dest->setAdresse($destinataire['adresse']);
            $dest->setCodePostal($destinataire['codePostal']);
            $dest->setVille($destinataire['ville']);
            $dest->setTelephone($destinataire['telephone']);
            $dest->setExpediteur($expediteur1);

            $courrier = new Courrier();
            $courrier->setType(1);
            $courrier->setBordereau($destinataire['bordereau']);
            $courrier->setCivilite($destinataire['civilite']);
            $courrier->setNom($destinataire['nom']);
            $courrier->setPrenom($destinataire['prenom']);
            $courrier->setAdresse($destinataire['adresse']);
            $courrier->setCodePostal($destinataire['codePostal']);
            $courrier->setVille($destinataire['ville']);
            $courrier->setExpediteur($expediteur1);
            $manager->persist($courrier);
        endforeach;

        $manager->flush();
    }

}

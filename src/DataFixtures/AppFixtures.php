<?php

namespace App\DataFixtures;

use App\Entity\Client;
use App\Entity\Courrier;
use App\Entity\Destinataires;
use App\Entity\Expediteur;
use App\Entity\Statut;
use App\Entity\StatutCourrier;
use DateInterval;
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
        $etats = array();
        for ($k = 0; $k < 6; $k++) :
            $etats[$k] = new Statut();
            $etats[$k]->setEtat($statuts[$k]);
            $manager->persist($etats[$k]);
        endfor;
        /*
        foreach ($statuts as $statut) :
            $etat = new Statut();
            $etat->setEtat($statut);
            $manager->persist($etat);
        endforeach;
*/

        $bordereau = 10000;
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
            ],
            [
                'civilite' => '',
                'prenom' => 'service presse',
                'nom' => 'mairie',
                'email' => 'presse.mairie@pau.fr',
                'adresse' => '2 place royale',
                'codePostal' => 64000,
                'ville' => 'pau',
                'telephone' => '0559567854',
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
            ]
        ];
        $compteur = 0;
        foreach ($destinataires as $destinataire) :
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
            $manager->persist($dest);
            for ($i = 0; $i < 7; $i++) :
                $bordereau++;
                $courrier = new Courrier();
                $courrier->setType(1);
                $courrier->setBordereau($bordereau);
                $courrier->setCivilite($destinataire['civilite']);
                $courrier->setNom($destinataire['nom']);
                $courrier->setPrenom($destinataire['prenom']);
                $courrier->setAdresse($destinataire['adresse']);
                $courrier->setCodePostal($destinataire['codePostal']);
                $courrier->setVille($destinataire['ville']);
                $courrier->setExpediteur($expediteur1);
                for ($j = 0; $j < 3; $j++) :
                    $statutCourrier = new StatutCourrier();
                    $statutCourrier->setDate((new \DateTime('2022-01-01'))->add(new DateInterval('P' . $compteur . 'D')));
                    $statutCourrier->setStatut($etats[$j]);
                    $statutCourrier->setCourrier($courrier);
                    $manager->persist($statutCourrier);
                    $compteur++;
                endfor;
                $manager->persist($courrier);
            endfor;
        endforeach;

        foreach ($destinataires as $destinataire) :

            for ($i = 0; $i < 17; $i++) :
                $bordereau++;
                $courrier = new Courrier();
                $courrier->setType(1);
                $courrier->setBordereau($bordereau);
                $courrier->setCivilite($destinataire['civilite']);
                $courrier->setNom($destinataire['nom']);
                $courrier->setPrenom($destinataire['prenom']);
                $courrier->setAdresse($destinataire['adresse']);
                $courrier->setCodePostal($destinataire['codePostal']);
                $courrier->setVille($destinataire['ville']);
                $courrier->setExpediteur($expediteur1);
                $manager->persist($courrier);
                for ($j = 0; $j < 4; $j++) :
                    $statutCourrier = new StatutCourrier();
                    $statutCourrier->setDate((new \DateTime('2022-01-01'))->add(new DateInterval('P' . $compteur . 'D')));
                    $statutCourrier->setStatut($etats[$j]);
                    $statutCourrier->setCourrier($courrier);
                    $manager->persist($statutCourrier);
                    $compteur++;
                endfor;
            endfor;

        endforeach;

        $manager->flush();
    }
}

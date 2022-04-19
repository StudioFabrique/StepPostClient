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
        $client->setRaisonSociale("Mairie");

        $exp = new Expediteur();
        $exp->setEmail('aze@aze.az');
        $hash = $this->passwordHasher->hashPassword($exp, "aze");
        $exp->setPassword($hash);
        $exp->setNom("Azerty");
        $exp->setClient($client);
        
        $client2 = new Client();
        $client2->setRaisonSociale("Mairie");

        $exp2 = new Expediteur();
        $exp2->setEmail('qwe@aze.az');
        $hash = $this->passwordHasher->hashPassword($exp, "aze");
        $exp2->setPassword($hash);
        $exp2->setNom("Qwerty");
        $exp2->setClient($client2);

        $dest = new Destinataires();
        $dest->setNom("Titi");
        $dest->setExpediteur($exp);

        $courrier = new Courrier();
        $courrier->setNom($dest->getNom());
        $courrier->setBordereau("23456");
        $courrier->setType(1);

        $destb = new Destinataires();
        $destb->setNom("tata");
        $destb->setExpediteur($exp);

        $courrierb = new Courrier();
        $courrierb->setNom($dest->getNom());
        $courrierb->setBordereau("23457");
        $courrierb->setType(0);

        

        $manager->persist($exp);
        $manager->persist($client);
        $manager->persist($dest);
        $manager->persist($courrier);
        $manager->persist($destb);
        $manager->persist($courrierb);
        $manager->flush();
    }
}

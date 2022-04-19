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

        $exp = new Expediteur();
        $exp->setEmail('aze@aze.az');
        $hash = $this->passwordHasher->hashPassword($exp, "aze");
        $exp->setPassword($hash);
        $exp->setNom("Azerty");
        $exp->setClient($client);
        
        
        $manager->persist($client);
        $manager->persist($exp);
        $manager->flush();
    }
}

<?php

namespace App\Entity;

use App\Repository\ExpediteurRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ExpediteurRepository::class)]
class Expediteur extends User
{

    #[ORM\ManyToOne(targetEntity: Client::class, inversedBy: 'expediteur')]
    #[ORM\JoinColumn(nullable: true)] //defauld false
    private $client;


    public function getClient(): ?Client
    {
        return $this->client;
    }

    public function setClient(?Client $client): self
    {
        $this->client = $client;

        return $this;
    }

}

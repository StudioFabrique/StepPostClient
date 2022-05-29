<?php

namespace App\Entity;

use App\Repository\StatutcourrierRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: StatutcourrierRepository::class)]
class Statutcourrier
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\Column(type: 'datetime')]
    private $date;

    #[ORM\ManyToOne(targetEntity: Courrier::class)]
    #[ORM\JoinColumn(nullable: false)]
    private $courrier;

    #[ORM\ManyToOne(targetEntity: Statut::class)]
    #[ORM\JoinColumn(nullable: false)]
    private $statut;

    #[ORM\Column(type: 'integer')]
    private $facteurId;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): self
    {
        $this->date = $date;

        return $this;
    }

    public function getCourrier(): ?Courrier
    {
        return $this->courrier;
    }

    public function setCourrier(?Courrier $courrier): self
    {
        $this->courrier = $courrier;

        return $this;
    }

    public function getStatut(): ?Statut
    {
        return $this->statut;
    }

    public function setStatut(?Statut $statut): self
    {
        $this->statut = $statut;

        return $this;
    }

    public function getFacteurId(): ?int
    {
        return $this->facteurId;
    }

    public function setFacteurId(int $facteurId): self
    {
        $this->facteurId = $facteurId;

        return $this;
    }
}

<?php

namespace App\Entity;

use App\Repository\ClientRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ClientRepository::class)]
class Client
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\Column(type: 'string', length: 255)]
    private $raisonSociale;

    #[ORM\OneToMany(mappedBy: 'client', targetEntity: Expediteur::class, orphanRemoval: true)]
    private $expediteur;

    public function __construct()
    {
        $this->expediteur = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRaisonSociale(): ?string
    {
        return $this->raisonSociale;
    }

    public function setRaisonSociale(string $raisonSociale): self
    {
        $this->raisonSociale = $raisonSociale;

        return $this;
    }

    /**
     * @return Collection<int, Expediteur>
     */
    public function getExpediteur(): Collection
    {
        return $this->expediteur;
    }

    public function addExpediteur(Expediteur $expediteur): self
    {
        if (!$this->expediteur->contains($expediteur)) {
            $this->expediteur[] = $expediteur;
            $expediteur->setClient($this);
        }

        return $this;
    }

    public function removeExpediteur(Expediteur $expediteur): self
    {
        if ($this->expediteur->removeElement($expediteur)) {
            // set the owning side to null (unless already changed)
            if ($expediteur->getClient() === $this) {
                $expediteur->setClient(null);
            }
        }

        return $this;
    }
}

<?php

namespace App\Entity;

use App\Repository\DestinatairesRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DestinatairesRepository::class)]
class Destinataires
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\Column(type: 'string', length: 255)]
    private $name;

    #[ORM\ManyToOne(targetEntity: self::class, inversedBy: 'destinataires')]
    #[ORM\JoinColumn(nullable: false)]
    private $expediteur;

    #[ORM\OneToMany(mappedBy: 'expediteur', targetEntity: self::class, orphanRemoval: true)]
    private $destinataires;

    public function __construct()
    {
        $this->destinataires = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getExpediteur(): ?self
    {
        return $this->expediteur;
    }

    public function setExpediteur(?self $expediteur): self
    {
        $this->expediteur = $expediteur;

        return $this;
    }

    /**
     * @return Collection<int, self>
     */
    public function getDestinataires(): Collection
    {
        return $this->destinataires;
    }

    public function addDestinataire(self $destinataire): self
    {
        if (!$this->destinataires->contains($destinataire)) {
            $this->destinataires[] = $destinataire;
            $destinataire->setExpediteur($this);
        }

        return $this;
    }

    public function removeDestinataire(self $destinataire): self
    {
        if ($this->destinataires->removeElement($destinataire)) {
            // set the owning side to null (unless already changed)
            if ($destinataire->getExpediteur() === $this) {
                $destinataire->setExpediteur(null);
            }
        }

        return $this;
    }
}

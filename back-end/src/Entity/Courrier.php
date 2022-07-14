<?php

namespace App\Entity;

use App\Repository\CourrierRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\MaxDepth;

#[ORM\Entity(repositoryClass: CourrierRepository::class)]
class Courrier
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\Column(type: 'integer')]
    private $type;

    #[ORM\Column(type: 'integer')]
    private $bordereau;

    #[ORM\Column(type: 'string', length: 255)]
    private $name;

    #[ORM\Column(type: 'string', length: 50, nullable: true)]
    private $civilite;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private $prenom;

    #[ORM\Column(type: 'string', length: 255)]
    private $adresse;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private $complement;

    #[ORM\Column(type: 'integer')]
    private $codePostal;

    #[ORM\Column(type: 'string', length: 255)]
    private $ville;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private $telephone;

    #[ORM\ManyToOne(targetEntity: Expediteur::class)]
    #[ORM\JoinColumn(nullable: false)]
    private $expediteur;

    #[ORM\OneToMany(mappedBy: 'courrier', targetEntity: Statutcourrier::class)]
    private $statutcourriers;

    public function __construct()
    {
        $this->statutcourriers = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getType(): ?int
    {
        return $this->type;
    }

    public function setType(int $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getBordereau(): ?string
    {
        return $this->bordereau;
    }

    public function setBordereau(string $bordereau): self
    {
        $this->bordereau = $bordereau;

        return $this;
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

    public function getCivilite(): ?string
    {
        return $this->civilite;
    }

    public function setCivilite(?string $civilite): self
    {
        $this->civilite = $civilite;

        return $this;
    }

    public function getPrenom(): ?string
    {
        return $this->prenom;
    }

    public function setPrenom(?string $prenom): self
    {
        $this->prenom = $prenom;

        return $this;
    }

    public function getAdresse(): ?string
    {
        return $this->adresse;
    }

    public function setAdresse(string $adresse): self
    {
        $this->adresse = $adresse;

        return $this;
    }

    public function getComplement(): ?string
    {
        return $this->complement;
    }

    public function setComplement(?string $complement): self
    {
        $this->complement = $complement;

        return $this;
    }

    public function getCodePostal(): ?int
    {
        return $this->codePostal;
    }

    public function setCodePostal(int $codePostal): self
    {
        $this->codePostal = $codePostal;

        return $this;
    }

    public function getVille(): ?string
    {
        return $this->ville;
    }

    public function setVille(string $ville): self
    {
        $this->ville = $ville;

        return $this;
    }

    public function getTelephone(): ?string
    {
        return $this->telephone;
    }

    public function getExpediteur(): ?Expediteur
    {
        return $this->expediteur;
    }

    public function setExpediteur(?Expediteur $expediteur): self
    {
        $this->expediteur = $expediteur;

        return $this;
    }

    /**
     * @return Collection<int, Statutcourrier>
     * @MaxDepth(2)
     */
    public function getStatutcourriers(): Collection
    {
        return $this->statutcourriers;
    }

    public function addStatutcourrier(Statutcourrier $statutcourrier): self
    {
        if (!$this->statutcourriers->contains($statutcourrier)) {
            $this->statutcourriers[] = $statutcourrier;
            $statutcourrier->setCourrier($this);
        }

        return $this;
    }

    public function removeStatutcourrier(Statutcourrier $statutcourrier): self
    {
        if ($this->statutcourriers->removeElement($statutcourrier)) {
            // set the owning side to null (unless already changed)
            if ($statutcourrier->getCourrier() === $this) {
                $statutcourrier->setCourrier(null);
            }
        }

        return $this;
    }
}

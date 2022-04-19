<?php

namespace App\Entity;

use App\Repository\CourierRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CourierRepository::class)]
class Courier
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\Column(type: 'integer')]
    private $type;

    #[ORM\Column(type: 'string')]
    private $borderau;

    #[ORM\Column(type: 'string', length: 255)]
    private $name;

    #[ORM\Column(type: 'string', length: 50)]
    private $civiliter;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private $prenom;

    #[ORM\Column(type: 'string', length: 255)]
    private $adress;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private $complement;

    #[ORM\Column(type: 'integer')]
    private $codePostal;

    #[ORM\Column(type: 'string', length: 255)]
    private $ville;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private $telephone;

    #[ORM\OneToMany(mappedBy: 'courier', targetEntity: Statuscourier::class)]
    private $statuscouriers;

    public function __construct()
    {
        $this->statuscouriers = new ArrayCollection();
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

    public function getBorderau(): ?string
    {
        return $this->borderau;
    }

    public function setBorderau(string $borderau): self
    {
        $this->borderau = $borderau;

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

    public function getCiviliter(): ?string
    {
        return $this->civiliter;
    }

    public function setCiviliter(string $civiliter): self
    {
        $this->civiliter = $civiliter;

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

    public function getAdress(): ?string
    {
        return $this->adress;
    }

    public function setAdress(string $adress): self
    {
        $this->adress = $adress;

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

    public function setTelephone(?string $telephone): self
    {
        $this->telephone = $telephone;

        return $this;
    }

    /**
     * @return Collection<int, Statuscourier>
     */
    public function getStatuscouriers(): Collection
    {
        return $this->statuscouriers;
    }

    public function addStatuscourier(Statuscourier $statuscourier): self
    {
        if (!$this->statuscouriers->contains($statuscourier)) {
            $this->statuscouriers[] = $statuscourier;
            $statuscourier->setCourier($this);
        }

        return $this;
    }

    public function removeStatuscourier(Statuscourier $statuscourier): self
    {
        if ($this->statuscouriers->removeElement($statuscourier)) {
            // set the owning side to null (unless already changed)
            if ($statuscourier->getCourier() === $this) {
                $statuscourier->setCourier(null);
            }
        }

        return $this;
    }

    public function __toString()
    {
        return $this->id;
    }
}

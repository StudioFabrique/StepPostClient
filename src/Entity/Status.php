<?php

namespace App\Entity;

use App\Repository\StatusRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: StatusRepository::class)]
class Status
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\Column(type: 'string', length: 50)]
    private $etat;

    #[ORM\OneToMany(mappedBy: 'status', targetEntity: Statuscourier::class)]
    private $statuscouriers;

    public function __construct()
    {
        $this->statuscouriers = new ArrayCollection();
    }


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEtat(): ?string
    {
        return $this->etat;
    }

    public function setEtat(string $etat): self
    {
        $this->etat = $etat;

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
            $statuscourier->setStatus($this);
        }

        return $this;
    }

    public function removeStatuscourier(Statuscourier $statuscourier): self
    {
        if ($this->statuscouriers->removeElement($statuscourier)) {
            // set the owning side to null (unless already changed)
            if ($statuscourier->getStatus() === $this) {
                $statuscourier->setStatus(null);
            }
        }

        return $this;
    }

    //to string
    public function __toString()
    {
        return $this->etat;
    }
}

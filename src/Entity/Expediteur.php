<?php

namespace App\Entity;

use App\Repository\ExpediteurRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ExpediteurRepository::class)]
class Expediteur extends User
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\ManyToOne(targetEntity: Client::class, inversedBy: 'expediteur')]
    #[ORM\JoinColumn(nullable: true)]
    private $client;

    #[ORM\OneToMany(mappedBy: 'expediteur', targetEntity: Courrier::class, orphanRemoval: true)]
    private $courriers;

    public function __construct()
    {
        $this->courriers = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getClient(): ?Client
    {
        return $this->client;
    }

    public function setClient(?Client $client): self
    {
        $this->client = $client;

        return $this;
    }

    /**
     * @return Collection<int, Courrier>
     */
    public function getCourriers(): Collection
    {
        return $this->courriers;
    }

    public function addCourrier(Courrier $courrier): self
    {
        if (!$this->courriers->contains($courrier)) {
            $this->courriers[] = $courrier;
            $courrier->setExpediteur($this);
        }

        return $this;
    }

    public function removeCourrier(Courrier $courrier): self
    {
        if ($this->courriers->removeElement($courrier)) {
            // set the owning side to null (unless already changed)
            if ($courrier->getExpediteur() === $this) {
                $courrier->setExpediteur(null);
            }
        }

        return $this;
    }

}

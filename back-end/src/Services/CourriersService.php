<?php

namespace App\Services;

use App\Entity\Courrier;
use App\Repository\CourrierRepository;
use App\Repository\StatutcourrierRepository;

class CourriersService
{
    private $courrierRepository;
    private $service;
    private $statutCourrierRepository;

    public  function __construct(
        CourrierRepository $courrierRepository,
        Service $service,
        StatutcourrierRepository $statutCourrierRepository
    ) {
        $this->courrierRepository = $courrierRepository;
        $this->service = $service;
        $this->statutCourrierRepository = $statutCourrierRepository;
    }

    public function courriers($user): array
    {
        $filtre = $this->service->stripTag()[0];
        $results = $this->courrierRepository->findCourriers($user);
        $courriersFiltres = $this->filtrageCourriers($results, $filtre);
        return $this->createCourrierModel($courriersFiltres);
    }

    public function createCourrierModel(array $results)
    {
        $listeCourriers = array();
        foreach ($results as $result) :
            $statut = $result->getStatutcourriers()[count($result->getStatutcourriers()) - 1];
            $listeCourriers = [
                ...$listeCourriers, [
                    'id' => $result->getId(),
                    'type' => $result->getType(),
                    'bordereau' => $result->getBordereau(),
                    'civilite' => $result->getCivilite(),
                    'nom' => $result->getName(),
                    'prenom' => $result->getPrenom(),
                    'adresse' => $result->getAdresse(),
                    'codePostal' => $result->getCodePostal(),
                    'ville' => $result->getVille(),
                    'etat' => $statut->getStatut()->getEtat(),
                    'date' => $statut->getDate()
                ]
            ];
        endforeach;
        return $listeCourriers;
    }

    public function detailsCourrier(): array
    {
        $result = $this->statutCourrierRepository->findBy(['courrier' => $this->service->stripTag()]);
        $listeStatutsCourrier = array();
        foreach ($result as $statut) :
            $listeStatutsCourrier = [...$listeStatutsCourrier, [
                'date' => $statut->getDate(),
                'etat' => $statut->getStatut()->getEtat()
            ]];
        endforeach;
        return $listeStatutsCourrier;
    }

    public function filtrageCourriers(array $courriers, bool $filtre): array
    {
        $courriersFiltres = array();
        foreach ($courriers as $courrier) :
            $statut = $courrier->getStatutcourriers()[count($courrier->getStatutcourriers()) - 1];
            if ($filtre) :
                if ($statut->getStatut()->getId() < 5) :
                    $courriersFiltres = [...$courriersFiltres, $courrier];
                endif;
            else :
                if ($statut->getStatut()->getId() > 4) :
                    $courriersFiltres = [...$courriersFiltres, $courrier];
                endif;
            endif;
        endforeach;
        return $courriersFiltres;
    }
}

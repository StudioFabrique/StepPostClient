<?php

namespace App\Services;

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
        $results = $this->courrierRepository->findCourriers($user);
        return $this->createCourrierModel($results);;
    }

    public function createCourrierModel(array $results)
    {
        $listeCourriers = array();
        foreach ($results as $result) :
            $statut = $result->getStatutcourriers()[count($result->getStatutcourriers()) - 1];
            /**
             *   la valeur '5' représente le statut 'distribué',
             *  ici on ne veut que les courriers qui n'ont pas encore été distribués
             * */
            if ($statut->getStatut()->getId() < 5) :
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
            endif;
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

    public function getCourriersByNom()
    {
        $nom = $this->service->stripTag()[0];
        $results = $this->courrierRepository->findNom($nom);
        if (count($results) === 0) :
            return false;
        else :
            return $this->createCourrierModel($results);
        endif;
    }
}

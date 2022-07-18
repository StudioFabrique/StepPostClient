<?php

namespace App\Services;

use App\Repository\CourrierRepository;

class RechercheService
{
    private $courrierRepository;
    private $courrierService;
    private $service;

    public function __construct(
        CourrierRepository $courrierRepository,
        CourriersService $courrierService,
        Service $service,
    ) {
        $this->courrierRepository = $courrierRepository;
        $this->courrierService = $courrierService;
        $this->service = $service;
    }

    public function getCourrierByBordereau()
    {
        $bordereau = $this->service->stripTag();
        $result = $this->courrierRepository->findByBordereau($bordereau[0]);
        if (count($result) == 0) :
            return false;
        endif;
        $result = $result[0];
        $statuts = array();
        foreach ($result->getStatutcourriers() as $elem) :
            $statuts = [...$statuts, [
                'date' => $elem->getdate(),
                'etat' => $elem->getStatut()->getEtat()
            ]];
        endforeach;
        $courrier = [
            'type' => $result->getType(),
            'bordereau' => $result->getBordereau(),
            'civilite' => $result->getCivilite(),
            'nom' => $result->getName(),
            'prenom' => $result->getPrenom(),
            'adresse' => $result->getAdresse(),
            'codePostal' => $result->getCodePostal(),
            'ville' => $result->getVille(),
            'statuts' => $statuts
        ];
        return $courrier;
    }

    public function getCourriersByNom()
    {
        $data = $this->service->stripTag();
        $results = $this->courrierRepository->findNom($data[0]);
        if (count($results) === 0) :
            return false;
        else :
            return $this->courrierService->createCourrierModel($this->courrierService->filtrageCourriers($results, $data[1]));
        endif;
    }
}

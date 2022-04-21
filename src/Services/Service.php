<?php

namespace App\Services;

use App\Entity\Courrier;

class Service {

    function stripTag(): array
    {
        $tmp = json_decode($_POST['data']);
        $data = array();
        foreach ($tmp as $el) :
            array_push($data, strip_tags($el));
        endforeach;
        return $data;
    }

    function getInfosCourrier(array $statuts, Courrier $courrier) : array
    {
        $result = array();
        foreach($statuts as $statut) :
            array_push($result, [
                'date' => $statut->getDate(),
                'etat' => $statut->getStatut()->getEtat(),
            ]);
        endforeach;
        $destinataire = [
            'civilite' => $courrier->getCivilite(),
            'prenom' => $courrier->getPrenom(),
            'nom' => $courrier->getNom(),
            'adresse' => $courrier->getAdresse(),
            'codePostal' => $courrier->getCodePostal(),
            'ville' => $courrier->getVille(),
        ];
        return [$result, $destinataire];
    }
}
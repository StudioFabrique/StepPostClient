<?php

namespace App\Services;

use App\Entity\Courrier;
use App\Repository\CourrierRepository;
use App\Repository\ExpediteurRepository;
use App\Repository\StatutCourrierRepository;

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

    function getDatas(
        int $user,
        ExpediteurRepository $expediteurRepository,
        CourrierRepository $courrierRepository,
        StatutCourrierRepository $statutCourrierRepository,
    ) {
        $tmp = $this->stripTag();
        $page = $tmp[0];
        $max = $tmp[1];
        $nom = $tmp[2];
        $filtre = $tmp[3];
        $user = $expediteurRepository->findOneBy(['id' => $user]);
        if ($nom === "") :
            $datas = $courrierRepository->findBy(
                ['expediteur' => $user],
                ['id' => 'DESC']
            );
        else :
            $datas = $courrierRepository->findBy(
                [
                    'expediteur' => $user,
                    'nom' => $nom
                ],
                [
                    'id' => 'DESC'
                ]
            );
        endif;
        if (!$datas) :
            return false;
        endif;
        $courriers = array();
        foreach ($datas as $data) :
            $statut = $statutCourrierRepository->findBy(
                ['courrier' => $data->getId()],
                ['date' => 'DESC']
            );
            $tmp = $statut[0]->getStatut()->getEtat();
            if ($this->isDistributed($tmp, $filtre)) :
                array_push($courriers, $statut[0]);
            endif;
        endforeach;
        if (count($courriers) < ($max * ($page + 1))) :
            $length = count($courriers);
        else :
            $length = ($max * ($page + 1));
        endif;
        $statuts = array();
        for ($i = ($page * $max); $i < $length; $i++) :
            $statuts = [...$statuts, [
                'id' => $courriers[$i]->getCourrier()->getId(),
                'type' => $courriers[$i]->getCourrier()->getType(),
                'date' => $courriers[$i]->getDate(),
                'nom' => $courriers[$i]->getCourrier()->getNom(),
                'prenom' => $courriers[$i]->getCourrier()->getPrenom(),
                'etat' => $courriers[$i]->getStatut()->getEtat(),
                'bordereau' => $courriers[$i]->getCourrier()->getBordereau(),
            ]];

        endfor;
        return $statuts;
    }

    function isDistributed(string $tmp, bool $filtre): bool
    {
        if (!$filtre) :
            return ($tmp !== "distribué" && $tmp !== "retour" && $tmp !== "NPAI");
        else :
            return ($tmp === "distribué" || $tmp === "retour" || $tmp === "NPAI");
        endif;
    }
}
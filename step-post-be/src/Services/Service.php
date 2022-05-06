<?php

namespace App\Services;

use App\Entity\Courrier;
use App\Repository\CourrierRepository;
use App\Repository\ExpediteurRepository;
use App\Repository\StatutCourrierRepository;

class Service
{

    public function stripTag(): array
    {
        $tmp = json_decode($_POST['data']);
        $data = array();
        foreach ($tmp as $el) :
            array_push($data, strip_tags($el));
        endforeach;
        return $data;
    }

    public function getInfosCourrier(array $statuts, Courrier $courrier): array
    {
        $result = array();
        foreach ($statuts as $statut) :
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

    public function getDatas(
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

    public function isDistributed(string $tmp, bool $filtre): bool
    {
        if (!$filtre) :
            return ($tmp !== "distribué" && $tmp !== "retour" && $tmp !== "NPAI");
        else :
            return ($tmp === "distribué" || $tmp === "retour" || $tmp === "NPAI");
        endif;
    }

    public function sortArrayByType(array $data, int $sort, bool $direction): array
    {
        switch ($sort):

            case 0:
                if ($direction) :
                    usort($data, function ($a, $b) {
                        return $a['bordereau'] <=> $b['bordereau'];
                    });
                else :
                    usort($data, function ($a, $b) {
                        return $b['bordereau'] <=> $a['bordereau'];
                    });
                endif;
                break;

            case 1:
                if ($direction) :
                    usort($data, function ($a, $b) {
                        return $a['date'] <=> $b['date'];
                    });
                else :
                    usort($data, function ($a, $b) {
                        return $b['date'] <=> $a['date'];
                    });
                endif;
                break;

            case 2:
                if ($direction) :
                    usort($data, function ($a, $b) {
                        return $a['nom'] <=> $b['nom'];
                    });
                else :
                    usort($data, function ($a, $b) {
                        return $b['nom'] <=> $a['nom'];
                    });
                endif;
                break;

            case 3:
                if ($direction) :
                    usort($data, function ($a, $b) {
                        return $a['etat'] <=> $b['etat'];
                    });
                else :
                    usort($data, function ($a, $b) {
                        return $b['etat'] <=> $a['etat'];
                    });
                endif;
                break;

            case 'default':
                break;
        endswitch;
        return $data;
    }

}

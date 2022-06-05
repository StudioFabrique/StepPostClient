<?php

namespace App\Services;

use App\Entity\Courrier;
use App\Entity\Destinataires;
use App\Entity\Expediteur;
use App\Entity\Statutcourrier;
use App\Repository\CourrierRepository;
use App\Repository\DestinatairesRepository;
use App\Repository\StatutcourrierRepository;
use App\Repository\StatutRepository;
use Doctrine\Persistence\ManagerRegistry;
use App\Services\Qrcode as ServicesQrcode;

class Service
{

    public function addAdresse(
        ManagerRegistry $doctrine,
        Expediteur $exp,
    ) {
        $data = $this->stripTag();
        $dest = new Destinataires();
        $dest->setCivilite($data[0]);
        $dest->setNom($data[1]);
        $dest->setPrenom($data[2]);
        $dest->setAdresse($data[3]);
        $dest->setComplement($data[4]);
        $dest->setCodePostal($data[5]);
        $dest->setVille($data[6]);
        $dest->setTelephone($data[7]);
        $dest->setEmail($data[8]);
        $dest->setExpediteur($exp);

        $manager = $doctrine->getManager();
        $manager->persist($dest);
        $manager->flush();
    }

    public function adressesFavorites(
        DestinatairesRepository $destinatairesRepository,
        Expediteur $user,
    ) {
        $destinataires = $destinatairesRepository->findBy(
            ['expediteur' => $user],
            ['nom' => 'ASC']
        );
        $nom = "";
        if (isset($_POST['data'])) :
            $nom = $this->stripTag()[0];
            for ($i = 0; $i < strlen($nom); $i++) :
                $tmp = array();
                foreach ($destinataires as $el) :
                    $elNom = $el->getNom();
                    if ($elNom[$i] === $nom[$i]) :
                        if (!(strlen($elNom) < strlen($nom))) :
                            array_push($tmp, $el);
                        endif;
                    endif;
                endforeach;
                $destinataires = $tmp;
            endfor;
        endif;
        if (count($destinataires) === 0) :
            return false;
        endif;
        $adresses = array();
        foreach ($destinataires as $el) :
            $adresses = [...$adresses, [
                'id' => $el->getId(),
                'civilite' => $el->getCivilite(),
                'prenom' => $el->getPrenom(),
                'nom' => $el->getNom(),
                'adresse' => $el->getAdresse(),
                'complement' => $el->getComplement(),
                'codePostal' => $el->getCodePostal(),
                'ville' => $el->getVille(),
                'telephone' => $el->getTelephone(),
                'email' => $el->getEmail(),
            ]];
        endforeach;
        return $adresses;
    }

    public function deleteAdresse(
        DestinatairesRepository $destinatairesRepository,
        ManagerRegistry $doctrine
    ) {
        $id = $this->stripTag($_POST['data'])[0];
        $dest = $destinatairesRepository->findOneBy(['id' => $id]);
        $manager = $doctrine->getManager();
        $manager->remove($dest);
        $manager->flush();
    }

    public function detailsCourrier(
        StatutcourrierRepository $StatutcourrierRepository,
        CourrierRepository $courrierRepository,
    ) {
        $data = $this->stripTag();
        $courrier = $courrierRepository->findOneBy(['id' => $data[0]]);
        $statuts = $StatutcourrierRepository->findBy(['courrier' => $courrier]);
        $data = $this->getInfosCourrier($statuts, $courrier);
        return $data;
    }

    public function editAdresse(
        DestinatairesRepository $destinatairesRepository,
        ManagerRegistry $doctrine,
    ) {
        $data = $this->stripTag();

        $dest = $destinatairesRepository->findOneBy(['id' => end($data)]);

        $dest->setCivilite($data[0]);
        $dest->setNom($data[1]);
        $dest->setPrenom($data[2]);
        $dest->setAdresse($data[3]);
        $dest->setComplement($data[4]);
        $dest->setCodePostal($data[5]);
        $dest->setVille($data[6]);
        $dest->setTelephone($data[7]);
        $dest->setEmail($data[8]);

        $manager = $doctrine->getManager();
        $manager->persist($dest);
        $manager->flush();

        return $data;
    }

    public function expediteur(Expediteur $user)
    {
        return [
            'nom' => $user->getName(),
            'adresse' => $user->getAdresse(),
            'complement' => $user->getComplement(),
            'codePostal' => $user->getCodePostal(),
            'ville' => $user->getVille(),
        ];
    }

    public function getCourriers(
        CourrierRepository $courrierRepository,
        StatutcourrierRepository $StatutcourrierRepository,
        Expediteur $user
    ) {
        $tmp = $this->stripTag();
        $page = $tmp[0];
        $max = $tmp[1];
        $nom = $tmp[2];
        $filtre = $tmp[3];
        $total = 0; // nombre total de courriers trouvés pour une recherche par nom avec le filtre
        // par defaut les données sont triées par id décroissantes, les variables $sort et $direction (ASC ou DESc) servent à définir un tri différent que celui par défaut
        if (isset($tmp[4])) :
            $sort = $tmp[4];
            $direction = $tmp[5];
        endif;
        if ($nom === "") :
            $datas = $courrierRepository->findBy(
                ['expediteur' => $user],
                ['id' => 'DESC']
            );
        else :
            $datas = $courrierRepository->findBy(
                [
                    'expediteur' => $user,
                    'name' => $nom
                ],
                [
                    'id' => 'DESC'
                ]
            );
        endif;
        if (count($datas) === 0) :
            return [false, 0];
        endif;
        $courriers = array();
        $total = count($datas);
        foreach ($datas as $data) :
            $statut = $StatutcourrierRepository->findBy(
                ['courrier' => $data->getId()],
                ['date' => 'DESC']
            );
            $tmp = $statut[0]->getStatut()->getEtat();
            if ($this->isDistributed($tmp, $filtre)) :
                $courriers = [...$courriers, [
                    'id' => $statut[0]->getCourrier()->getId(),
                    'type' => $statut[0]->getCourrier()->getType(),
                    'date' => $statut[0]->getDate(),
                    'civilite' => $statut[0]->getCourrier()->getCivilite(),
                    'nom' => $statut[0]->getCourrier()->getName(),
                    'prenom' => $statut[0]->getCourrier()->getPrenom(),
                    'etat' => $statut[0]->getStatut()->getEtat(),
                    'bordereau' => $statut[0]->getCourrier()->getBordereau(),
                ]];
            endif;
            $total = count($courriers);
        endforeach;
        if (isset($sort)) :
            $courriers = $this->sortArrayByType($courriers, $sort, $direction);
        endif;
        if (count($courriers) < ($max * ($page + 1))) :
            $length = count($courriers);
        else :
            $length = ($max * ($page + 1));
        endif;
        $statuts = array();
        for ($i = ($page * $max); $i < $length; $i++) :
            array_push($statuts, $courriers[$i]);
        endfor;

        return [$statuts, $total];
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
            'nom' => $courrier->getName(),
            'adresse' => $courrier->getAdresse(),
            'codePostal' => $courrier->getCodePostal(),
            'ville' => $courrier->getVille(),
        ];
        return [$result, $destinataire];
    }

    public function isDistributed(string $tmp, bool $filtre): bool
    {
        if (!$filtre) :
            return ($tmp !== "distribué" && $tmp !== "retour" && $tmp !== "NPAI");
        else :
            return ($tmp === "distribué" || $tmp === "retour" || $tmp === "NPAI");
        endif;
    }

    public function qrcode(
        ServicesQrcode $servicesQrcode,
        ManagerRegistry $doctrine,
        DestinatairesRepository $destinatairesRepository,
        StatutRepository $statutRepository,
        Expediteur $user
    ) {
        $data = $this->stripTag();
        $dest = $destinatairesRepository->findOneBy(
            ['id' => $data[0]]
        );
        $courrier = new Courrier();
        $courrier->setType($data[1]);
        $courrier->setCivilite($dest->getCivilite());
        $courrier->setPrenom($dest->getPrenom());
        $courrier->setName($dest->getNom());
        $courrier->setAdresse($dest->getAdresse());
        $courrier->setComplement($dest->getComplement());
        $courrier->setCodePostal($dest->getCodePostal());
        $courrier->setVille($dest->getVille());
        $courrier->setExpediteur($user);
        $courrier->setBordereau(0);

        $statutcourrier = new Statutcourrier();
        $statutcourrier->setDate(new \DateTime());
        $statut = $statutRepository->findOneBy(['etat' => 'en attente']);
        $statutcourrier->setStatut($statut);
        $statutcourrier->setCourrier($courrier);
        $statutcourrier->setFacteurId(0);

        $manager = $doctrine->getManager();
        $manager->persist($courrier);
        $manager->persist($statutcourrier);
        $manager->flush();

        $id = $courrier->getId();

        $bordereau = 10000 + $id;

        $courrier->setBordereau($bordereau);

        $manager->persist($courrier);
        $manager->flush();

        $qrcode = $servicesQrcode->qrcode($bordereau);
        return [
            'qrcode' => $qrcode,
            'bordereau' => $bordereau
        ];
    }

    public function searchCourrier(
        CourrierRepository $courrierRepository,
        StatutcourrierRepository $StatutcourrierRepository,
    ) {
        $data = $this->stripTag();
        $courrier = $courrierRepository->findOneBy(['bordereau' => $data[0]]);
        if ($courrier !== null) :
            $statuts = $StatutcourrierRepository->findBy(
                ['courrier' => $courrier->getId()],
                ['date' => 'ASC']
            );
            $data = $this->getInfosCourrier($statuts, $courrier);
            $data[1] = [...$data[1], 'bordereau' => $statuts[0]->getCourrier()->getBordereau()];
            return ([
                'statuts' => $data[0],
                'destinataire' => $data[1],
            ]);
        else :
            return false;
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

    public function stripTag(): array
    {
        $tmp = json_decode($_POST['data']);
        $data = array();
        foreach ($tmp as $el) :
            array_push($data, strtolower(strip_tags($el)));
        endforeach;
        return $data;
    }
}

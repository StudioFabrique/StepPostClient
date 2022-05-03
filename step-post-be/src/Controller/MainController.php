<?php

namespace App\Controller;

use App\Repository\CourrierRepository;
use App\Repository\DestinatairesRepository;
use App\Repository\ExpediteurRepository;
use App\Repository\StatutCourrierRepository;
use App\Services\Service as Service;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MainController extends AbstractController
{

    /**
     * retourne false qd la recherche par bordereau n'a rien trouvé,
     * sinon retourne les infos sur le courrier recherché
     */
    #[Route('/api/client/searchCourrier', name: 'api_searchCourrier')]
    public function searchCourrier(
        CourrierRepository $courrierRepository,
        StatutCourrierRepository $statutCourrierRepository,
        Service $service,
    ): Response {
        if (!$this->getUser()) {
            return $this->redirectToRoute('app_login');
        } else {
            $data = $service->stripTag();
            $courrier = $courrierRepository->findOneBy(['bordereau' => $data[0]]);
            if ($courrier !== null) :
                $statuts = $statutCourrierRepository->findBy(
                    ['courrier' => $courrier->getId()],
                    ['date' => 'ASC']
                );
                $data = $service->getInfosCourrier($statuts, $courrier);
                $data[1] = [...$data[1], 'bordereau' => $statuts[0]->getCourrier()->getBordereau()];
                return $this->json([
                    'statuts' => $data[0],
                    'destinataire' => $data[1],
                ]);
            else :
                return $this->json(['statuts' => false]);
            endif;
        }
    }

    #[Route('/api/client/detailsCourrier', name: 'api_detailsCourrier')]
    public function detailsCourrier(
        StatutCourrierRepository $statutCourrierRepository,
        CourrierRepository $courrierRepository,
        Service $service,
    ): Response {
        $data = $service->stripTag();
        $courrier = $courrierRepository->findOneBy(['id' => $data[0]]);
        $statuts = $statutCourrierRepository->findBy(['courrier' => $courrier]);
        $data = $service->getInfosCourrier($statuts, $courrier);
        return $this->json([
            'courrier' => $data[0],
            'destinataire' => $data[1]
        ]);
    }

    #[Route('/api/client/adressesFavorites', name: 'api_adressesFavorites')]
    public function adressesFavorites(
        DestinatairesRepository $destinatairesRepository,
        ExpediteurRepository $expediteurRepository,
        Service $service,
    ): Response {
        $user = $expediteurRepository->findOneBy(['email' => $this->getUser()->getUserIdentifier()]);
        $destinataires = $destinatairesRepository->findBy(['expediteur' => $user]);
        $nom = "";
        if (isset($_POST['data'])) :
            $nom = $service->stripTag()[0];
            $tmp = array();
                foreach ($destinataires as $el) :
                    if (str_contains($el->getNom(), $nom)) :
                        array_push($tmp, $el);
                    endif;
                endforeach;
                $destinataires = $tmp;
        endif;
        if (count($destinataires) === 0) :
            return $this->json(['destinataires' => false]);
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
        return $this->json([
            'destinataires' => $adresses,
        ]);
    }

    #[Route('/api/client/getLogs', name: 'api_getLogs')]
    public function getLogs(
        ExpediteurRepository $expediteurRepository,
        CourrierRepository $courrierRepository,
        StatutCourrierRepository $statutCourrierRepository,
        Service $service,
    ): Response {
        $tmp = $service->stripTag();
        $page = $tmp[0];
        $max = $tmp[1];
        $nom = $tmp[2];
        $filtre = $tmp[3];
        if (isset($tmp[4])) :
            $sort = $tmp[4];
            $direction = $tmp[5];
        endif;
        $user = $expediteurRepository->findOneBy(['email' => $this->getUser()->getUserIdentifier()]);
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
        if (count($datas) === 0) :
            return $this->json(['statuts' => false]);
        endif;
        $courriers = array();
        foreach ($datas as $data) :
            $statut = $statutCourrierRepository->findBy(
                ['courrier' => $data->getId()],
                ['date' => 'DESC']
            );
            $tmp = $statut[0]->getStatut()->getEtat();
            if ($service->isDistributed($tmp, $filtre)) :
                $courriers = [...$courriers, [
                    'id' => $statut[0]->getCourrier()->getId(),
                    'date' => $statut[0]->getDate(),
                    'nom' => $statut[0]->getCourrier()->getNom(),
                    'prenom' => $statut[0]->getCourrier()->getPrenom(),
                    'etat' => $statut[0]->getStatut()->getEtat(),
                    'bordereau' => $statut[0]->getCourrier()->getBordereau(),
                ]];
            endif;
        endforeach;
        if (isset($sort)) :
            $courriers = $service->sortArrayByType($courriers, $sort, $direction);
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
        return $this->json([
            'statuts' => $statuts,
        ]);
    }

    #[Route('/api/client/deleteAdresse', name: 'api_deleteAdresse')]
    public function deleteAdresse(
        Service $service,
        DestinatairesRepository $destinatairesRepository,
        ManagerRegistry $doctrine) : Response
    {
        $id = $service->stripTag($_POST['data'])[0];
        $dest = $destinatairesRepository->findOneBy(['id' => $id]);

        $manager = $doctrine->getManager();

        $manager->remove($dest);
        $manager->flush();

        return $this->json(['result' => true]);
    }

    #[Route('/api/client/editAdresse', name: 'api_editAdresse')]
    public function editAdresse(
        DestinatairesRepository $destinatairesRepository,
        ManagerRegistry $doctrine,
        Service $service,
        ) : Response
    {
        $data = $service->stripTag();

        $dest = $destinatairesRepository->findOneBy(['id' => $data[0]]);

        $dest->setCivilite($data[1]);
        $dest->setNom($data[2]);
        $dest->setPrenom($data[3]);
        $dest->setAdresse($data[4]);
        $dest->setComplement($data[5]);
        $dest->setCodePostal($data[6]);
        $dest->setVille($data[7]);
        $dest->setTelephone($data[8]);
        $dest->setEmail($data[9]);

        $manager = $doctrine->getManager();
        $manager->persist($dest);
        $manager->flush(); 

        return $this->json(['result' => $data]);
    }
}

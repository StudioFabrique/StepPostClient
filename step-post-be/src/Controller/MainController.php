<?php

namespace App\Controller;

use App\Repository\CourrierRepository;
use App\Repository\DestinatairesRepository;
use App\Repository\ExpediteurRepository;
use App\Repository\StatutCourrierRepository;
use App\Services\Service as Service;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MainController extends AbstractController
{



    #[Route('/', name: 'app_main')]
    public function index(CourrierRepository $courrierRepository, StatutCourrierRepository $statutCourrierRepository): Response
    {
        $courriers = $courrierRepository->findBy([], ['nom' => 'DESC']);
        $data = array();

        foreach ($courriers as $courrier) :
            $statuts = $statutCourrierRepository->findBy(
                ['courrier' => $courrier->getId()],
                ['date' => 'ASC']
            );
            array_push($data, $statuts[0]);
        endforeach;

        usort($data, function ($a, $b) {
            return $b->getDate() <=> $a->getDate();
        });

        foreach ($data as $key => $val) :
            echo "clé : " . $key . " val : " . $val->getCourrier()->getId() . "\n";
        endforeach;
        return $this->json(['courriers' => 'toto']);
    }



    /**
     * retourne false qd la recherche par bordereau n'a rien trouvé,
     * sinon retourne les infos sur le courrier recherché
     */
    #[Route('/api/client/searchCourrier', name: 'app_searchCourrier')]
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

    #[Route('/api/client/detailsCourrier', name: 'app_detailsCourrier')]
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

    #[Route('/api/client/adressesFavorites', name: 'app_adressesFavorites')]
    public function adressesFavorites(DestinatairesRepository $destinatairesRepository): Response
    {
        $userId = $this->getUser()->getUserIdentifier();
        $destinataires = $destinatairesRepository->findBy(['expediteur' => $userId]);
        return $this->render('main/adressesFavorites.html.twig', [
            'destinataires' => $destinataires,
        ]);
    }

    #[Route('/api/client/getLogs', name: 'app_getLogs')]
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
}

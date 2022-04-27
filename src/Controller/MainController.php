<?php

namespace App\Controller;

use App\Entity\StatutCourrier;
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
    public function index(): Response
    {
        if (!$this->getUser()) :
            return $this->redirectToRoute('app_login');
        else :
            return $this->render('main/index-test.html.twig', []);
        endif;
    }



    #[Route('/getEnvoi', name: 'app_getEnvoi')]
    public function getEnvoi(
        CourrierRepository $courrierRepository,
        StatutCourrierRepository $statutCourrierRepository,
        ExpediteurRepository $expediteurRepository,
        Service $service,
    ): Response {
        if (!$this->getUser()) {
            return $this->redirectToRoute('app_login');
        } else {
            if (!isset($_POST['data'])) :
                $datas = [0, 3, "", false];
            else :
                $datas = $service->stripTag();
            endif;
            $user = $expediteurRepository->findOneBy(['id' => $this->getUser()->getUserIdentifier()]);
            if ($datas[2] === "") :
                $courriers = $courrierRepository->findBy(
                    ['expediteur' => $user],
                    ['id' => 'DESC']
                );
            else :
                $courriers = $courrierRepository->findBy(
                    [
                        'expediteur' => $user,
                        'nom' => $datas[2]
                    ],
                    ['id' => 'DESC']
                );
            endif;
            $statuts = array();
            foreach ($courriers as $courrier) :
                $statut = $statutCourrierRepository->findBy(
                    ['courrier' => $courrier->getId()],
                    ['date' => 'DESC']
                );
                $tmp = $statut[0]->getStatut()->getEtat();
                if ($tmp !== "distribué" && $tmp !== "retour" && $tmp !== "NPAI") :

                    $statuts = [...$statuts, [
                        'id' => $courrier->getId(),
                        'type' => $courrier->getType(),
                        'date' => $statut[0]->getDate(),
                        'nom' => $courrier->getNom(),
                        'prenom' => $courrier->getPrenom(),
                        'etat' => $statut[0]->getStatut()->getEtat(),
                        'bordereau' => $courrier->getBordereau(),
                    ]];
                endif;
            endforeach;
        }
        return $this->json([
            'statuts' => $statuts
        ]);
    }


    /**
     * retourne false qd la recherche par bordereau n'a rien trouvé,
     * retourne true qd la recherche a abouti mais que le pli a un statut livré, npai ou retourné à l'expéditeur
     * sinon retourne les infos sur le courrier recherché
     */
    #[Route('/searchCourrier', name: 'app_searchCourrier')]
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
                $tmp = end($statuts)->getStatut()->getEtat();
                if ($tmp !== "distribué" && $tmp !== "retour" && $tmp !== "NPAI") :
                    $data = $service->getInfosCourrier($statuts, $courrier);
                    $data[1] = [...$data[1], 'bordereau' => $statuts[0]->getCourrier()->getBordereau()];
                    return $this->json([
                        'statuts' => $data[0],
                        'destinataire' => $data[1],
                    ]);
                else :
                    return $this->json(['statuts' => true]);
                endif;
            else :
                return $this->json(['statuts' => false]);
            endif;
        }
    }

    #[Route('/detailsCourrier', name: 'app_detailsCourrier')]
    public function detailsCourrier(
        StatutCourrierRepository $statutCourrierRepository,
        CourrierRepository $courrierRepository,
        Service $service,
    ): Response {
        if (!$this->getUser()) {
            return $this->redirectToRoute('app_login');
        } else {
            $data = $service->stripTag();
            $courrier = $courrierRepository->findOneBy(['id' => $data[0]]);
            $statuts = $statutCourrierRepository->findBy(['courrier' => $courrier]);
            $data = $service->getInfosCourrier($statuts, $courrier);
            return $this->json([
                'courrier' => $data[0],
                'destinataire' => $data[1]
            ]);
        }
    }

    #[Route('/searchCourrierByNom', name: 'app_searchCourrierbyNom')]
    public function searchCourrierByNom(CourrierRepository $courrierRepository, StatutCourrierRepository $statutCourrierRepository): Response
    {
        if (!$this->getUser()) {
            return $this->redirectToRoute('app_login');
        } else {
            $data = strip_tags($_GET['nom']);
            $courriers = $courrierRepository->findBy(
                ['nom' => $data],
                ['id' => 'DESC']
            );
            $datas = array();
            foreach ($courriers as $courrier) :
                $statut = $statutCourrierRepository->findBy(
                    ['courrier' => $courrier->getId()],
                    ['date' => 'DESC'],
                );
                $tmp = $statut[0]->getStatut()->getEtat();
                if ($tmp !== "distribué" && $tmp !== "retour" && $tmp !== "NPAI") :
                    array_push($datas, $statut[0]);
                endif;
            endforeach;
            return $this->render('main/index.html.twig', [
                'statuts' => $datas,
                'results' => count($datas),
                'nom' => $data,
            ]);
        }
    }

    #[Route('/adressesFavorites', name: 'app_adressesFavorites')]
    public function adressesFavorites(DestinatairesRepository $destinatairesRepository): Response
    {
        $userId = $this->getUser()->getUserIdentifier();
        $destinataires = $destinatairesRepository->findBy(['expediteur' => $userId]);
        return $this->render('main/adressesFavorites.html.twig', [
            'destinataires' => $destinataires,
        ]);
    }

    #[Route('/searchLogs', name: 'app_searchLogs')]
    public function searchLogs(
        Service $service,
        CourrierRepository $courrierRepository,
        StatutCourrierRepository $statutCourrierRepository,
    ): Response {
        $data = $service->stripTag();
        $user = $this->getUser()->getUserIdentifier();
        $courrier = $courrierRepository->findOneBy(
            [
                'expediteur' => $user,
                'bordereau' => $data[0],
            ],
        );
        if (isset($courrier)) :
            $statuts = $statutCourrierRepository->findBy(
                ['courrier' => $courrier->getId()],
                ['date' => 'ASC']
            );
            $tmp = end($statuts)->getStatut()->getEtat();
            if ($this->isDistributed($tmp, true)) :
                //if ($tmp === "distribué" || $tmp === "retour" || $tmp === "NPAI") :
                $data = $service->getInfosCourrier($statuts, $courrier);
                $data[1] = [...$data[1], 'bordereau' => $statuts[0]->getCourrier()->getBordereau()];
                return $this->json([
                    'statuts' => $data[0],
                    'destinataire' => $data[1],
                ]);
            else :
                return $this->json(['statuts' => true]);
            endif;
        else :
            return $this->json(['statuts' => false]);
        endif;
    }

    #[Route('/historique', 'app_historique')]
    public function historique(): Response
    {
        return $this->render('main/historique.html.twig', []);
    }

    #[Route('/getLogs', name: 'app_getLogs')]
    public function getLogs(
        ExpediteurRepository $expediteurRepository,
        CourrierRepository $courrierRepository,
        StatutCourrierRepository $statutCourrierRepository,
        Service $service,
    ): Response {

        if (!$this->getUser()) {
            return $this->redirectToRoute('app_login');
        } else {
            $tmp = $service->stripTag();
            $page = $tmp[0];
            $max = $tmp[1];
            $nom = $tmp[2];
            $filtre = true;
            //dd($tmp);
            $user = $expediteurRepository->findOneBy(['id' => $this->getUser()->getUserIdentifier()]);
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
                    'date' => $courriers[$i]->getDate(),
                    'nom' => $courriers[$i]->getCourrier()->getNom(),
                    'prenom' => $courriers[$i]->getCourrier()->getPrenom(),
                    'etat' => $courriers[$i]->getStatut()->getEtat(),
                    'bordereau' => $courriers[$i]->getCourrier()->getBordereau(),
                ]];
            endfor;
            return $this->json([
                'statuts' => $statuts,
            ]);
        }
    }

    private function isDistributed(string $tmp, bool $filtre): bool
    {
        if (!$filtre) :
            return ($tmp !== "distribué" && $tmp !== "retour" && $tmp !== "NPAI");
        else :
            return ($tmp === "distribué" || $tmp === "retour" || $tmp === "NPAI");
        endif;
    }

    private function getDatas(
        array $tmp,
        ExpediteurRepository $expediteurRepository,
        CourrierRepository $courrierRepository,
        StatutCourrierRepository $statutCourrierRepository,
        Service $service,
    ) {
        $page = $tmp[0];
        $max = $tmp[1];
        $nom = $tmp[2];
        $filtre = $tmp[3];
        $user = $expediteurRepository->findOneBy(['id' => $this->getUser()->getUserIdentifier()]);
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
            if ($this->isDistributed($tmp, $filtre)) :
                array_push($courriers, $statut[0]);
            endif;
        /*
            if ($tmp === "distribué" || $tmp === "retour" || $tmp === "NPAI") :
                array_push($courriers, $statut[0]);
            endif;
            */
        endforeach;
        if (count($courriers) < ($max * ($page + 1))) :
            $length = count($courriers);
        else :
            $length = ($max * ($page + 1));
        endif;
        $statuts = array();
        for ($i = ($page * $max); $i < $length; $i++) :
            $statuts = [...$statuts, [
                'id' => $courriers[$i]->getId(),
                'type' => $courriers[$i]->getCourrier()->getType(),
                'date' => $courriers[$i]->getDate(),
                'nom' => $courriers[$i]->getCourrier()->getNom(),
                'prenom' => $courriers[$i]->getCourrier()->getPrenom(),
                'etat' => $courriers[$i]->getStatut()->getEtat(),
                'bordereau' => $courriers[$i]->getCourrier()->getBordereau(),
            ]];

        endfor;
        //dd($statuts);
        return $statuts;
    }
}

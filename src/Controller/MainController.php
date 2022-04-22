<?php

namespace App\Controller;

use App\Repository\CourrierRepository;
use App\Repository\DestinatairesRepository;
use App\Repository\ExpediteurRepository;
use App\Repository\StatutCourrierRepository;
use App\Services\Service as Service;
use phpDocumentor\Reflection\Types\Boolean;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MainController extends AbstractController
{


    #[Route('/', name: 'app_main')]
    public function index(
        CourrierRepository $courrierRepository,
        StatutCourrierRepository $statutCourrierRepository,
        ExpediteurRepository $expediteurRepository,
    ): Response {
        if (!$this->getUser()) {
            return $this->redirectToRoute('app_login');
        } else {
            $user = $expediteurRepository->findOneBy(['id' => $this->getUser()->getUserIdentifier()]);
            $courriers = $courrierRepository->findBy(
                ['expediteur' => $user],
                ['id' => 'DESC']
            );
            $datas = array();

            foreach ($courriers as $courrier) :
                $statut = $statutCourrierRepository->findBy(
                    ['courrier' => $courrier->getId()],
                    ['date' => 'DESC']
                );
                $tmp = $statut[0]->getStatut()->getEtat();
                if ($tmp !== "distribué" && $tmp !== "retour" && $tmp !== "NPAI") :
                    array_push($datas, $statut[0]);
                endif;
            endforeach;

            return $this->render('main/index.html.twig', [
                'statuts' => $datas,
                'results' => '',
                'nom' => '',
            ]);
        }
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

    #[Route('/nextPage-{page}, {max}', name: 'app_nextPage')]
    public function nextPage(
        int $page,
        int $max,
        ExpediteurRepository $expediteurRepository,
        CourrierRepository $courrierRepository,
        StatutCourrierRepository $statutCourrierRepository,
    ): Response {
        $user = $expediteurRepository->findOneBy(['id' => $this->getUser()->getUserIdentifier()]);
        $courriers = $courrierRepository->findBy(
            ['expediteur' => $user],
            ['id' => 'DESC']
        );
        if ((($page + 1) * $max) > (count($courriers) + 1)) :
            if ($page > 1) :
                $page--;
            endif;
        endif;
        $datas = array();
        if (count($courriers) < ($max * ($page + 1) + 1)) :
            $length = count($courriers);
        else :
            $length = ($max * ($page + 1) + 1);
        endif;
        for ($i = ($page * $max); $i < $length; $i++) :
            $statut = $statutCourrierRepository->findBy(
                ['courrier' => $courriers[$i]->getId()],
                ['date' => 'DESC']
            );
            $tmp = $statut[0]->getStatut()->getEtat();
            if ($tmp === "distribué" || $tmp === "retour" || $tmp === "NPAI") :
                array_push($datas, $statut[0]);
            endif;
        endfor;
        $page++;
        return $this->render('main/historique.html.twig', [
            'statuts' => $datas,
            'page' => $page,
            'max' => $max,
        ]);
    }

    #[Route('/previousPage-{page}, {max}', name: 'app_previousPage')]
    public function previousPage(
        int $page,
        int $max,
        ExpediteurRepository $expediteurRepository,
        CourrierRepository $courrierRepository,
        StatutCourrierRepository $statutCourrierRepository,
    ): Response {
        if ($page === 1) :
            return $this->redirectToRoute('app_nextPage', ['page' => $page - 1, 'max' => $max]);
        endif;
        $user = $expediteurRepository->findOneBy(['id' => $this->getUser()->getUserIdentifier()]);
        $courriers = $courrierRepository->findBy(
            ['expediteur' => $user],
            ['id' => 'DESC']
        );
        $datas = array();
        $page--;
        if (count($courriers) < ($max * $page)) :
            $length = count($courriers);
        else :
            $length = ($max * $page);
        endif;
        for ($i = ($page - 1) * $max; $i < $length; $i++) :
            $statut = $statutCourrierRepository->findBy(
                ['courrier' => $courriers[$i]->getId()],
                ['date' => 'DESC']
            );
            $tmp = $statut[0]->getStatut()->getEtat();
            if ($tmp === "distribué" || $tmp === "retour" || $tmp === "NPAI") :
                array_push($datas, $statut[0]);
            endif;
        endfor;
        return $this->render('main/historique.html.twig', [
            'statuts' => $datas,
            'page' => $page,
            'max' => $max,
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
            if ($tmp === "distribué" || $tmp === "retour" || $tmp === "NPAI") :
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
    public function historique() : Response
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
        $tmp = $service->stripTag();
        $page = $tmp[0];
        $max = $tmp[1];
        $user = $expediteurRepository->findOneBy(['id' => $this->getUser()->getUserIdentifier()]);
        $courriers = $courrierRepository->findBy(
            ['expediteur' => $user],
            ['id' => 'DESC']
        );
        /*
        if ((($page + 1) * $max) > (count($courriers) + 1)) :
            if ($page > 1) :
                $page--;
            endif;
        endif;
        */
        $datas = array();
        if (count($courriers) < ($max * ($page + 1))) :
            $length = count($courriers);
        else :
            $length = ($max * ($page + 1));
        endif;
        for ($i = ($page * $max); $i < $length; $i++) :
            $statut = $statutCourrierRepository->findBy(
                ['courrier' => $courriers[$i]->getId()],
                ['date' => 'DESC']
            );
            $tmp = $statut[0]->getStatut()->getEtat();
            if ($tmp === "distribué" || $tmp === "retour" || $tmp === "NPAI") :
                $courrierTmp = [
                    'date' => $statut[0]->getDate(),
                    'nom' => $statut[0]->getCourrier()->getNom(),
                    'prenom' => $statut[0]->getCourrier()->getPrenom(),
                    'etat' => $tmp,
                    'bordereau' => $statut[0]->getCourrier()->getBordereau(),
                ];
                array_push($datas, $courrierTmp);
            endif;
        endfor;
        return $this->json([
            'statuts' => $datas,
        ]);
    }
}

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
    public function index(): Response
    {
        if (!$this->getUser()) :
            return $this->redirectToRoute('app_login');
        else :
            return $this->render('main/index.html.twig', ['isLogged' => true]);
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
            $user = $this->getUser()->getUserIdentifier();
            return $this->json([
                'statuts' => $service->getDatas(
                    $user,
                    $expediteurRepository,
                    $courrierRepository,
                    $statutCourrierRepository
                ),
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
                if ($service->isDistributed(end($statuts)->getStatut()->getEtat(), false)) :
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

    #[Route('/adressesFavorites', name: 'app_adressesFavorites')]
    public function adressesFavorites(DestinatairesRepository $destinatairesRepository, Service $service): Response
    {
        $userId = $this->getUser()->getUserIdentifier();
        $destinataires = $destinatairesRepository->findBy(['expediteur' => $userId], ['nom' => 'ASC']);
        $nom = "";
        if (isset($_POST['data'])) :
            $nom = strip_tags($_POST['data']);
            $datas = array();
            foreach ($destinataires as $dest) :
                if (str_contains($dest->getNom(), $nom)) :
                    array_push($datas, $dest);
                endif;
            endforeach;
            return $this->render('main/adressesFavorites.html.twig', [
                'destinataires' => $datas,
                'nom' => $nom
            ]);
        else :
            return $this->render('main/adressesFavorites.html.twig', [
                'destinataires' => $destinataires,
                'nom' => $nom
            ]);
        endif;
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
            if ($service->isDistributed($tmp, true)) :
                //if ($tmp === "distribué" || $tmp === "retour" || $tmp === "NPAI") :
                $data = $service->getInfosCourrier($statuts, $courrier);
                $data[1] = [...$data[1], 'bordereau' => $statuts[0]->getCourrier()->getBordereau()];
                return $this->json([
                    'statuts' => $data[0],
                    'destinataire' => $data[1],
                ]);
            else :
                return $this->json(['statuts' => false]);
            endif;
        else :
            return $this->json(['statuts' => false]);
        endif;
    }

    #[Route('/historique', 'app_historique')]
    public function historique(): Response
    {
        if (!$this->getUser()) :
            return $this->redirectToRoute('app_login');
        else :
            return $this->render('main/historique.html.twig', ['isLogged' => true]);
        endif;
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
                if ($service->isDistributed($tmp, $filtre)) :
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

    #[Route('/isLogged', name: 'app_isLogged')]
    public function isLogged(): Response
    {
        $result = false;
        if ($this->getUser()) :
            $result = true;
        endif;
        return $this->json(['isLogged' => $result]);
    }

    #[Route('/previewBordereau-{id}', name: 'app_previewBordereau')]
    public function previewBordereau(DestinatairesRepository $destinatairesRepository, int $id): Response
    {
        if (!$this->getUser()) :
            return $this->redirectToRoute('app_login');
        else :
            $dest = $destinatairesRepository->findOneBy(['id' => $id]);
            return $this->render('main/previewBordereau.html.twig', ['destinataire' => $dest]);
        endif;
    }

    #[Route('/getAdresse', name: 'app_deleteAdresse')]
    public function deleteAdresse(DestinatairesRepository $destinatairesRepository, Service $service) : Response
    {
        if (!$this->getUser()) :
            return $this->redirectToRoute('app_login');
        else:
            $id = $service->stripTag()[0];
            $dest = $destinatairesRepository->findOneBy(['id' => $id]);
            return $this->json(['destinataire' => $dest]);
        endif;            
    }
}

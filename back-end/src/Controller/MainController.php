<?php

namespace App\Controller;

use App\Repository\ExpediteurRepository;
use App\Services\AdressesService;
use App\Services\CourriersService;
use App\Services\Service as Service;
use App\Services\Qrcode as ServicesQrcode;
use App\Services\RechercheService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MainController extends AbstractController
{

    #[Route('/api/add-adresse', name: 'api_add-adresse')]
    public function addAdresse(
        Service $service,
    ): Response {
        $exp = $this->getUser();
        $service->addAdresse($exp);
        return $this->json(['result' => true]);
    }

    #[Route('/api/adresses-favorites', name: 'api_adresses-favorites')]
    public function adressesFavorites(
        Service $service,
    ): Response {
        $user = $this->getUser();
        $result = $service->adressesFavorites($user);
        return $this->json(['destinataires' => $result]);
    }

    #[Route('/api/delete-adresse', name: 'api_delete-adresse')]
    public function deleteAdresse(AdressesService $adressesService): Response
    {
        return $this->json(['result' => $adressesService->removeAdresse()]);
    }

    #[Route('/api/edit-adresse', name: 'api_edit-adresse')]
    public function editAdresse(Service $service,): Response
    {
        return $this->json(['result' => $service->editAdresse()]);
    }

    #[Route('/api/expediteur', name: 'api_expediteur')]
    public function expediteur(Service $service): Response
    {
        $user = $this->getUser();
        return $this->json(['exp' => $service->expediteur($user)]);
    }

    #[Route('/api/qrcode', name: 'api_qrcode')]
    public function qrCode(
        ServicesQrcode $servicesQrcode,
        Service $service,
    ): Response {
        $user = $this->getUser();
        $result = $service->qrcode(
            $user,
            $servicesQrcode,
        );
        return $this->json([
            'qrcode' => $result['qrcode'],
            'bordereau' => $result['bordereau'],
        ]);
    }

    //  recherche d'un courrier par numéro de bordereau
    #[Route('/api/bordereau', name: 'api_bordereau')]
    public function getCourrierByBordereau(RechercheService $rechercheService): Response
    {
        return $this->json(['result' => $rechercheService->getCourrierByBordereau()]);
    }

    //  récupération de la liste des courriers en cours de distribution
    #[Route('/api/courriers', name: 'api_courriers')]
    public function courriers(CourriersService $courrierService, ExpediteurRepository $exp): Response
    {
        $user = $exp->findOneBy(['email' => $this->getUser()->getUserIdentifier()]);
        $results = $courrierService->courriers($user->getId());
        return $this->json(['result' => $results]);
    }

    //  récupération des statuts d'un courrier pour afficher la timeline coté front-end
    #[Route('/api/details-courrier', name: 'api_details-courrier')]
    public function detailsCourrier(CourriersService $courrierService): Response
    {
        return $this->json(['result' => $courrierService->detailsCourrier()]);
    }

    //  vérification de la validité d'un jeton de session envoyé dans les headers
    #[Route('/api/handshake', name: 'api_handshake')]
    public function handShake(): Response
    {
        return $this->json(['result' => true]);
    }

    //  récupération de la liste des courriers associés à un destinataire précis
    #[Route('/api/nom', name: 'api_nom')]
    public function nom(RechercheService $rechercheService): Response
    {
        return $this->json(['result' => $rechercheService->getCourriersByNom()]);
    }
}

<?php

namespace App\Controller;

use App\Repository\CourrierRepository;
use App\Repository\DestinatairesRepository;
use App\Repository\ExpediteurRepository;
use App\Repository\StatutcourrierRepository;
use App\Repository\StatutRepository;
use App\Services\Service as Service;
use App\Services\Qrcode as ServicesQrcode;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MainController extends AbstractController
{

    #[Route('/api/add-adresse', name: 'api_add-adresse')]
    public function addAdresse(
        Service $service,
        ManagerRegistry $doctrine,
        ExpediteurRepository $expediteurRepository,
    ): Response {
        $exp = $expediteurRepository->findOneBy(['email' => $this->getUser()->getUserIdentifier()]);
        $service->addAdresse($doctrine, $exp);
        return $this->json(['result' => true]);
    }

    #[Route('/api/adresses-favorites', name: 'api_adresses-favorites')]
    public function adressesFavorites(
        DestinatairesRepository $destinatairesRepository,
        ExpediteurRepository $expediteurRepository,
        Service $service,
    ): Response {
        $user = $expediteurRepository->findOneBy(['email' => $this->getUser()->getUserIdentifier()]);
        $result = $service->adressesFavorites(
            $destinatairesRepository,
            $user
        );
        return $this->json(['destinataires' => $result]);
    }

    #[Route('/api/details-courrier', name: 'api_details-courrier')]
    public function detailsCourrier(
        StatutcourrierRepository $statutcourrierRepository,
        CourrierRepository $courrierRepository,
        Service $service,
    ): Response {
        $data = $service->detailsCourrier(
            $statutcourrierRepository,
            $courrierRepository
        );
        return $this->json([
            'courrier' => $data[0],
            'destinataire' => $data[1]
        ]);
    }

    #[Route('/api/delete-adresse', name: 'api_delete-adresse')]
    public function deleteAdresse(
        Service $service,
        DestinatairesRepository $destinatairesRepository,
        ManagerRegistry $doctrine
    ): Response {
        $service->deleteAdresse(
            $destinatairesRepository,
            $doctrine
        );
        return $this->json(['result' => true]);
    }

    #[Route('/api/edit-adresse', name: 'api_edit-adresse')]
    public function editAdresse(
        DestinatairesRepository $destinatairesRepository,
        ManagerRegistry $doctrine,
        Service $service,
    ): Response {
        return $this->json(['result' => $service->editAdresse(
            $destinatairesRepository,
            $doctrine
        )]);
    }

    #[Route('/api/expediteur', name: 'api_expediteur')]
    public function expediteur(ExpediteurRepository $expediteurRepository, Service $service): Response
    {
        $user = $expediteurRepository->findOneBy(['email' => $this->getUser()->getUserIdentifier()]);
        return $this->json(['exp' => $service->expediteur($user)]);
    }

    #[Route('/api/get-courriers', name: 'api_get-courriers')]
    public function getCourriers(
        ExpediteurRepository $expediteurRepository,
        CourrierRepository $courrierRepository,
        StatutcourrierRepository $statutcourrierRepository,
        Service $service,
    ): Response {
        $user = $expediteurRepository->findOneBy(['email' => $this->getUser()->getUserIdentifier()]);
        $result = $service->getCourriers(
            $courrierRepository,
            $statutcourrierRepository,
            $user
        );
        return $this->json([
            'statuts' => $result[0],
            'total' => $result[1],
        ]);
    }

    #[Route('/api/qrcode', name: 'api_qrcode')]
    public function qrCode(
        ServicesQrcode $servicesQrcode,
        Service $service,
        ManagerRegistry $doctrine,
        DestinatairesRepository $destinatairesRepository,
        ExpediteurRepository $expediteurRepository,
        StatutRepository $statutRepository,
    ): Response {
        $user = $expediteurRepository->findOneBy(['email' => $this->getUser()->getUserIdentifier()]);
        $result = $service->qrcode(
            $servicesQrcode,
            $doctrine,
            $destinatairesRepository,
            $statutRepository,
            $user
        );
        return $this->json([
            'qrcode' => $result['qrcode'],
            'bordereau' => $result['bordereau'],
        ]);
    }

    /**
     * retourne false qd la recherche par bordereau n'a rien trouvé,
     * sinon retourne les infos sur le courrier recherché
     */
    #[Route('/api/search-courrier', name: 'api_search-courrier')]
    public function searchCourrier(
        CourrierRepository $courrierRepository,
        StatutcourrierRepository $statutcourrierRepository,
        Service $service,
    ): Response {
        $result = $service->searchCourrier(
            $courrierRepository,
            $statutcourrierRepository,
        );
        if (!$result) :
            return $this->json(['statuts' => false]);
        else :
            return $this->json([
                'statuts' => $result['statuts'],
                'destinataire' => $result['destinataire']
            ]);
        endif;
    }
}

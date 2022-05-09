<?php

namespace App\Controller;

use App\Repository\CourrierRepository;
use App\Repository\DestinatairesRepository;
use App\Repository\ExpediteurRepository;
use App\Repository\StatutCourrierRepository;
use App\Repository\StatutRepository;
use App\Services\Service as Service;
use App\Services\Toto as ServicesToto;
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
        $result = $service->searchCourrier(
            $courrierRepository,
            $statutCourrierRepository,
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

    #[Route('/api/client/detailsCourrier', name: 'api_detailsCourrier')]
    public function detailsCourrier(
        StatutCourrierRepository $statutCourrierRepository,
        CourrierRepository $courrierRepository,
        Service $service,
    ): Response {
        $data = $service->detailsCourrier(
            $statutCourrierRepository,
            $courrierRepository
        );
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
        $result = $service->adressesFavorites(
            $destinatairesRepository,
            $user
        );
        return $this->json(['destinataires' => $result]);
    }

    #[Route('/api/client/getLogs', name: 'api_getLogs')]
    public function getLogs(
        ExpediteurRepository $expediteurRepository,
        CourrierRepository $courrierRepository,
        StatutCourrierRepository $statutCourrierRepository,
        Service $service,
    ): Response {
        $user = $expediteurRepository->findOneBy(['email' => $this->getUser()->getUserIdentifier()]);
        $result = $service->getLogs(
            $courrierRepository,
            $statutCourrierRepository,
            $user
        );
        return $this->json([
            'statuts' => $result,
        ]);
    }

    #[Route('/api/client/deleteAdresse', name: 'api_deleteAdresse')]
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

    #[Route('/api/client/editAdresse', name: 'api_editAdresse')]
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

    #[Route('/api/client/addAdresse', name: 'api_addAdresse')]
    public function addAdresse(
        Service $service,
        ManagerRegistry $doctrine,
        ExpediteurRepository $expediteurRepository,
    ): Response {
        $exp = $expediteurRepository->findOneBy(['email' => $this->getUser()->getUserIdentifier()]);
        $service->addAdresse($doctrine, $exp);
        return $this->json(['result' => true]);
    }

    #[Route('/api/client/expediteur', name: 'api_expediteur')]
    public function expediteur(ExpediteurRepository $expediteurRepository, Service $service): Response
    {
        $user = $expediteurRepository->findOneBy(['email' => $this->getUser()->getUserIdentifier()]);
        return $this->json(['exp' => $service->expediteur($user)]);
    }

    #[Route('/api/client/qrcode', name: 'api_qrcode')]
    public function qrCode(
        ServicesToto $serviceToto,
        Service $service,
        ManagerRegistry $doctrine,
        DestinatairesRepository $destinatairesRepository,
        ExpediteurRepository $expediteurRepository,
        StatutRepository $statutRepository,
    ): Response {
        $user = $expediteurRepository->findOneBy(['email' => $this->getUser()->getUserIdentifier()]);
        $result = $service->qrcode(
            $serviceToto,
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

    #[Route('/api/client/handshake', name: 'api_handshake')]
    public function handShake() : Response
    {
        return $this->json(['result' => $this->getUser() !== null]);
    }
}

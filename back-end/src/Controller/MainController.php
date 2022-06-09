<?php

namespace App\Controller;

use App\Repository\DestinatairesRepository;
use App\Repository\ExpediteurRepository;
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
        ExpediteurRepository $expediteurRepository,
    ): Response {
        $exp = $expediteurRepository->findOneBy(['email' => $this->getUser()->getUserIdentifier()]);
        $service->addAdresse($exp);
        return $this->json(['result' => true]);
    }

    #[Route('/api/adresses-favorites', name: 'api_adresses-favorites')]
    public function adressesFavorites(
        ExpediteurRepository $expediteurRepository,
        Service $service,
    ): Response {
        $user = $expediteurRepository->findOneBy(['email' => $this->getUser()->getUserIdentifier()]);
        $result = $service->adressesFavorites($user);
        return $this->json(['destinataires' => $result]);
    }

    #[Route('/api/delete-adresse', name: 'api_delete-adresse')]
    public function deleteAdresse(
        Service $service,
    ): Response {
        $service->deleteAdresse();
        return $this->json(['result' => true]);
    }

    #[Route('/api/details-courrier', name: 'api_details-courrier')]
    public function detailsCourrier(
        Service $service,
    ): Response {
        $data = $service->detailsCourrier();
        return $this->json([
            'courrier' => $data[0],
            'destinataire' => $data[1]
        ]);
    }

    #[Route('/api/edit-adresse', name: 'api_edit-adresse')]
    public function editAdresse(Service $service,): Response
    {
        return $this->json(['result' => $service->editAdresse()]);
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
        Service $service,
    ): Response {
        $user = $expediteurRepository->findOneBy(['email' => $this->getUser()->getUserIdentifier()]);
        $result = $service->getCourriers($user);
        return $this->json([
            'statuts' => $result[0],
            'total' => $result[1],
        ]);
    }

    #[Route('/api/qrcode', name: 'api_qrcode')]
    public function qrCode(
        ServicesQrcode $servicesQrcode,
        Service $service,
        ExpediteurRepository $expediteurRepository,
    ): Response {
        $user = $expediteurRepository->findOneBy(['email' => $this->getUser()->getUserIdentifier()]);
        $result = $service->qrcode(
            $user,
            $servicesQrcode,
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
        Service $service,
    ): Response {
        $result = $service->searchCourrier();
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

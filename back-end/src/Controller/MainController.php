<?php

namespace App\Controller;

use App\Services\Service as Service;
use App\Services\Qrcode as ServicesQrcode;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MainController extends AbstractController
{

    #[Route('/api/add-adresse', name: 'api_add-adresse')]
    public function addAdresse(Service $service): Response
    {
        $user = $this->getUser();
        $service->addAdresse($user);
        return $this->json(['result' => true]);
    }

    #[Route('/api/adresses-favorites', name: 'api_adresses-favorites')]
    public function adressesFavorites(Service $service): Response
    {
        $user = $this->getUser();
        return $this->json(['destinataires' => $service->adressesFavorites($user)]);
    }

    #[Route('/api/delete-adresse', name: 'api_delete-adresse')]
    public function deleteAdresse(Service $service): Response
    {
        $service->deleteAdresse();
        return $this->json(['result' => true]);
    }

    #[Route('/api/details-courrier', name: 'api_details-courrier')]
    public function detailsCourrier(Service $service): Response
    {
        return $this->json(['statuts' => $service->detailsCourrier()]);
    }

    #[Route('/api/edit-adresse', name: 'api_edit-adresse')]
    public function editAdresse(Service $service): Response
    {
        return $this->json(['result' => $service->editAdresse()]);
    }

    #[Route('/api/expediteur', name: 'api_expediteur')]
    public function expediteur(Service $service): Response
    {
        $user = $this->getUser();
        return $this->json(['exp' => $service->getExpediteur($user)]);
    }

    #[Route('/api/get-courriers', name: 'api_get-courriers')]
    public function getCourriers(Service $service): Response
    {
        $user = $this->getUser();
        $result = $service->getCourriers($user);
        return $this->json([
            'statuts' => $result[0],
            'total' => $result[1],
        ]);
    }

    #[Route('/api/qrcode', name: 'api_qrcode')]
    public function qrCode(
        ServicesQrcode $servicesQrcode,
        Service $service
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

    /**
     * retourne false qd la recherche par bordereau n'a rien trouvé,
     * sinon retourne les infos sur le courrier recherché
     */
    #[Route('/api/search-courrier', name: 'api_search-courrier')]
    public function searchCourrier(Service $service): Response
    {
        $result = $service->searchCourrier();
        if (!$result) :
            return $this->json(['statuts' => false]);
        else :
            return $this->json([
                'statuts' => $result,
            ]);
        endif;
    }
}

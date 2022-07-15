<?php

namespace App\Controller;

use App\Repository\CourrierRepository;
use App\Repository\ExpediteurRepository;
use App\Services\CourriersService;
use App\Services\Service as Service;
use App\Services\Qrcode as ServicesQrcode;
use App\Services\RechercheService;
use DateTime;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\DateTimeNormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\SerializerInterface;

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
    public function deleteAdresse(
        Service $service,
    ): Response {
        $service->deleteAdresse();
        return $this->json(['result' => true]);
    }
    /* 
    #[Route('/api/details-courrier', name: 'api_details-courrier')]
    public function detailsCourrier(
        Service $service,
    ): Response {
        $data = $service->detailsCourrier();
        return $this->json([
            'courrier' => $data[0],
            'destinataire' => $data[1]
        ]);
    } */

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

    #[Route('/api/get-courriers', name: 'api_get-courriers')]
    public function getCourriers(
        Service $service,
    ): Response {
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
        return $this->json(['response' => $results]);
    }

    #[Route('/api/details-courrier', name: 'api_details-courrier')]
    public function detailsCourrier(CourriersService $courrierService): Response
    {
        return $this->json(['result' => $courrierService->detailsCourrier()]);
    }

    #[Route('/api/nom', name: 'api_nom')]
    public function nom(CourriersService $courrierService): Response
    {
        return $this->json(['result' => $courrierService->getCourriersByNom()]);
    }
}

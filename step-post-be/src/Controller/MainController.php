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

    /**
     * retourne false qd la recherche par bordereau n'a rien trouvé,
     * sinon retourne les infos sur le courrier recherché
     */
    #[Route('/api/client/searchCourrier', name: 'api_searchCourrier')]
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

    #[Route('/api/client/detailsCourrier', name: 'api_detailsCourrier')]
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
        StatutcourrierRepository $statutcourrierRepository,
        Service $service,
    ): Response {
        $user = $expediteurRepository->findOneBy(['email' => $this->getUser()->getUserIdentifier()]);
        $result = $service->getLogs(
            $courrierRepository,
            $statutcourrierRepository,
            $user
        );
        return $this->json([
            'statuts' => $result[0],
            'total' => $result[1],
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

    #[Route('/api/client/handshake', name: 'api_handshake')]
    public function handShake(): Response
    {
        return $this->json(['result' => $this->getUser() !== null]);
    }

    #[Route('/api/client/getdestbyid', name: 'api_getdestbyid')]
    public function getDestById(DestinatairesRepository $destinatairesRepository): Response
    {
        $data = strip_tags($_POST['data']);
        $el = $destinatairesRepository->findOneBy(['id' => $data]);
        $adresse = [
            'id' => $el->getId(),
            'civilite' => $el->getCivilite(),
            'prenom' => $el->getPrenom(),
            'nom' => $el->getNom(),
            'adresse' => $el->getAdresse(),
            'complement' => $el->getComplement(),
            'codePostal' => $el->getCodePostal(),
            'ville' => $el->getVille(),
            'telephone' => $el->getTelephone(),
            'email' => $el->getEmail(),
        ];
        return $this->json(['adresse' => $adresse]);
    }
}

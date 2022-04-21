<?php

namespace App\Controller;

use App\Entity\Courrier;
use App\Entity\StatutCourrier;
use App\Repository\ClientRepository;
use App\Repository\CourrierRepository;
use App\Repository\DestinatairesRepository;
use App\Repository\ExpediteurRepository;
use App\Repository\StatutCourrierRepository;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MainController extends AbstractController
{
    private function stripTag(): array
    {
        $tmp = json_decode($_POST['data']);
        $data = array();
        foreach ($tmp as $el) :
            array_push($data, strip_tags($el));
        endforeach;
        return $data;
    }

    private function getInfosCourrier(array $statuts, Courrier $courrier) : array
    {
        $result = array();
        foreach($statuts as $statut) :
            array_push($result, [
                'date' => $statut->getDate(),
                'etat' => $statut->getStatut()->getEtat(),
            ]);
        endforeach;
        $destinataire = [
            'civilite' => $courrier->getCivilite(),
            'prenom' => $courrier->getPrenom(),
            'nom' => $courrier->getNom(),
            'adresse' => $courrier->getAdresse(),
            'codePostal' => $courrier->getCodePostal(),
            'ville' => $courrier->getVille(),
        ];
        return [$result, $destinataire];
    }

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
            $courriers = $courrierRepository->findBy(['expediteur' => $user]);
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
            
            return $this->render('main/index.html.twig', ['statuts' => $datas]);
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
        StatutCourrierRepository $statutCourrierRepository
    ): Response {
        $data = $this->stripTag();
        $courrier = $courrierRepository->findOneBy(['bordereau' => $data[0]]);
        if ($courrier !== null) :
            $statuts = $statutCourrierRepository->findBy(
                ['courrier' => $courrier->getId()],
                ['date' => 'ASC']
            );
            $tmp = $statuts[0]->getStatut()->getEtat();
            if ($tmp !== "distribué" && $tmp !== "retour" && $tmp !== "NPAI") :
                $data = $this->getInfosCourrier($statuts, $courrier);
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

    #[Route('/detailsCourrier', name: 'app_detailsCourrier')]
    public function detailsCourrier(
        StatutCourrierRepository $statutCourrierRepository,
        CourrierRepository $courrierRepository
        ): Response
    {       
            $data = $this->stripTag();
            $courrier = $courrierRepository->findOneBy(['id' => $data[0]]);
            $statuts = $statutCourrierRepository->findBy(['courrier' => $courrier]);
            $data = $this->getInfosCourrier($statuts, $courrier);
            return $this->json([
                'courrier' => $data[0],  
                'destinataire' => $data[1]              
            ]);
    }

    #[Route('/searchCourrierByNom', name: 'app_searchCourrierbyNom')]
    public function searchCourrierByNom(CourrierRepository $courrierRepository, StatutCourrierRepository $statutCourrierRepository): Response
    {
        $data = strip_tags($_GET['nom']);
        $courriers = $courrierRepository->findBy(['nom' => $data]);
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
        return $this->render('main/searchCourrierByNom.html.twig', [
            'statuts' => $datas,
            'results' => count($datas),
            'nom' => $data,
        ]);
    }

    #[Route('/adressesFavorites', name: 'app_adressesFavorites')]
    public function adressesFavorites(DestinatairesRepository $destinatairesRepository) : Response
    {
        $userId = $this->getUser()->getUserIdentifier();
        $destinataires = $destinatairesRepository->findBy(['expediteur' => $userId]);
        return $this->render('main/adressesFavorites.html.twig', [
            'destinataires' => $destinataires,            
        ]);
    }
}

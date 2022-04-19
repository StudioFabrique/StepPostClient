<?php

namespace App\Controller;

use App\Repository\CourrierRepository;
use App\Repository\StatutCourrierRepository;
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

    #[Route('/', name: 'app_main')]
    public function index(
        CourrierRepository $courrierRepository,
        StatutCourrierRepository $statutCourrierRepository,
    ): Response {
        if (!$this->getUser()) {
            return $this->redirectToRoute('app_login');
        } else {
            $user = $this->getUser();
            $id = $user->getUserIdentifier();
            $courriers = $courrierRepository->findBy(['date' => 'DESC']);
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
                ['date' => 'DESC']
            );
            $tmp = $statuts[0]->getStatut()->getEtat();
            if ($tmp !== "distribué" && $tmp !== "retour" && $tmp !== "NPAI") :
                return $this->json([
                    'statuts' => $statuts,
                ]);
            else:
                return $this->json(['statuts' => true]);
            endif;
        else :
            return $this->json(['statuts' => false]);
        endif;
    }

    #[Route('/detailsCourrier', name: 'app_detailsCourrier')]
    public function detailsCourrier(StatutCourrierRepository $statutCourrierRepository): Response
    {
        $data = $this->stripTag();
        $courrier = $statutCourrierRepository->findBy(
            ['courrier' => $data[0]],
            ['date' => 'ASC'],
        );
        return $this->json(['courrier' => $courrier]);
    }

    #[Route('/searchCourrierByNom', name: 'app_searchCourrierbyNom')]
    public function searchCourrierBynom(CourrierRepository $courrierRepository, StatutCourrierRepository $statutCourrierRepository): Response
    {
        $data = $_GET['nom'];
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
}

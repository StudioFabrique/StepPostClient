<?php

namespace App\Controller;

use App\Entity\Courier;
use App\Repository\StatuscourierRepository;
use Knp\Component\Pager\PaginatorInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;



#[Route('/accueil', name: 'app_')]
#[IsGranted('ROLE_ADMIN')]
class AccueilController extends AbstractController
{
    #[Route('/', name: 'accueil')]
    public function index(
        StatuscourierRepository $statuscourier,
        Request $request,
        PaginatorInterface $paginator
    ): Response
    {
        if (!$this->getUser()) {
            return $this->redirectToRoute('app_login');
        }

        
        $donner = $statuscourier->findStatusOneAll();
        $statuscourier = $paginator->paginate(
            $donner,
            $request->query->getInt('page', 1),
            8
        );

        return $this->render('accueil/index.html.twig', [
            'statusCourier' => $statuscourier

        ]);
    }

    #[Route('/suivi/{id}', name: 'suiviId')]
    public function indexbyid(  
        Courier $id,
        StatuscourierRepository $statuscourier
    ): Response
    {
        if (!$this->getUser()) {
            return $this->redirectToRoute('app_login');
        }

        $statuscourier = $statuscourier->findBy(["courier" => $id], ["id" => "DESC"]);
        
        return $this->render('suivi_detail/index.html.twig', [
            'courierId' => $id,
            'statusCourier' => $statuscourier,
            
        ]);
    }

}

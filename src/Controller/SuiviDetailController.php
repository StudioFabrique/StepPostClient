<?php

namespace App\Controller;

use App\Entity\Statuscourier;
use App\Form\StatuscourierType;
use App\Repository\StatuscourierRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/suivi/detail', name: 'app_')]
#[IsGranted('ROLE_ADMIN')]
class SuiviDetailController extends AbstractController
{

    #[Route('/edit/{id}', name: 'status_edit')]
    public function edit(Request $request, Statuscourier $statuscourier, StatuscourierRepository $statuscourierRepository): Response
    {
        $form = $this->createForm(StatuscourierType::class, $statuscourier);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $statuscourierRepository->add($statuscourier);
            return $this->redirectToRoute('app_accueil', [], Response::HTTP_SEE_OTHER);
        }

        return $this->renderForm('suivi_detail/edit.html.twig', [
            'statuscourier' => $statuscourier,
            'form' => $form,
        ]);
    }
}

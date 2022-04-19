<?php

namespace App\Controller;

use App\Entity\UserStep;
use App\Form\UserStepType;
use App\Repository\UserStepRepository;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[Route('/step/user', name: 'app_')]
#[IsGranted('ROLE_ADMIN')]
class StepUserController extends AbstractController
{
    #[Route('/', name: 'step_user')]
    public function index(
        UserStepRepository $userSteps,
        Request $request,
        PaginatorInterface $paginator
    ): Response
    {

        if (!$this->getUser()) {
            return $this->redirectToRoute('app_login');
        }

        $donner = $userSteps -> findAll([], ['id' => 'DESC']);
        $userStep = $paginator->paginate(
            $donner,
            $request->query->getInt('page', 1),
            3
        );

        return $this->render('step_user/index.html.twig', [
            'userStep' => $userStep
        ]);
    }

    #[Route('/ajouter', name: 'step_user_add')]
    public function new(Request $request, UserStepRepository $userStepRepository, UserPasswordHasherInterface $passwordHasher): Response
    {
        $userStep = new UserStep();
        $form = $this->createForm(UserStepType::class, $userStep);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $pass = $form->getData()->getPassword();
            $hashedPassword = $passwordHasher->hashPassword(
                $userStep,
                $pass
            );
            $userStep -> setPassword($hashedPassword) ;
            $userStepRepository->add($userStep);
            return $this->redirectToRoute('app_step_user', [], Response::HTTP_SEE_OTHER);
        }

        return $this->renderForm('step_user/new.html.twig', [
            'user_step' => $userStep,
            'form' => $form,
        ]);
    }

    #[Route('/edit/{id}', name: 'step_edit')]
    public function edit(Request $request, UserStep $userStep, UserStepRepository $userStepRepository,UserPasswordHasherInterface $passwordHasher): Response
    {
        $form = $this->createForm(UserStepType::class, $userStep);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $pass = $form->getData()->getPassword();
            $hashedPassword = $passwordHasher->hashPassword(
                $userStep,
                $pass
            );
            $userStep -> setPassword($hashedPassword) ;
            $userStepRepository->add($userStep);
            return $this->redirectToRoute('app_step_user', [], Response::HTTP_SEE_OTHER);
        }

        return $this->renderForm('step_user/edit.html.twig', [
            'user_step' => $userStep,
            'form' => $form,
        ]);
    }


    #[Route('/delete/{id}', name: 'step_delete', methods: ['POST'])]
    public function delete(Request $request, UserStep $userStep, UserStepRepository $userStepRepository): Response
    {
        if ($this->isCsrfTokenValid('delete'.$userStep->getId(), $request->request->get('_token'))) {
            $userStepRepository->remove($userStep);
        }

        return $this->redirectToRoute('app_step_user', [], Response::HTTP_SEE_OTHER);
    }
}

<?php

namespace App\Services;

use App\Repository\DestinatairesRepository;
use Doctrine\Persistence\ManagerRegistry;

class AdressesService
{
    private $destinatairesRepository;
    private $doctrine;
    private $service;

    public function __construct(
        DestinatairesRepository $destinatairesRepository,
        ManagerRegistry $doctrine,
        Service $service,
    ) {
        $this->destinatairesRepository = $destinatairesRepository;
        $this->doctrine = $doctrine;
        $this->service = $service;
    }

    public function removeAdresse()
    {
        $id = $this->service->stripTag()[0];
        $dest = $this->destinatairesRepository->findOneBy(['id' => $id]);
        if (isset($dest)) :
            $manager = $this->doctrine->getManager();
            $manager->remove($dest);
            $manager->flush();
            return true;
        endif;
        return false;
    }
}

<?php

namespace App\Services;

use App\Entity\Courrier;
use App\Entity\Destinataires;
use App\Entity\Expediteur;
use App\Entity\Statutcourrier;
use App\Repository\CourrierRepository;
use App\Repository\DestinatairesRepository;
use App\Repository\StatutcourrierRepository;
use App\Repository\StatutRepository;
use Doctrine\Persistence\ManagerRegistry;
use App\Services\Qrcode as ServicesQrcode;
use Symfony\Component\HttpFoundation\Request;

class Service
{
    private $courrierRepository;
    private $destinatairesRepository;
    private $doctrine;
    private $statutRepository;
    private $statutcourrierRepository;

    public function __construct(
        CourrierRepository $courrierRepository,
        DestinatairesRepository $destinataireRepository,
        ManagerRegistry $doctrine,
        StatutRepository $statutRepository,
        StatutcourrierRepository $statutcourrierRepository,
    ) {
        $this->courrierRepository = $courrierRepository;
        $this->destinatairesRepository = $destinataireRepository;
        $this->doctrine = $doctrine;
        $this->statutRepository = $statutRepository;
        $this->statutcourrierRepository = $statutcourrierRepository;
    }

    public function addAdresse(Expediteur $exp)
    {
        $data = $this->stripTag();
        $dest = new Destinataires();
        $dest->setCivilite($data[0]);
        $dest->setNom($data[1]);
        $dest->setPrenom($data[2]);
        $dest->setAdresse($data[3]);
        $dest->setComplement($data[4]);
        $dest->setCodePostal($data[5]);
        $dest->setVille($data[6]);
        $dest->setTelephone($data[7]);
        $dest->setEmail($data[8]);
        $dest->setExpediteur($exp);

        $manager = $this->doctrine->getManager();
        $manager->persist($dest);
        $manager->flush();
    }

    public function adressesFavorites(Expediteur $exp)
    {
        $destinataires = $this->destinatairesRepository->findBy(
            ['expediteur' => $exp],
            ['nom' => 'ASC']
        );
        $nom = "";
        if (isset($_POST['data'])) :
            $nom = $this->stripTag()[0];
            for ($i = 0; $i < strlen($nom); $i++) :
                $tmp = array();
                foreach ($destinataires as $el) :
                    $elNom = $el->getNom();
                    if ($elNom[$i] === $nom[$i]) :
                        if (!(strlen($elNom) < strlen($nom))) :
                            array_push($tmp, $el);
                        endif;
                    endif;
                endforeach;
                $destinataires = $tmp;
            endfor;
        endif;
        if (count($destinataires) === 0) :
            return false;
        endif;
        $adresses = array();
        foreach ($destinataires as $el) :
            $adresses = [...$adresses, [
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
            ]];
        endforeach;
        return $adresses;
    }

    public function deleteAdresse()
    {
        $id = $this->stripTag()[0];
        $dest = $this->destinatairesRepository->findOneBy(['id' => $id]);
        $manager = $this->doctrine->getManager();
        $manager->remove($dest);
        $manager->flush();
        return true;
    }

    public function detailsCourrier()
    {
        $data = $this->stripTag();
        $courrier = $this->courrierRepository->findOneBy(['id' => $data[0]]);
        $statuts = $this->statutcourrierRepository->findBy(['courrier' => $courrier]);
        $data = $this->getInfosCourrier($statuts, $courrier);
        return $data;
    }

    public function editAdresse()
    {
        $data = $this->stripTag();
        $dest = $this->destinatairesRepository->findOneBy(['id' => end($data)]);
        $dest->setCivilite($data[0]);
        $dest->setNom($data[1]);
        $dest->setPrenom($data[2]);
        $dest->setAdresse($data[3]);
        $dest->setComplement($data[4]);
        $dest->setCodePostal($data[5]);
        $dest->setVille($data[6]);
        $dest->setTelephone($data[7]);
        $dest->setEmail($data[8]);

        $manager = $this->doctrine->getManager();
        $manager->persist($dest);
        $manager->flush();

        return $data;
    }

    public function expediteur(Expediteur $user)
    {
        return [
            'nom' => $user->getNom(),
            'adresse' => $user->getAdresse(),
            'complement' => $user->getComplement(),
            'codePostal' => $user->getCodePostal(),
            'ville' => $user->getVille(),
        ];
    }

    public function getCourriers(Expediteur $user)
    {
        $tmp = $this->stripTag();
        $page = $tmp[0];
        $max = $tmp[1];
        $nom = $tmp[2];
        $filtre = $tmp[3];
        $total = 0; // nombre total de courriers trouvés pour une recherche par nom avec le filtre
        // par defaut les données sont triées par id décroissantes, les variables $sort et $direction (ASC ou DESC) servent à définir un tri différent que celui par défaut
        if (isset($tmp[4])) :
            $sort = $tmp[4];
            $direction = $tmp[5];
        endif;
        if ($nom === "") :
            $datas = $this->courrierRepository->findBy(
                ['expediteur' => $user],
                ['id' => 'DESC']
            );
        else :
            $datas = $this->courrierRepository->findBy(
                [
                    'expediteur' => $user,
                    'name' => $nom
                ],
                [
                    'id' => 'DESC'
                ]
            );
        endif;
        if (count($datas) === 0) :
            return [false, 0];
        endif;
        $statuts = array();
        foreach ($datas as $data) :
            $statut = $this->statutcourrierRepository->findBy(
                ['courrier' => $data->getId()],
                ['date' => 'DESC']
            );
            $tmp = $statut[0]->getStatut()->getEtat();
            if ($this->isDistributed($tmp, $filtre)) :
                array_push($statuts, $statut[0]);
            endif;
            $total = count($statuts);
        endforeach;
        if (isset($sort)) :
            $statuts = $this->triTableau($statuts, $sort, $direction);
        endif;
        if (count($statuts) < ($max * ($page + 1))) :
            $length = count($statuts);
        else :
            $length = ($max * ($page + 1));
        endif;
        $courriers = array();
        for ($i = ($page * $max); $i < $length; $i++) :
            $courriers = [...$courriers, [
                'id' => $statuts[$i]->getCourrier()->getId(),
                'type' => $statuts[$i]->getCourrier()->getType(),
                'date' => $statuts[$i]->getDate(),
                'civilite' => $statuts[$i]->getCourrier()->getCivilite(),
                'nom' => $statuts[$i]->getCourrier()->getName(),
                'prenom' => $statuts[$i]->getCourrier()->getPrenom(),
                'etat' => $statuts[$i]->getStatut()->getEtat(),
                'bordereau' => $statuts[$i]->getCourrier()->getBordereau(),
            ]];
        endfor;

        return [$courriers, $total];
    }

    public function getInfosCourrier(array $statuts, Courrier $courrier): array
    {
        $result = array();
        foreach ($statuts as $statut) :
            array_push($result, [
                'date' => $statut->getDate(),
                'etat' => $statut->getStatut()->getEtat(),
            ]);
        endforeach;
        $destinataire = [
            'civilite' => $courrier->getCivilite(),
            'prenom' => $courrier->getPrenom(),
            'nom' => $courrier->getName(),
            'adresse' => $courrier->getAdresse(),
            'codePostal' => $courrier->getCodePostal(),
            'ville' => $courrier->getVille(),
        ];
        return [$result, $destinataire];
    }

    public function isDistributed(string $tmp, bool $filtre): bool
    {
        if (!$filtre) :
            return ($tmp !== "distribué" && $tmp !== "retour" && $tmp !== "NPAI");
        else :
            return ($tmp === "distribué" || $tmp === "retour" || $tmp === "NPAI");
        endif;
    }

    public function qrcode(
        Expediteur $user,
        ServicesQrcode $service,
    ) {
        $data = $this->stripTag();
        $dest = $this->destinatairesRepository->findOneBy(
            ['id' => $data[0]]
        );
        $courrier = new Courrier();
        $courrier->setType($data[1]);
        $courrier->setCivilite($dest->getCivilite());
        $courrier->setPrenom($dest->getPrenom());
        $courrier->setName($dest->getNom());
        $courrier->setAdresse($dest->getAdresse());
        $courrier->setComplement($dest->getComplement());
        $courrier->setCodePostal($dest->getCodePostal());
        $courrier->setVille($dest->getVille());
        $courrier->setExpediteur($user);
        $courrier->setBordereau(0);

        $statutcourrier = new Statutcourrier();
        $statutcourrier->setDate(new \DateTime());
        $statut = $this->statutRepository->findOneBy(['etat' => 'en attente']);
        $statutcourrier->setStatut($statut);
        $statutcourrier->setCourrier($courrier);
        $statutcourrier->setFacteurId(0);

        $manager = $this->doctrine->getManager();
        $manager->persist($courrier);
        $manager->persist($statutcourrier);
        $manager->flush();

        $id = $courrier->getId();

        $bordereau = 10000 + $id;

        $courrier->setBordereau($bordereau);

        $manager->persist($courrier);
        $manager->flush();

        $qrcode = $service->qrcode($bordereau);
        return [
            'qrcode' => $qrcode,
            'bordereau' => $bordereau
        ];
    }

    public function searchCourrier()
    {
        $data = $this->stripTag();
        $courrier = $this->courrierRepository->findOneBy(['bordereau' => $data[0]]);
        if ($courrier !== null) :
            $statuts = $this->statutcourrierRepository->findBy(
                ['courrier' => $courrier->getId()],
                ['date' => 'ASC']
            );
            $data = $this->getInfosCourrier($statuts, $courrier);
            $data[1] = [...$data[1], 'bordereau' => $statuts[0]->getCourrier()->getBordereau()];
            return ([
                'statuts' => $data[0],
                'destinataire' => $data[1],
            ]);
        else :
            return false;
        endif;
    }

    public function stripTag(): array
    {
        $request = Request::createFromGlobals();
        $tmp = json_decode($request->request->get('data'));
        $data = array();
        foreach ($tmp as $el) :
            array_push($data, strtolower(strip_tags($el)));
        endforeach;
        return $data;
    }

    public function triTableau(array $data, int $sort, bool $direction): array
    {
        switch ($sort):

            case 0:
                if ($direction) :
                    usort($data, function ($a, $b) {
                        return $a->getCourrier()->getBordereau() <=> $b->getCourrier()->getBordereau();
                    });
                else :
                    usort($data, function ($a, $b) {
                        return $b->getCourrier()->getBordereau() <=> $a->getCourrier()->getBordereau();
                    });
                endif;
                break;

            case 1:
                if ($direction) :
                    usort($data, function ($a, $b) {
                        return $a->getDate() <=> $b->getDate();
                    });
                else :
                    usort($data, function ($a, $b) {
                        return $b->getDate() <=> $a->getDate();
                    });
                endif;
                break;

            case 2:
                if ($direction) :
                    usort($data, function ($a, $b) {
                        return $a->getCourrier()->getName() <=> $b->getCourrier()->getName();
                    });
                else :
                    usort($data, function ($a, $b) {
                        return $b->getCourrier()->getName() <=> $a->getCourrier()->getName();
                    });
                endif;
                break;

            case 3:
                if ($direction) :
                    usort($data, function ($a, $b) {
                        return $a->getStatut()->getEtat() <=> $b->getStatut()->getEtat();
                    });
                else :
                    usort($data, function ($a, $b) {
                        return $b->getStatut()->getEtat() <=> $a->getStatut()->getEtat();
                    });
                endif;
                break;

            case 'default':
                break;
        endswitch;
        return $data;
    }
}


   /*     #[Route('/toto', name: 'app_toto')]
    public function toto(CourrierRepository $courrierRepository, SerializerInterface $serializer): Response
    {
        $courriers = $courrierRepository->findByExampleField(1)[0];
        $json = $serializer->serialize(
            $courriers,
            JsonEncoder::FORMAT,

            [
                AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function ($object, $format, $context) {
                    return $object->getName();
                },
            ],
            [DateTimeNormalizer::FORMAT_KEY => 'Y-m-d H:i:s'],

        );
        return new Response($json);
    } */
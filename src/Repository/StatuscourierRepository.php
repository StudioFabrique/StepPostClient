<?php

namespace App\Repository;

use App\Entity\Statuscourier;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Statuscourier|null find($id, $lockMode = null, $lockVersion = null)
 * @method Statuscourier|null findOneBy(array $criteria, array $orderBy = null)
 * @method Statuscourier[]    findAll()
 * @method Statuscourier[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class StatuscourierRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Statuscourier::class);
    }

    /**
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function add(Statuscourier $entity, bool $flush = true): void
    {
        $this->_em->persist($entity);
        if ($flush) {
            $this->_em->flush();
        }
    }

    /**
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function remove(Statuscourier $entity, bool $flush = true): void
    {
        $this->_em->remove($entity);
        if ($flush) {
            $this->_em->flush();
        }
    }

    // /**
    //  * @return Statuscourier[] Returns an array of Statuscourier objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('s.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Statuscourier
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */

    public function findStatusOneAll()
    {


        // SELECT
        //     courier_id,
        //     MAX(DATE) AS DATE,
        //     MAX(status_id) AS etat
        // FROM
        //     statuscourier
        // GROUP BY
        //     courier_id
        $qb = $this->createQueryBuilder('s')
            ->select(
                'c.id AS courier,
                MAX(s.date) AS date,
                MAX(d.id) AS etat,
                MAX(d.etat) AS test,
                c.name,
                c.prenom,
                c.adress,
                c.complement,
                c.ville,
                c.codePostal,
                c.telephone,
                c.borderau,
                c.civiliter,
                c.type')
            ->leftJoin('s.courier', 'c')
            ->leftJoin('s.status', 'd')
            ->groupBy('c.id')
            ->orderBy('c.id', 'DESC')
            ->getQuery();
        return $qb->getResult();

    }
}


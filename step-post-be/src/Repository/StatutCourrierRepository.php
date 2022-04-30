<?php

namespace App\Repository;

use App\Entity\StatutCourrier;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<StatutCourrier>
 *
 * @method StatutCourrier|null find($id, $lockMode = null, $lockVersion = null)
 * @method StatutCourrier|null findOneBy(array $criteria, array $orderBy = null)
 * @method StatutCourrier[]    findAll()
 * @method StatutCourrier[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class StatutCourrierRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, StatutCourrier::class);
    }

    /**
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function add(StatutCourrier $entity, bool $flush = true): void
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
    public function remove(StatutCourrier $entity, bool $flush = true): void
    {
        $this->_em->remove($entity);
        if ($flush) {
            $this->_em->flush();
        }
    }

    // /**
    //  * @return StatutCourrier[] Returns an array of StatutCourrier objects
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
    public function findOneBySomeField($value): ?StatutCourrier
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}

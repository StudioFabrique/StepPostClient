<?php

namespace App\Repository;

use App\Entity\Statutcourrier;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Statutcourrier>
 *
 * @method Statutcourrier|null find($id, $lockMode = null, $lockVersion = null)
 * @method Statutcourrier|null findOneBy(array $criteria, array $orderBy = null)
 * @method Statutcourrier[]    findAll()
 * @method Statutcourrier[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class StatutcourrierRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Statutcourrier::class);
    }

    /**
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function add(Statutcourrier $entity, bool $flush = true): void
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
    public function remove(Statutcourrier $entity, bool $flush = true): void
    {
        $this->_em->remove($entity);
        if ($flush) {
            $this->_em->flush();
        }
    }

    // /**
    //  * @return Statutcourrier[] Returns an array of Statutcourrier objects
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
    public function findOneBySomeField($value): ?Statutcourrier
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

<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220415120334 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE courrier ADD civilite VARCHAR(10) DEFAULT NULL, ADD prenom VARCHAR(255) DEFAULT NULL, ADD adresse VARCHAR(255) NOT NULL, ADD complement VARCHAR(255) DEFAULT NULL, ADD code_postal INT NOT NULL, ADD ville VARCHAR(255) NOT NULL, ADD telephone VARCHAR(100) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE courrier DROP civilite, DROP prenom, DROP adresse, DROP complement, DROP code_postal, DROP ville, DROP telephone');
    }
}

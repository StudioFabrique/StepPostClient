<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220419130135 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE courrier DROP FOREIGN KEY FK_BEF47CAA10335F61');
        $this->addSql('DROP INDEX IDX_BEF47CAA10335F61 ON courrier');
        $this->addSql('ALTER TABLE courrier DROP expediteur_id');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE courrier ADD expediteur_id INT NOT NULL');
        $this->addSql('ALTER TABLE courrier ADD CONSTRAINT FK_BEF47CAA10335F61 FOREIGN KEY (expediteur_id) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('CREATE INDEX IDX_BEF47CAA10335F61 ON courrier (expediteur_id)');
    }
}

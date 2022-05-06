<?php

namespace App\Services;

use DateTime;
use Endroid\QrCode\Builder\BuilderInterface;
use Endroid\QrCode\Encoding\Encoding;

class Toto
{

    protected $builder;

    public function __construct(BuilderInterface $builder)
    {
        $this->builder = $builder;   
    }

    public function qrcode(string $bordereau)
    {
        $objDateTime = new DateTime('NOW');
        $dateString = $objDateTime->format('d-m-Y H:i:s');

        $result = $this->builder
        ->data($bordereau)
        ->encoding(new Encoding('UTF-8'))
        ->size(300)
        ->labelText($dateString)
        ->build();

        $nameFile = uniqid('', '').'.png';
        $result->saveToFile((\dirname(__DIR__, 2).'/public/assets/qrcodes/'.$nameFile));

        return $nameFile;
    }
}

<?php

namespace Model;

use Model\ActiveRecord;

class ComisionPersonal extends ActiveRecord {
    
    public static $tabla = 'pmlx_personal_comisiones';
    public static $idTabla = 'personal_id';
    public static $columnasDB = 
    [
        'personal_nom1',
        'personal_nom2',
        'personal_ape1',
        'personal_ape2',
        'personal_dpi',
        'personal_tel',
        'personal_correo',
        'personal_direccion',
        'personal_rango',
        'personal_unidad',
        'personal_situacion'
    ];
    
    public $personal_id;
    public $personal_nom1;
    public $personal_nom2;
    public $personal_ape1;
    public $personal_ape2;
    public $personal_dpi;
    public $personal_tel;
    public $personal_correo;
    public $personal_direccion;
    public $personal_rango;
    public $personal_unidad;
    public $personal_situacion;
    
    public function __construct($personal = [])
    {
        $this->personal_id = $personal['personal_id'] ?? null;
        $this->personal_nom1 = $personal['personal_nom1'] ?? '';
        $this->personal_nom2 = $personal['personal_nom2'] ?? '';
        $this->personal_ape1 = $personal['personal_ape1'] ?? '';
        $this->personal_ape2 = $personal['personal_ape2'] ?? '';
        $this->personal_dpi = $personal['personal_dpi'] ?? '';
        $this->personal_tel = $personal['personal_tel'] ?? 0;
        $this->personal_correo = $personal['personal_correo'] ?? '';
        $this->personal_direccion = $personal['personal_direccion'] ?? '';
        $this->personal_rango = $personal['personal_rango'] ?? '';
        $this->personal_unidad = $personal['personal_unidad'] ?? '';
        $this->personal_situacion = $personal['personal_situacion'] ?? 1;
    }

    public static function EliminarComisionPersonal($id){
        $sql = "UPDATE pmlx_personal_comisiones SET personal_situacion = 0 WHERE personal_id = $id";
        return self::SQL($sql);
    }

}
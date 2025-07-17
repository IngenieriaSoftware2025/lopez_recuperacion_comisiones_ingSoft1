<?php

namespace Model;

use Model\ActiveRecord;

class Permisos extends ActiveRecord {
    
    public static $tabla = 'pmlx_permiso';
    public static $idTabla = 'permiso_id';
    public static $columnasDB = 
    [
        'app_id',
        'permiso_tipo',
        'permiso_desc',
        'permiso_fecha',
        'permiso_situacion'
    ];
    
    public $permiso_id;
    public $app_id;
    public $permiso_tipo;
    public $permiso_desc;
    public $permiso_fecha;
    public $permiso_situacion;
    
    public function __construct($permiso = [])
    {
        $this->permiso_id = $permiso['permiso_id'] ?? null;
        $this->app_id = $permiso['app_id'] ?? 0;
        $this->permiso_tipo = $permiso['permiso_tipo'] ?? 'LECTURA';
        $this->permiso_desc = $permiso['permiso_desc'] ?? '';
        $this->permiso_fecha = $permiso['permiso_fecha'] ?? '';
        $this->permiso_situacion = $permiso['permiso_situacion'] ?? 1;
    }

    public static function EliminarPermiso($id){
        $sql = "UPDATE pmlx_permiso SET permiso_situacion = 0 WHERE permiso_id = $id";
        return self::SQL($sql);
    }

}
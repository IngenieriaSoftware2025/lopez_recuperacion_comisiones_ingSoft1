<?php

namespace Model;

use Model\ActiveRecord;

class Comision extends ActiveRecord {
    
    public static $tabla = 'pmlx_comision';
    public static $idTabla = 'comision_id';
    public static $columnasDB = 
    [
        'comision_titulo',
        'comision_descripcion',
        'comision_comando',
        'comision_fecha_inicio',
        'comision_duracion',
        'comision_duracion_tipo',
        'comision_fecha_fin',
        'comision_ubicacion',
        'comision_observaciones',
        'comision_estado',
        'comision_fecha_creacion',
        'comision_usuario_creo',
        'personal_asignado_id',
        'comision_situacion'
    ];
    
    public $comision_id;
    public $comision_titulo;
    public $comision_descripcion;
    public $comision_comando;
    public $comision_fecha_inicio;
    public $comision_duracion;
    public $comision_duracion_tipo;
    public $comision_fecha_fin;
    public $comision_ubicacion;
    public $comision_observaciones;
    public $comision_estado;
    public $comision_fecha_creacion;
    public $comision_usuario_creo;
    public $personal_asignado_id;
    public $comision_situacion;
    
    public function __construct($comision = [])
    {
        $this->comision_id = $comision['comision_id'] ?? null;
        $this->comision_titulo = $comision['comision_titulo'] ?? '';
        $this->comision_descripcion = $comision['comision_descripcion'] ?? '';
        $this->comision_comando = $comision['comision_comando'] ?? '';
        $this->comision_fecha_inicio = $comision['comision_fecha_inicio'] ?? '';
        $this->comision_duracion = $comision['comision_duracion'] ?? 0;
        $this->comision_duracion_tipo = $comision['comision_duracion_tipo'] ?? '';
        $this->comision_fecha_fin = $comision['comision_fecha_fin'] ?? '';
        $this->comision_ubicacion = $comision['comision_ubicacion'] ?? '';
        $this->comision_observaciones = $comision['comision_observaciones'] ?? '';
        $this->comision_estado = $comision['comision_estado'] ?? 'PROGRAMADA';
        $this->comision_fecha_creacion = $comision['comision_fecha_creacion'] ?? '';
        $this->comision_usuario_creo = $comision['comision_usuario_creo'] ?? 0;
        $this->personal_asignado_id = $comision['personal_asignado_id'] ?? null;
        $this->comision_situacion = $comision['comision_situacion'] ?? 1;
    }

    public static function EliminarComision($id){
        $sql = "UPDATE pmlx_comision SET comision_situacion = 0 WHERE comision_id = $id";
        return self::SQL($sql);
    }

}
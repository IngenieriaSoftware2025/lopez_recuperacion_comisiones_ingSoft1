<?php

namespace Model;

class HistorialAct extends ActiveRecord {
    
    protected static $tabla = 'pmlx_historial_act';
    protected static $columnasDB = [
        'historial_usuario_id',
        'historial_usuario_nombre',
        'historial_modulo',
        'historial_accion',
        'historial_descripcion',
        'historial_ip',
        'historial_ruta',
        'historial_situacion'
    ];

    public $historial_id;
    public $historial_usuario_id;
    public $historial_usuario_nombre;
    public $historial_modulo;
    public $historial_accion;
    public $historial_descripcion;
    public $historial_ip;
    public $historial_ruta;
    public $historial_situacion;
    public $historial_fecha_creacion;

    public function __construct($args = [])
    {
        $this->historial_id = $args['historial_id'] ?? null;
        $this->historial_usuario_id = $args['historial_usuario_id'] ?? '';
        $this->historial_usuario_nombre = $args['historial_usuario_nombre'] ?? '';
        $this->historial_modulo = $args['historial_modulo'] ?? '';
        $this->historial_accion = $args['historial_accion'] ?? '';
        $this->historial_descripcion = $args['historial_descripcion'] ?? '';
        $this->historial_ip = $args['historial_ip'] ?? '';
        $this->historial_ruta = $args['historial_ruta'] ?? '';
        $this->historial_situacion = $args['historial_situacion'] ?? 1;
        $this->historial_fecha_creacion = $args['historial_fecha_creacion'] ?? '';
    }
}
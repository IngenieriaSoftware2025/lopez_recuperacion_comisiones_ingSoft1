<div class="container py-5">
    <div class="row mb-5 justify-content-center">
        <div class="col-lg-8">
            <div class="card shadow-lg border-0 rounded-4">
                <div class="card-body bg-gradient" style="background: linear-gradient(90deg, #f8fafc 60%, #e3f2fd 100%);">
                    <div class="mb-4 text-center">
                        <h5 class="fw-bold text-secondary mb-2">¡Bienvenido a Nuestra Aplicación!</h5>
                        <h3 class="fw-bold text-primary mb-0">GESTIÓN DE COMISIONES</h3>
                    </div>
                    <form id="formComision" class="p-4 bg-white rounded-3 shadow-sm border">
                        <input type="hidden" id="comision_id" name="comision_id">
                        <input type="hidden" id="comision_usuario_creo" name="comision_usuario_creo" value="">
                        <input type="hidden" id="comision_situacion" name="comision_situacion" value="1">
                        
                        <div class="row g-4 mb-3">
                            <div class="col-md-6">
                                <label for="comision_titulo" class="form-label">Título de la Comisión</label>
                                <input type="text" class="form-control form-control-lg" id="comision_titulo" name="comision_titulo" placeholder="Ingrese título de la comisión" required>
                            </div>
                            <div class="col-md-6">
                                <label for="comision_comando" class="form-label">Comando que Pertenece</label>
                                <select class="form-control form-control-lg" id="comision_comando" name="comision_comando" required>
                                    <option value="">Seleccione el comando</option>
                                    <option value="BRIGADA DE COMUNICACIONES">BRIGADA DE COMUNICACIONES</option>
                                    <option value="INFORMATICA">INFORMATICA</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="row g-4 mb-3">
                            <div class="col-md-12">
                                <label for="comision_descripcion" class="form-label">Descripción</label>
                                <textarea class="form-control form-control-lg" id="comision_descripcion" name="comision_descripcion" rows="3" placeholder="Ingrese descripción detallada de la comisión" required></textarea>
                            </div>
                        </div>
                        
                        <div class="row g-4 mb-3">
                            <div class="col-md-6">
                                <label for="comision_fecha_inicio" class="form-label">Fecha de Inicio</label>
                                <input type="date" class="form-control form-control-lg" id="comision_fecha_inicio" name="comision_fecha_inicio" required>
                            </div>
                            <div class="col-md-6">
                                <label for="comision_ubicacion" class="form-label">Ubicación</label>
                                <input type="text" class="form-control form-control-lg" id="comision_ubicacion" name="comision_ubicacion" placeholder="Ingrese ubicación de la comisión" required>
                            </div>
                        </div>
                        
                        <div class="row g-4 mb-3">
                            <div class="col-md-6">
                                <label for="comision_duracion" class="form-label">Duración</label>
                                <input type="number" class="form-control form-control-lg" id="comision_duracion" name="comision_duracion" placeholder="Ingrese duración" min="1" required>
                            </div>
                            <div class="col-md-6">
                                <label for="comision_duracion_tipo" class="form-label">Tipo de Duración</label>
                                <select class="form-control form-control-lg" id="comision_duracion_tipo" name="comision_duracion_tipo" required>
                                    <option value="">Seleccione el tipo</option>
                                    <option value="HORAS">HORAS</option>
                                    <option value="DIAS">DÍAS</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="row g-4 mb-3">
                            <div class="col-md-6">
                                <label for="comision_estado" class="form-label">Estado</label>
                                <select class="form-control form-control-lg" id="comision_estado" name="comision_estado">
                                    <option value="PROGRAMADA">PROGRAMADA</option>
                                    <option value="EN_CURSO">EN CURSO</option>
                                    <option value="COMPLETADA">COMPLETADA</option>
                                    <option value="CANCELADA">CANCELADA</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label for="comision_observaciones" class="form-label">Observaciones</label>
                                <input type="text" class="form-control form-control-lg" id="comision_observaciones" name="comision_observaciones" placeholder="Observaciones adicionales">
                            </div>
                        </div>
                        
                        <div class="row g-4 mb-3">
                            <div class="col-md-12">
                                <label for="personal_asignado_id" class="form-label w-100 text-center">Personal Asignado</label>
                                <select class="form-control form-control-lg" id="personal_asignado_id" name="personal_asignado_id">
                                    <option value="">Seleccione personal (opcional)</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="d-flex justify-content-center gap-3">
                            <button class="btn btn-success btn-lg px-4 shadow" type="submit" id="BtnGuardar">
                                <i class="bi bi-save me-2"></i>Guardar
                            </button>
                            <button class="btn btn-warning btn-lg px-4 shadow d-none" type="button" id="BtnModificar">
                                <i class="bi bi-pencil-square me-2"></i>Modificar
                            </button>
                            <button class="btn btn-secondary btn-lg px-4 shadow" type="reset" id="BtnLimpiar">
                                <i class="bi bi-eraser me-2"></i>Limpiar
                            </button>
                            <button class="btn btn-primary btn-lg px-4 shadow" type="button" id="BtnBuscarComisiones">
                                <i class="bi bi-search me-2"></i>Buscar Comisiones
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div class="row justify-content-center mt-5" id="seccionTabla" style="display: none;">
        <div class="col-lg-11">
            <div class="card shadow-lg border-primary rounded-4">
                <div class="card-body">
                    <h3 class="text-center text-primary mb-4">Comisiones registradas en la base de datos</h3>

                    <div class="table-responsive">
                        <table class="table table-striped table-hover table-bordered align-middle rounded-3 overflow-hidden w-100" id="TableComisiones" style="width: 100% !important;">
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Título</th>
                                    <th>Comando</th>
                                    <th>Fecha Inicio</th>
                                    <th>Duración</th>
                                    <th>Ubicación</th>
                                    <th>Estado</th>
                                    <th>Personal Asignado</th>
                                    <th>Creado por</th>
                                    <th>Situación</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
<script src="<?= asset('build/js/comisiones/index.js') ?>"></script>
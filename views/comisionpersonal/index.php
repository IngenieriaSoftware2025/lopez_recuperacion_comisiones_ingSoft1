<div class="container py-5">
    <div class="row mb-5 justify-content-center">
        <div class="col-lg-8">
            <div class="card shadow-lg border-0 rounded-4">
                <div class="card-body bg-gradient" style="background: linear-gradient(90deg, #f8fafc 60%, #e3f2fd 100%);">
                    <div class="mb-4 text-center">
                        <h5 class="fw-bold text-secondary mb-2">¡Bienvenido a Nuestra Aplicación!</h5>
                        <h3 class="fw-bold text-primary mb-0">PERSONAL COMISIONES</h3>
                    </div>
                    <form id="formComisionPersonal" class="p-4 bg-white rounded-3 shadow-sm border">
                        <input type="hidden" id="personal_id" name="personal_id">
                        <input type="hidden" id="personal_situacion" name="personal_situacion" value="1">
                        
                        <div class="row g-4 mb-3">
                            <div class="col-md-6">
                                <label for="personal_nom1" class="form-label">Primer Nombre</label>
                                <input type="text" class="form-control form-control-lg" id="personal_nom1" name="personal_nom1" placeholder="Ingrese primer nombre" required>
                            </div>
                            <div class="col-md-6">
                                <label for="personal_nom2" class="form-label">Segundo Nombre</label>
                                <input type="text" class="form-control form-control-lg" id="personal_nom2" name="personal_nom2" placeholder="Ingrese segundo nombre" required>
                            </div>
                        </div>
                        
                        <div class="row g-4 mb-3">
                            <div class="col-md-6">
                                <label for="personal_ape1" class="form-label">Primer Apellido</label>
                                <input type="text" class="form-control form-control-lg" id="personal_ape1" name="personal_ape1" placeholder="Ingrese primer apellido" required>
                            </div>
                            <div class="col-md-6">
                                <label for="personal_ape2" class="form-label">Segundo Apellido</label>
                                <input type="text" class="form-control form-control-lg" id="personal_ape2" name="personal_ape2" placeholder="Ingrese segundo apellido" required>
                            </div>
                        </div>
                        
                        <div class="row g-4 mb-3">
                            <div class="col-md-6">
                                <label for="personal_tel" class="form-label">Teléfono</label>
                                <input type="text" class="form-control form-control-lg" id="personal_tel" name="personal_tel" placeholder="Ingrese número de teléfono" required>
                            </div>
                            <div class="col-md-6">
                                <label for="personal_dpi" class="form-label">DPI</label>
                                <input type="text" class="form-control form-control-lg" id="personal_dpi" name="personal_dpi" placeholder="Ingrese DPI" required>
                            </div>
                        </div>
                        
                        <div class="row g-4 mb-3">
                            <div class="col-md-6">
                                <label for="personal_correo" class="form-label">Correo Electrónico</label>
                                <input type="email" class="form-control form-control-lg" id="personal_correo" name="personal_correo" placeholder="ejemplo@ejemplo.com" required>
                            </div>
                            <div class="col-md-6">
                                <label for="personal_direccion" class="form-label">Dirección</label>
                                <input type="text" class="form-control form-control-lg" id="personal_direccion" name="personal_direccion" placeholder="Ingrese dirección" required>
                            </div>
                        </div>
                        
                        <div class="row g-4 mb-3">
                            <div class="col-md-6">
                                <label for="personal_rango" class="form-label">Rango</label>
                                <select class="form-select form-select-lg" id="personal_rango" name="personal_rango" required>
                                    <option value="">Seleccione un rango</option>
                                    <option value="OFICIAL">OFICIAL</option>
                                    <option value="ESPECIALISTA">ESPECIALISTA</option>
                                    <option value="TROPA">TROPA</option>
                                    <option value="PLANILLERO">PLANILLERO</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label for="personal_unidad" class="form-label">Unidad</label>
                                <select class="form-select form-select-lg" id="personal_unidad" name="personal_unidad" required>
                                    <option value="">Seleccione una unidad</option>
                                    <option value="BRIGADA DE COMUNICACIONES">BRIGADA DE COMUNICACIONES</option>
                                    <option value="INFORMATICA">INFORMATICA</option>
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
                            <button class="btn btn-primary btn-lg px-4 shadow" type="button" id="BtnBuscarPersonal">
                                <i class="bi bi-search me-2"></i>Buscar Personal
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
                    <h3 class="text-center text-primary mb-4">Personal registrado en la base de datos</h3>

                    <div class="table-responsive">
                        <table class="table table-striped table-hover table-bordered align-middle rounded-3 overflow-hidden w-100" id="TableComisionPersonal" style="width: 100% !important;">
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Primer Nombre</th>
                                    <th>Segundo Nombre</th>
                                    <th>Primer Apellido</th>
                                    <th>Segundo Apellido</th>
                                    <th>DPI</th>
                                    <th>Teléfono</th>
                                    <th>Correo</th>
                                    <th>Rango</th>
                                    <th>Unidad</th>
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
<script src="<?= asset('build/js/comisionpersonal/index.js') ?>"></script>
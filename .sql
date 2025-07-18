create database comisiones

CREATE TABLE pmlx_usuario(
usuario_id SERIAL PRIMARY KEY,
usuario_nom1 VARCHAR (50) NOT NULL,
usuario_nom2 VARCHAR (50) NOT NULL,
usuario_ape1 VARCHAR (50) NOT NULL,
usuario_ape2 VARCHAR (50) NOT NULL,
usuario_tel INT NOT NULL, 
usuario_direc VARCHAR (150) NOT NULL,
usuario_dpi VARCHAR (13) NOT NULL,
usuario_correo VARCHAR (100) NOT NULL,
usuario_contra LVARCHAR (1056) NOT NULL,
usuario_token LVARCHAR (1056) NOT NULL,
usuario_fecha_creacion DATE DEFAULT TODAY,
usuario_fecha_contra DATE DEFAULT TODAY,
usuario_fotografia LVARCHAR (2056),
usuario_rol VARCHAR (50) NOT NULL,
usuario_situacion SMALLINT DEFAULT 1
);


CREATE TABLE pmlx_aplicacion(
app_id SERIAL PRIMARY KEY,
app_nombre_largo VARCHAR (250) NOT NULL,
app_nombre_medium VARCHAR (150) NOT NULL,
app_nombre_corto VARCHAR (50) NOT NULL,
app_fecha_creacion DATE DEFAULT TODAY,
app_situacion SMALLINT DEFAULT 1
);



select * from pmlx_usuario
select * from pmlx_aplicacion


CREATE TABLE pmlx_permiso (
permiso_id SERIAL PRIMARY KEY,
app_id INTEGER NOT NULL,
permiso_tipo VARCHAR(50) DEFAULT 'LECTURA',
permiso_desc VARCHAR(250) NOT NULL,
permiso_fecha DATE DEFAULT TODAY,
permiso_situacion SMALLINT DEFAULT 1,
FOREIGN KEY (app_id) REFERENCES pmlx_aplicacion(app_id)
);

CREATE TABLE pmlx_asig_permisos(
asignacion_id SERIAL PRIMARY KEY,
asignacion_usuario_id INT NOT NULL,
asignacion_app_id INT NOT NULL,
asignacion_permiso_id INT NOT NULL,
asignacion_quitar_fechaPermiso DATETIME YEAR TO SECOND DEFAULT NULL,
asignacion_usuario_asigno INT NOT NULL,
asignacion_motivo VARCHAR (250) NOT NULL,
asignacion_fecha_creacion DATETIME YEAR TO SECOND DEFAULT CURRENT YEAR TO SECOND,
asignacion_situacion SMALLINT DEFAULT 1,
FOREIGN KEY (asignacion_usuario_id) REFERENCES pmlx_usuario(usuario_id),
FOREIGN KEY (asignacion_app_id) REFERENCES pmlx_aplicacion(app_id),
FOREIGN KEY (asignacion_permiso_id) REFERENCES pmlx_permiso(permiso_id),
FOREIGN KEY (asignacion_usuario_asigno) REFERENCES pmlx_usuario(usuario_id)
);

CREATE TABLE pmlx_personal_comisiones(
personal_id SERIAL PRIMARY KEY,
personal_nom1 VARCHAR(50) NOT NULL,
personal_nom2 VARCHAR(50) NOT NULL,
personal_ape1 VARCHAR(50) NOT NULL,
personal_ape2 VARCHAR(50) NOT NULL,
personal_dpi VARCHAR(13) NOT NULL,
personal_tel INT NOT NULL,
personal_correo VARCHAR(100),
personal_direccion VARCHAR(150),
personal_rango VARCHAR(50) NOT NULL,
personal_unidad VARCHAR(50) NOT NULL,
personal_situacion SMALLINT DEFAULT 1
);


CREATE TABLE pmlx_comision(
comision_id SERIAL PRIMARY KEY,
comision_titulo VARCHAR (250) NOT NULL,
comision_descripcion LVARCHAR (1056) NOT NULL,
comision_comando VARCHAR (50) NOT NULL,
comision_fecha_inicio DATE NOT NULL,
comision_duracion INT NOT NULL,
comision_duracion_tipo VARCHAR (10) NOT NULL,
comision_fecha_fin DATE NOT NULL,
comision_ubicacion VARCHAR (250) NOT NULL,
comision_observaciones LVARCHAR (1056),
comision_estado VARCHAR (50) DEFAULT 'PROGRAMADA',
comision_fecha_creacion DATE DEFAULT TODAY,
comision_usuario_creo INT NOT NULL,
personal_asignado_id INT,
comision_situacion SMALLINT DEFAULT 1,
FOREIGN KEY (comision_usuario_creo) REFERENCES pmlx_usuario(usuario_id),
FOREIGN KEY (personal_asignado_id) REFERENCES pmlx_personal_comisiones(personal_id)
);





CREATE TABLE pmlx_historial_act(
historial_id SERIAL PRIMARY KEY,
historial_usuario_id INT NOT NULL,
historial_usuario_nombre VARCHAR(150) NOT NULL,
historial_modulo VARCHAR(50) NOT NULL,
historial_accion VARCHAR(50) NOT NULL,
historial_descripcion VARCHAR(250) NOT NULL,
historial_ip VARCHAR(45),
historial_ruta VARCHAR(250),
historial_fecha_creacion DATETIME YEAR TO SECOND DEFAULT CURRENT YEAR TO SECOND,
historial_situacion SMALLINT DEFAULT 1,
FOREIGN KEY (historial_usuario_id) REFERENCES pmlx_usuario(usuario_id)
);


select * from pmlx_usuario



INSERT INTO informix.pmlx_usuario(usuario_id, usuario_nom1, usuario_nom2, usuario_ape1, usuario_ape2, usuario_tel, usuario_direc, usuario_dpi, usuario_correo, usuario_contra, usuario_token, usuario_fecha_creacion, usuario_fecha_contra, usuario_fotografia, usuario_rol, usuario_situacion) 
	VALUES(0, 'Paola', 'Mercedes', 'Lopez', 'Xitumul', 57444158, 'Guatemala', '3164164951503', 'pao140202@gmail.com', '$2y$10$FnCAm4kQPFQFdSi3cNP.N.EEqMUo1uIXjfI5D5.adZxfhK9Sfo2F2', '68796ff6e19da', '2025-7-17', '2025-7-17', '', '', 0)
GO
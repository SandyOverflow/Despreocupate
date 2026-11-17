CREATE DATABASE IF NOT EXISTS despreocupate_db;
USE despreocupate_db;

-- 1. Tabla USUARIO (Base para Pacientes y Profesionales)
CREATE TABLE USUARIO (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    contrasenya VARCHAR(250) NOT NULL,
    telefono VARCHAR(20),
    fecha_registro DATE NOT NULL,
    rol ENUM('paciente', 'profesional', 'admin') NOT NULL
) ENGINE=InnoDB;

-- 2. Tabla PACIENTE
CREATE TABLE PACIENTE (
    id_paciente INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha_nacimiento DATE,
    genero VARCHAR(30),
    objetivos_bienestar TEXT,
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. Tabla PROFESIONAL
CREATE TABLE PROFESIONAL (
    id_profesional INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    especialidad VARCHAR(100),
    numero_colegiado VARCHAR(100),
    titulacion VARCHAR(100),
    descripcion TEXT,
    verificado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Tabla CITA
CREATE TABLE CITA (
    id_cita INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_profesional INT NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    observaciones TEXT,
    estado ENUM('pendiente', 'confirmada', 'cancelada', 'finalizada') DEFAULT 'pendiente',
    FOREIGN KEY (id_paciente) REFERENCES PACIENTE(id_paciente),
    FOREIGN KEY (id_profesional) REFERENCES PROFESIONAL(id_profesional)
) ENGINE=InnoDB;

-- 5. Tabla HISTORIAL_BIENESTAR (Coordinación multidisciplinar)
CREATE TABLE HISTORIAL_BIENESTAR (
    id_historial INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT UNIQUE NOT NULL,
    antecedentes TEXT,
    objetivos TEXT,
    observaciones_generales TEXT,
    fecha_actualizacion DATE,
    FOREIGN KEY (id_paciente) REFERENCES PACIENTE(id_paciente)
) ENGINE=InnoDB;

-- 6. Tabla DOCUMENTO
CREATE TABLE DOCUMENTO (
    id_documento INT AUTO_INCREMENT PRIMARY KEY,
    id_historial INT NOT NULL,
    id_profesional INT NOT NULL,
    titulo VARCHAR(150),
    contenido TEXT,
    fecha_creacion DATE,
    tipo_documento ENUM('dieta', 'rutina', 'informe', 'recomendación', 'otro'),
    FOREIGN KEY (id_historial) REFERENCES HISTORIAL_BIENESTAR(id_historial),
    FOREIGN KEY (id_profesional) REFERENCES PROFESIONAL(id_profesional)
) ENGINE=InnoDB;

-- 7. Tabla PAGO
CREATE TABLE PAGO (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_profesional INT NOT NULL,
    id_cita INT,
    cantidad DECIMAL(10,2) NOT NULL,
    metodo_pago VARCHAR(50),
    estado ENUM('pendiente', 'pagado', 'fallido', 'reembolsado'),
    fecha_pago DATE,
    FOREIGN KEY (id_paciente) REFERENCES PACIENTE(id_paciente),
    FOREIGN KEY (id_profesional) REFERENCES PROFESIONAL(id_profesional),
    FOREIGN KEY (id_cita) REFERENCES CITA(id_cita)
) ENGINE=InnoDB;

-- 8. Tabla MENSAJE
CREATE TABLE MENSAJE (
    id_mensaje INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_profesional INT NOT NULL,
    contenido TEXT NOT NULL,
    fecha_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
    leido BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_paciente) REFERENCES PACIENTE(id_paciente),
    FOREIGN KEY (id_profesional) REFERENCES PROFESIONAL(id_profesional)
) ENGINE=InnoDB;

-- 9. Tabla VALORACIÓN
CREATE TABLE VALORACION (
    id_valoracion INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_profesional INT NOT NULL,
    puntuacion INT CHECK (puntuación BETWEEN 1 AND 5),
    comentario TEXT,
    fecha DATE,
    FOREIGN KEY (id_paciente) REFERENCES PACIENTE(id_paciente),
    FOREIGN KEY (id_profesional) REFERENCES PROFESIONAL(id_profesional)
) ENGINE=InnoDB;

-- 10. Tabla SESION (Para gestión de Tokens y accesos seguros)
CREATE TABLE SESION (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    token VARCHAR(250) NOT NULL,
    inicio DATE,
    expiracion DATE,
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario)
) ENGINE=InnoDB;

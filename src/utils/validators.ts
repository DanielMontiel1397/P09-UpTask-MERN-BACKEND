import { body, param } from "express-validator";
import { taskStatus } from "../models/Task";

export const validarName = body("name")
    .trim()
    .notEmpty().withMessage("El nombre es obligatorio");

export const validarEmail = body("email")
    .trim()
    .notEmpty().withMessage("El correo electrónico es obligatorio")
    .isEmail().withMessage("El correo electrónico debe ser válido");

export const validarPassword = body("password")
    .notEmpty().withMessage("La contraseña es obligatoria")
    .isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres");

export const validarConfirmPassword = body("password_confirmation")
    .notEmpty().withMessage("La confirmación de contraseña es obligatoria")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Las contraseñas deben coincidir");

export const validarActualPassword = body("actualPassword")
    .notEmpty().withMessage("La contraseña actual es obligatoria")
    .isLength({ min: 6 }).withMessage("La contraseña actual debe tener al menos 6 caracteres");

export const validarProjectName = body("projectName")
    .trim()
    .notEmpty().withMessage("El Nombre del Proyecto es Obligatorio");

export const validarClientName = body("clientName")
    .trim()
    .notEmpty().withMessage("El Nombre del Cliente es Obligatorio");

export const validarDescription = body("description")
    .trim()
    .notEmpty().withMessage("La Descripción es Obligatoria");

export const validarStatus = body("status")
    .isIn(Object.values(taskStatus)).withMessage("Estado no válido");

export const validarToken = body("token")
    .notEmpty().withMessage("El token no puede ir vacio")

export const validarProjectId = [
    param('projectId')
        .isMongoId().withMessage('ID del proyecto no válido')
]

export const validarUserId = body('id')
    .isMongoId().withMessage('ID no válido');

export const validarContent = body("content")
    .trim()
    .notEmpty().withMessage("La nota tiene que tener contenido");

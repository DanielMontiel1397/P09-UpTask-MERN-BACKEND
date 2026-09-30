import { Router } from "express";
import { AuthController } from "../controllers/AuthController"
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { validarConfirmPassword, validarEmail, validarName, validarPassword, validarToken } from "../utils/validators";
import { protectRoutesUser } from "../middleware/protectUser";

const router = Router();

router.post('/create', 
    validarName,
    validarEmail,
    validarPassword,
    validarConfirmPassword,
    handleInputErrors,
    AuthController.createAccount)

router.post('/confirmar-cuenta/',
    validarToken,
    handleInputErrors,
    AuthController.confirmAccount
)

router.post('/login',
    validarEmail,
    validarPassword,
    handleInputErrors,
    AuthController.loginUser
)

router.post('/request-code',
    validarEmail,
    handleInputErrors,
    AuthController.requestConfirmationCode
)

router.post('/forgot-password',
    validarEmail,
    handleInputErrors,
    AuthController.forgotPassword
)

router.post('/confirm-code',
    validarToken,
    handleInputErrors,
    AuthController.confirmCodeResetPassword
)

router.post('/update-password/:token',
    param('token').isNumeric().withMessage("Token no válido"),
    validarPassword,
    validarConfirmPassword,
    handleInputErrors,
    AuthController.updatePassword
)

router.get('/user',
    protectRoutesUser,
    AuthController.user
)

router.post('/check-password',
    protectRoutesUser,
    validarPassword,
    handleInputErrors,
    AuthController.checkPassword
)
export default router;
import { Router } from "express";
import { protectRoutesUser } from "../middleware/protectUser";
import { ProfileController } from "../controllers/ProfileController";
import { validarActualPassword, validarConfirmPassword, validarEmail, validarName, validarPassword } from "../utils/validators";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

router.use(protectRoutesUser);

router.put('/editProfile',
    validarName,
    validarEmail,
    handleInputErrors,
    ProfileController.EditProfile
)

router.put('/editPassword',
    validarPassword,
    validarConfirmPassword,
    validarActualPassword,
    handleInputErrors,
    ProfileController.EditPassword
)

export default router;
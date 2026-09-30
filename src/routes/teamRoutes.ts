import { Router } from "express";

import { TeamMemberController } from "../controllers/TeamController";
import { validateProjectId } from "../middleware/params";
import { validateProjectExists } from "../middleware/project";
import { handleInputErrors } from "../middleware/validation";
import { validarEmail } from "../utils/validators";
import { protectRoutesUser } from "../middleware/protectUser";

const router = Router();

router.use(protectRoutesUser);
router.param('projectId', validateProjectId);
router.param('projectId', validateProjectExists);

router.post('/:projectId/team/find',
    validarEmail,
    handleInputErrors,
    TeamMemberController.findMemberByEmail
)

router.post('/:projectId/team',
    TeamMemberController.addMemberById
)

router.delete('/:projectId/team/:userId',
    TeamMemberController.removeMemberById
)

router.get('/:projectId/team',
    TeamMemberController.getMembers
)

export default router;
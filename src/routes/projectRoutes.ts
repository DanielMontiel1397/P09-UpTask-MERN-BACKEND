import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { validateProjectExists } from "../middleware/project";
import {validarClientName,validarDescription,validarProjectName} from "../utils/validators";
import { protectRoutesUser } from "../middleware/protectUser";
import { validateProjectId } from "../middleware/params";

const router = Router();


router.use(protectRoutesUser);
router.param('projectId', validateProjectId);
router.param('projectId', validateProjectExists);

router.post('/', 
    validarProjectName,
    validarClientName,
    validarDescription,
    handleInputErrors,
    ProjectController.createProject);

router.get('/',
    ProjectController.getAllProjects);

router.get('/:projectId',
    ProjectController.getProjectByid
);

router.put('/:projectId',
    validarProjectName,
    validarClientName,
    validarDescription,
    handleInputErrors,
    ProjectController.updateProject);

router.delete('/:projectId',
    handleInputErrors,
    ProjectController.deleteProject
);


export default router;
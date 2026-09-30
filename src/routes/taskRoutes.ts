import { Router } from "express";
import {validarDescription,validarName,validarStatus} from "../utils/validators";
import { TaskController } from "../controllers/TaskController";
import { validateProjectExists } from "../middleware/project";
import { handleInputErrors } from "../middleware/validation";
import { hasAuthorization, taskBelongsToProject, validateTaskExists } from "../middleware/task";
import { validateProjectId, validateTaskId } from "../middleware/params";
import { protectRoutesUser } from "../middleware/protectUser";

const router = Router();

router.use(protectRoutesUser);
router.param('projectId', validateProjectId);
router.param('projectId', validateProjectExists);
router.param('taskId', validateTaskId);
router.param('taskId', validateTaskExists);

//Crear Tareas
router.post('/:projectId/tasks',
    validarName,
    validarDescription,
    handleInputErrors,
    hasAuthorization,
    TaskController.createTask
);

//Obtener Tareas por proyecto
router.get('/:projectId/tasks',
    TaskController.getAllTask
);

//Obtener Tareas por Id
router.get('/:projectId/tasks/:taskId',
    taskBelongsToProject,
    TaskController.getTaskById
)

//Editar una Tarea por id
router.put('/:projectId/tasks/:taskId',
    validarName,
    validarDescription,
    handleInputErrors,
    taskBelongsToProject,
    hasAuthorization,
    TaskController.updateTaskById
)

//Eliminar una Tarea por id
router.delete('/:projectId/tasks/:taskId',
    taskBelongsToProject,
    hasAuthorization,
    TaskController.deleteTaskById
)

//Actualizar Estado por Id
router.patch('/:projectId/tasks/:taskId',
    validarStatus,
    handleInputErrors,
    TaskController.updateStatusTaskById
)

export default router;
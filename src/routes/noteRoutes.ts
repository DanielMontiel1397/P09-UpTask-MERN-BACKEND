import { Router } from "express";
import { NoteController } from "../controllers/NoteController";
import { protectRoutesUser } from "../middleware/protectUser";
import { validateNoteId, validateProjectId, validateTaskId } from "../middleware/params";
import { validateProjectExists } from "../middleware/project";
import { validateTaskExists } from "../middleware/task";
import { validarContent } from "../utils/validators";
import { handleInputErrors } from "../middleware/validation";
import { noteBelongsToTaskOrUser, validateNoteExists } from "../middleware/note";

const router = Router();

router.use(protectRoutesUser);
router.param('projectId', validateProjectId);
router.param('projectId', validateProjectExists);
router.param('taskId', validateTaskExists);
router.param('taskId', validateTaskId);
router.param('noteId', validateNoteId);
router.param('noteId', validateNoteExists);


router.post('/:projectId/tasks/:taskId/notes',
    validarContent,
    handleInputErrors,
    NoteController.createNote
)

router.get('/:projectId/tasks/:taskId/notes',
    NoteController.getNotesByTask
)

router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    noteBelongsToTaskOrUser,
    NoteController.deleteNoteById
)


export default router;
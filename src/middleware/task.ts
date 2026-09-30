import type { Request, Response, NextFunction } from 'express'
import Task, { TaskType } from '../models/Task'

//Reescribir request de manera global

declare global {
    namespace Express {
        interface Request {
            task: TaskType
        }
    }
}

export async function validateTaskExists(req: Request, res: Response, next: NextFunction) {
   
    const { taskId } = req.params;
    
    try {
        const task = await Task.findById(taskId);
        
        if (!task) {
            const error = new Error('Tarea no encontrada');
            return res.status(404).json({
                error: error.message
            })
        }
        
        req.task = task;
    } catch (error) {
        return res.status(500).json({
            error: 'Hubo un error'
        })
    }

    next();

}

export async function taskBelongsToProject(req: Request, res: Response, next: NextFunction) {
    
    if (req.project._id.toString() !== req.task.project.toString()) {
        
        const error = new Error("Acción no válida");
        return res.status(400).json({
            error: error.message
        })
    }

    next();
}

export async function hasAuthorization(req: Request, res: Response, next: NextFunction) {

    if (req.user._id.toString() !== req.project.manager.toString()) {
        const error = new Error("Acción no válida");
        return res.status(400).json({
            error: error.message
        })
    }

    next();
}


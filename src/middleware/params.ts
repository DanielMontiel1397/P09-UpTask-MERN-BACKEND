import { Request, Response, NextFunction } from "express"
import mongoose from "mongoose";

export const validateProjectId = (req: Request, res : Response, next : NextFunction ) => {
    const {projectId} = req.params;

    if(typeof projectId !== 'string' || !mongoose.Types.ObjectId.isValid(projectId)){
        return res.status(400).json({
            error: 'ID de proyecto no válido'
        })
    }

    next();
}

export const validateTaskId = (req: Request, res : Response, next : NextFunction ) => {
    const {taskId} = req.params;

    if(typeof taskId !== 'string' || !mongoose.Types.ObjectId.isValid(taskId)){
        return res.status(400).json({
            error: 'ID de tarea no válido'
        })
    }

    next();
}

export const validateNoteId = (req: Request, res : Response, next : NextFunction ) => {
    const {noteId} = req.params;

    if(typeof noteId !== 'string' || !mongoose.Types.ObjectId.isValid(noteId)){
        return res.status(400).json({
            error: 'ID de nota no válido'
        })
    }

    next();
}
import { Request, Response, NextFunction } from "express";
import Note, { NoteType } from "../models/Note";
import User from "../models/User";

declare global{
    namespace Express {
        interface Request {
            note: NoteType
        }
    }
}

export const validateNoteExists = async (req : Request, res: Response, next: NextFunction) => {
    const {noteId} = req.params;

    try {
        
        const note = await Note.findById(noteId);

        if(!note){
            const error = new Error('Nota no encontrada');
            return res.status(404).json({
                error: error.message
            })
        }

        req.note = note;

        next();

    } catch (error) {
        res.status(500).json({
            error: 'Error en el servidor'
        })
    }
}

export const noteBelongsToTaskOrUser = async (req : Request, res : Response, next : NextFunction) => {
    const {task, note, user} = req;

    if(task._id.toString() !== note.task._id.toString() || note.createdBy.toString() !== user._id.toString()){
        const error = new Error("Solo el Usuario que creo esta tarea puede editar o eliminar la nota");
        return res.status(401).json({
            error: error.message
        })
    }

    next();
}
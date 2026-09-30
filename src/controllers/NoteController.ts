import type { Request, Response } from "express";
import Note, { NoteType } from "../models/Note";

export class NoteController {

    static createNote = async (req: Request<{}, {}, NoteType, {}>, res: Response) => {
        
        const { content } = req.body
      
        const { task, user } = req;

        try {
            const dataCreateTask = {
                content,
                task: task._id,
                createdBy: user._id
            }

            const note = new Note(dataCreateTask);
            task.notes.push(note._id);

            await Promise.allSettled([note.save(), task.save()]);

            return res.status(200).json({
                data: {
                    Note: note
                },
                msg: 'Nota Creada Correctamente'
            })

        } catch (error) {
            res.status(500).json({
                error: 'Hubo un Error'
            })
        }
    }

    static getNotesByTask = async (req : Request, res : Response) => {

        const {task} = req;

        try {
            
            const notes = await Note.find({
                task: task._id
            })

            return res.status(200).json({
                data: {
                    Notes: notes
                },
                msg: 'Notas Obtenidas Correctamente'
            })

        } catch (error) {
            res.status(500).json({
                error: 'Hubo un Error'
            })
        }

    }

    static deleteNoteById = async (req : Request, res : Response) => {

        const {task, note, user} = req;

        try {
            
            task.notes = task.notes.filter( notes => notes._id !== note._id);

            await Promise.allSettled([note.deleteOne(), task.save()]);

            return res.status(200).json({
                msg: 'Nota Eliminada Correctamente'
            })

        } catch (error) {
            res.status(500).json({
                error: 'Hubo un Error'
            })
        }

    }

}


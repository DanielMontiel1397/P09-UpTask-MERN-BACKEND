import type { Request, Response, NextFunction } from "express";
import Project, { ProjectType } from "../models/Project";
import mongoose from "mongoose";

//Reescribir request de manera global

declare global{
    namespace Express {
        interface Request {
            project: ProjectType //Agregamos a la interface de Request el project de tipo Project Type
        }
    }
}

export async function validateProjectExists(req: Request, res: Response, next: NextFunction) {

    const {projectId} = req.params;
    const {user} = req;

    try {

        const project = await Project.findById(projectId);
        
        if (!project) {
            const error = new Error('Proyecto no encontrado')
            return res.status(404).json({ error: error.message });
        }

        //El usuario autenticado le pertenece el proyecto
        if(project.manager.toString() !== user._id.toString() && !project.team.includes(req.user._id)){
            const error = new Error('Acción no valida')
            return res.status(403).json({ error: error.message });
        }

        req.project = project;

        next();

    } catch (error) {

        res.status(500).json({
            error: 'Error en el servidoooor'
        })

    }

}
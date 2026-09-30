import type {Request, Response} from 'express';
import Project from '../models/Project';

export class ProjectController {

    //////CREAR PROYECTO/////
    static createProject = async (req: Request, res: Response) => {
        
        const project = new Project(req.body);

        try {

            //Asignar manager
            project.manager = req.user._id;

            await project.save();

            const newProject = await Project.findById(project._id)
                .populate('manager', '_id name email')
                .select('projectName clientName description _id manager createdAt updatedAt')
            
            return res.json({
                data:  newProject,
                msg: 'Proyecto Creado Correctamente'
            })

        } catch (error) {
            console.log(error);
        }
    }

    static getAllProjects = async (req: Request, res: Response) => {
         
        const {user} = req;

        try {

            const projects = await Project.find({
                $or: [
                    {manager: user._id},
                    {team: user._id}
                ]
            })
            .select('_id projectName clientName description manager tasks createdAt updatedAt')
            .populate('manager', 'name email')
            .populate('tasks', '_id name status');

            res.json({
                data: projects
            });
         } catch (error) {
            console.log(error);
         }
    }

    static getProjectByid = async (req: Request, res: Response) => {
         
        const {projectId} = req.params;
        
        try {
            const project = await Project.findById(projectId)
                .populate('manager', '_id name email')
                .populate('tasks', '_id name description status project createdAt updatedAt');

            res.json({
                data: project
            });
        } catch (error) {
            console.log(error);
        }

    }

    static updateProject = async (req: Request, res: Response) => {
      
        const {projectId} = req.params;

        try {
            const project = await Project.findById(projectId);

            project.set(req.body);
            await project.save();
            
            return res.json({
                msg: 'Proyecto Actualizado Correctamente'
            });
            
        } catch (error) {
            console.log(error);
        }

    }

    static deleteProject = async (req: Request, res: Response) => {
         
        const {projectId} = req.params;

        try {
            const project = await Project.findById(projectId);

            await project.deleteOne();
            
            return res.json({
                msg: 'Proyecto Eliminado Correctamente'
            });
            
            
        } catch (error) {
            console.log(error);
        }

    }

}
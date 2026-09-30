import type { Request, Response } from "express"
import Task from "../models/Task";

export class TaskController {

    static createTask = async (req: Request, res: Response) => {

        const { project } = req;

        try {

            const task = new Task(req.body);

            task.project = project._id;

            project.tasks.push(task._id);

            await Promise.allSettled([task.save(), project.save()]);

            return res.status(200).json({
                data: {
                    Task: task
                },
                msg: 'Tarea Creada Correctamente'
            })

        } catch (error) {
            res.status(500).json({
                error: 'Hubo un Error'
            })
        }
    }

    static getAllTask = async (req: Request, res: Response) => {

        const { project } = req;

        try {

            const tasks = await Task.find({
                project: project._id
            })
                .select('_id name description status project createdAt updatedAt')

            return res.status(200).json({
                data: {
                    Tasks: tasks
                },
                msg: "Tareas Obtenidas Correctamente"
            })

        } catch (error) {
            res.status(500).json({
                error: 'Hubo un Error'
            })
        }

    }

    static getTaskById = async (req: Request, res: Response) => {

        const { taskId } = req.params;

        try {

            const task = await Task.findById(taskId)
                .populate({
                    path: 'completedBy.user',
                    select: '_id name'
                })
                .populate({
                    path: 'notes',
                    populate: {path: 'createdBy', select: '_id name email'}
                })


            return res.json({
                data: {
                    Task: task
                },
                msg: "Tarea Obtenida Correctamente"
            });

        } catch (error) {
            res.status(500).json({
                error: 'Hubo un Error'
            })
        }

    }

    static updateTaskById = async (req: Request, res: Response) => {

        const { task } = req;

        try {

            task.set(req.body);
            await task.save();

            return res.json({
                data: {
                    Task: task
                },
                msg: 'Tarea Actualizada Correctamente'
            })

        } catch (error) {
            res.status(500).json({
                error: 'Hubo un Error'
            })
            console.log(error);
        }
    }

    static deleteTaskById = async (req: Request, res: Response) => {

        const { task } = req;

        const { project } = req;

        try {

            project.tasks = req.project.tasks.filter(taskProject => taskProject._id !== task._id);

            await Promise.allSettled([task.deleteOne(), project.save()]);

            return res.json({
                msg: "Tarea Eliminada Correcamente"
            })

        } catch (error) {
            return res.status(500).json({
                error: 'Hubo un Error'
            })
        }
    }

    static updateStatusTaskById = async (req: Request, res: Response) => {

        const { status } = req.body;
        const { user } = req;
        const { task } = req;

        try {

            const data = {
                user: user._id,
                status: status
            }


            task.set({
                status
            });

            task.completedBy.push(data)

            await task.save();

            return res.json({
                data: {
                    Task: task
                },
                msg: "Estado Actualizado Correctamente"
            })

        } catch (error) {
            return res.status(500).json({
                error: 'Hubo un Error'
            })
        }

    }

}
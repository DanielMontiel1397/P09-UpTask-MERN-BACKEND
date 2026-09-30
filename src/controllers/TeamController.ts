import type { Request, Response } from "express"
import User from "../models/User";
import Project from "../models/Project";

export class TeamMemberController {

    static findMemberByEmail = async (req: Request, res: Response) => {

        const { email } = req.body;

        try {
            const user = await User.findOne({ email }).select('_id name email');

            if (!user) {
                const error = new Error('Usuario inexistente');
                return res.status(404).json({
                    error: error.message
                })
            }

            return res.json({
                data: {
                    user: user
                },
                msg: 'Usuario encontrado'
            })
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error: "Error en el servidor"
            });
        }

    }

    static addMemberById = async (req: Request, res: Response) => {

        const { id } = req.body;

        try {
            const user = await User.findById(id).select('_id name email');

            if (!user) {
                const error = new Error('Usuario inexistente');
                return res.status(404).json({
                    error: error.message
                })
            }

            if (req.user.email === user.email) {
                const error = new Error('No puedes agregarte a ti mismo como miembro');
                return res.status(403).json({
                    error: error.message
                });
            }

            if(req.project.team.some(team => team.toString() === user._id.toString())){

                const error = new Error('El usuario ya existe en el proyecto');
                return res.status(409).json({
                    error: error.message
                });

            }

            req.project.team.push(user._id);

            await req.project.save();

            return res.json({
                msg: 'Usuario Agregado Correctamente'
            })

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error: "Error en el servidor"
            });
        }

    }

    static removeMemberById = async (req: Request, res: Response) => {
        
        const { userId } = req.params;

        try {
            const user = await User.findById(userId).select('_id name email');

            if (!user) {
                const error = new Error('Miembro inexistente en el proyecto');
                return res.status(404).json({
                    error: error.message
                })
            }

            if (req.user.email === user.email) {
                const error = new Error('No puedes eliminarte a ti mismo');
                return res.status(403).json({
                    error: error.message
                });
            }

            if(!req.project.team.some(team => team.toString() === user._id.toString())){

                const error = new Error('El usuario no se encuentra en tu equipo');
                return res.status(409).json({
                    error: error.message
                });

            }

            req.project.team = req.project.team.filter(teamMember => teamMember.toString() !== userId);

            await req.project.save();

            return res.json({
                msg: 'Usuario Eliminado del Equipo'
            })

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error: "Error en el servidor"
            });
        }

    }

    static getMembers = async (req: Request, res: Response) => {
        
        const {project} = req;

        try {
            const members = await Project.findById(project._id).populate({
                path: 'team',
                select: '_id name email'
            })

            if (!members) {
                const error = new Error('No hay miembros agregados en el proyecto');
                return res.status(404).json({
                    error: error.message
                })
            }


            return res.json({
                data: {
                    Members: members.team
                },
                msg: 'Miembros obtenidos correctamente'
            })

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error: "Error en el servidor"
            });
        }

    }

}
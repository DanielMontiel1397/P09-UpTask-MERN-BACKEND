import { Request, Response } from "express"
import User from "../models/User";
import { hashPassword } from "../utils/auth";

export class ProfileController{
    static EditProfile = async (req: Request, res: Response) => {

        const {name, email} = req.body;
        const {user} = req;

        try {
            
            //Validar si el email es unico
            if(email !== user.email){
                const emailExists  = await User.findOne({email: email});

                if(emailExists){
                    const error = new Error('El email ya está registrado por otro usuario');
                    return res.status(409).json({
                        error: error.message
                    })
                }
            }

            user.name = name;
            user.email = email;

            await user.save();

            res.status(200).json({
                msg: 'Perfil Actualizado Correctamente'
            })

        } catch (error) {
            res.status(500).json({
                error: 'Error en el servidor al editar perfil'
            })
        }

    }

    static EditPassword = async (req: Request, res: Response) => {
        const {password, actualPassword} = req.body;
        
        try {
            const user = await User.findById(req.user._id);
            //Validar Password
            const verifyPassword = await user.verifyPassword(actualPassword);

            if(!verifyPassword){
                const error = new Error('La contraseña Actual es incorrecta')
                return res.status(401).json({
                    error: error.message
                })
            };

            const passwordHash = await hashPassword(password);

            user.password = passwordHash;

            await user.save();

            return res.status(200).json({
                msg: 'Contraseña Actualizada'
            })

        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: 'Error en el servidor al actualizar la contraseña'
            })
        }
    }
}
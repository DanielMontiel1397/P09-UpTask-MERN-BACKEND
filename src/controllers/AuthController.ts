import type { Request, Response } from "express"

import User from "../models/User"
import { hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/generateToken";
import { emailConfirmAccount } from "../utils/emailConfirmAccount";
import { emailForgotPassword } from "../utils/emailResetPassword";
import { generateJWT } from "../utils/jwt";

export class AuthController {

    static createAccount = async (req: Request, res: Response) => {
        const { email, password, name } = req.body;

        try {
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(400).json({
                    error: "El correo ya está registrado"
                });
            }

            //Hash Password
            const passwordHash = await hashPassword(password);

            const user = new User({
                email,
                password: passwordHash,
                name
            });

            //Generar Token
            const token = new Token();
            token.token = generateToken();
            token.user = user._id;

            //Enviar el email
            const result = await emailConfirmAccount({
                email,
                token: token.token,
                user
            })

            console.log(('Email Enviado: ' + result.messageId));

            await Promise.allSettled([user.save(), token.save()]);


            return res.status(201).json({
                msg: "Cuenta creada correctamente, revise su correo electronico para confirmar su email"
            });

        } catch (error) {

            console.error(error);
            return res.status(500).json({
                error: "Error en el servidor"
            });

        }
    }


    static confirmAccount = async (req: Request, res: Response) => {

        const { token } = req.body;

        try {
            const tokenExists = await Token.findOne({ token });

            if (!tokenExists) {
                const error = new Error('Token inválido o ya utilizado');
                return res.status(401).json({
                    error: error.message
                })
            }

            const user = await User.findById(tokenExists.user);

            if (!user) {
                const error = new Error("El usuario asociado al token no existe");
                return res.status(404).json({
                    error: error.message
                })
            }

            user.confirmed = true;

            await Promise.allSettled([user.save(), tokenExists.deleteOne()]);

            return res.status(200).json({
                msg: 'Cuenta confirmada correctamente'
            })

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error: "Error en el servidor"
            });
        }
    }

    static loginUser = async (req: Request, res: Response) => {

        const { email, password } = req.body;

        try {

            const user = await User.findOne({ email });

            if (!user) {
                const error = new Error('Credenciales no válidas');
                return res.status(401).json({
                    error: error.message
                })
            };

            if (!user.confirmed) {
                const error = new Error('Tu Cuenta no ha sido confirmada');
                return res.status(403).json({
                    error: error.message
                })
            }

            const passwordCorrecto = await user.verifyPassword(password);

            if (!passwordCorrecto) {
                const error = new Error('Credenciales no válidas');
                return res.status(401).json({
                    error: error.message
                })
            }

            const tokenJWT = generateJWT({
                name: user.name,
                id: user._id
            })


            return res.status(200).json({
                token: tokenJWT,
                msg: 'Usuario Logueado Correctamente'
            })

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error: "Error en el servidor"
            });
        }
    }

    static requestConfirmationCode = async (req: Request, res: Response) => {

        const { email } = req.body;

        try {
            const user = await User.findOne({ email });

            if (!user) {
                const error = new Error('El Usuario no esta registrado');
                return res.status(404).json({
                    error: error.message
                });
            }

            if (user.confirmed) {
                const error = new Error('El Usuario ya esta confirmado');
                return res.status(409).json({
                    error: error.message
                });
            }

            //REvisar si el usuario ya tiene un token para borrarlo
            const tokenExits = await Token.findOne({ user: user._id })

            if (tokenExits) {
                await Token.deleteMany({ user: user._id })
            }

            //Generar Token
            const token = new Token();
            token.token = generateToken();
            token.user = user._id;

            //Enviar el email
            const result = await emailConfirmAccount({
                email,
                token: token.token,
                user
            })

            console.log(('Email Enviado: ' + result.messageId));

            await Promise.allSettled([user.save(), token.save()]);


            return res.status(201).json({
                msg: "Email de confirmación enviado"
            });

        } catch (error) {

            console.error(error);
            return res.status(500).json({
                error: "Error en el servidor"
            });

        }
    }

    static forgotPassword = async (req: Request, res: Response) => {

        const { email } = req.body;

        try {
            const user = await User.findOne({ email });

            if (!user) {
                const error = new Error('El Usuario no esta registrado');
                return res.status(404).json({
                    error: error.message
                });
            }

            //REvisar si el usuario ya tiene un token para borrarlo
            const tokenExits = await Token.findOne({ user: user._id })

            if (tokenExits) {
                await Token.deleteMany({ user: user._id })
            }

            //Generar Token
            const token = new Token();
            token.token = generateToken();
            token.user = user._id;

            //Enviar el email
            const result = await emailForgotPassword({
                email,
                token: token.token,
                user
            })

            console.log(('Email Enviado: ' + result.messageId));

            await Promise.allSettled([token.save()]);


            return res.status(201).json({
                msg: "Se le envió un link para reestablecer su password"
            });

        } catch (error) {

            console.error(error);
            return res.status(500).json({
                error: "Error en el servidor"
            });

        }
    }

    static confirmCodeResetPassword = async (req: Request, res: Response) => {

        const { token } = req.body;

        try {
            const tokenExists = await Token.findOne({ token });

            if (!tokenExists) {
                const error = new Error('Token inválido o ya utilizado');
                return res.status(401).json({
                    error: error.message
                })
            }

            const user = await User.findById(tokenExists.user);

            if (!user) {
                const error = new Error("El usuario asociado al token no existe");
                return res.status(404).json({
                    error: error.message
                })
            }


            return res.status(200).json({
                msg: 'Token válido, Reestablezca su contraseña'
            })

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error: "Error en el servidor"
            });
        }
    }

    static updatePassword = async (req: Request, res: Response) => {

        const { password } = req.body;
        const {token} = req.params;

        try {
            const tokenExists = await Token.findOne({ token });

            if (!tokenExists) {
                const error = new Error('Token inválido o ya utilizado');
                return res.status(401).json({
                    error: error.message
                })
            }

            const user = await User.findById(tokenExists.user);

            if (!user) {
                const error = new Error("El usuario asociado al token no existe");
                return res.status(404).json({
                    error: error.message
                })
            }

            const nuevoPasswordHash = await hashPassword(password);

            user.password = nuevoPasswordHash;

            await Promise.allSettled([user.save(), tokenExists.deleteOne()]);

            return res.status(200).json({
                msg: 'Contraseña actualizada correctamente'
            })

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error: "Error en el servidor"
            });
        }

    }

    static user = async (req: Request, res: Response) => {

        return res.status(200).json({
            valid: true,
            data: {
                user: req.user
            },
            msg: 'Usuario Obtenido Correctamente'
        });

    }

    static checkPassword = async (req: Request, res: Response) => {

        const {password} = req.body;

        try {
            
            const user = await User.findById(req.user._id);

            const verifyPassword = await user.verifyPassword(password);

            if(!verifyPassword){
                const error = new Error('La contraseña es incorrecta');
                return res.status(401).json({
                    error: error.message
                })
            }

            return res.send({
                msg: "Contraseña correcta"
            })

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error: "Error en el servidor al verificar el password"
            });
        }

    }
}
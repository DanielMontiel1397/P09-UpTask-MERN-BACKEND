import { transport } from "../config/nodemailer";
import { UserType } from "../models/User";

type EmailForgotPasswordProps = {
    email: string,
    token: string,
    user: UserType
}

export const emailForgotPassword = async ({ email, token, user }: EmailForgotPasswordProps) => {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const resetUrl = `${frontendUrl}/auth/confirmar-reestablecer-password`;

    const html = `
        <div style="margin: 0; padding: 40px 20px; background-color: #f4f4f5; font-family: Arial, Helvetica, sans-serif;">
            <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);">
                
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="margin: 0; color: #18181b; font-size: 28px;">
                        UpTask
                    </h1>
                    <div style="width: 50px; height: 4px; background-color: #c026d3; margin: 12px auto 0; border-radius: 10px;"></div>
                </div>

                <h2 style="margin: 0 0 20px; color: #18181b; font-size: 22px;">
                    Reestablecer tu Contraseña
                </h2>

                <p style="color: #52525b; font-size: 16px; line-height: 1.6; margin: 0 0 15px;">
                    Hola <strong>${user.name}</strong>,
                </p>

                <p style="color: #52525b; font-size: 16px; line-height: 1.6; margin: 0 0 25px;">
                    Hemos recibido una solicitud para reestablecer tu contraseña. Utiliza el siguiente código para verificar tu identidad:
                </p>

                <div style="text-align: center; margin: 30px 0;">
                    <div style="display: inline-block; padding: 18px 30px; background-color: #faf5ff; border: 2px dashed #c026d3; border-radius: 10px;">
                        <span style="color: #18181b; font-size: 32px; font-weight: bold; letter-spacing: 8px;">
                            ${token}
                        </span>
                    </div>
                </div>

                <p style="color: #71717a; font-size: 14px; line-height: 1.5; text-align: center; margin: 0 0 25px;">
                    Ingresa este código en la página de reestablecimiento para continuar.
                </p>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="display: inline-block; padding: 14px 28px; background-color: #c026d3; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 8px;">
                        Ir a Reestablecer Contraseña
                    </a>
                </div>

                <p style="color: #71717a; font-size: 14px; line-height: 1.5; margin: 30px 0 0;">
                    Si no solicitaste reestablecer tu contraseña, puedes ignorar este correo. Tu contraseña permanecerá sin cambios.
                </p>

                <div style="margin-top: 35px; padding-top: 20px; border-top: 1px solid #e4e4e7; text-align: center;">
                    <p style="margin: 0; color: #a1a1aa; font-size: 12px;">
                        © ${new Date().getFullYear()} UpTask. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </div>
    `;

    const info = await transport.sendMail({
        from: `"UpTask" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Reestablecer tu Contraseña",
        html
    });

    return info;
};
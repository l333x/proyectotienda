const nodemailer = require('nodemailer');

const sendEmail = async (destinatario, asunto, mensaje) => {
    try {
        // Configuración del transporte (Usaremos Gmail como ejemplo)
        // NOTA: Para que funcione con Gmail real, necesitas una "App Password"
        // Si no tienes, esto fallará pero no romperá el servidor (saldrá en consola).
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Tu correo
                pass: process.env.EMAIL_PASS  // Tu contraseña de aplicación
            }
        });

        const mailOptions = {
            from: `"GamerVision Security" <${process.env.EMAIL_USER}>`,
            to: destinatario,
            subject: asunto,
            html: mensaje // Permite enviar HTML bonito
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("📧 Correo enviado: " + info.messageId);
        return true;
    } catch (error) {
        console.error("❌ Error enviando correo:", error.message);
        return false;
    }
};

module.exports = sendEmail;
const dotenv = require('dotenv');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const { exec } = require('child_process');
dotenv.config();

// Ejemplos de Formato del Cron
// 0 0 * * *: Este cron job se ejecutará a las 12:00 AM (medianoche) todos los días.
// 30 18 * * *: Este cron job se ejecutará a las 6:30 PM todos los días.
// 0 0 * * 0: Este cron job se ejecutará a las 12:00 AM (medianoche) todos los domingos.
// 0 0 1 * *: Este cron job se ejecutará a las 12:00 AM el primer día de cada mes.
// 0 0 1 1 *: Este cron job se ejecutará a las 12:00 AM el primer día de enero de cada año.
// */15 * * * *: Este cron job se ejecutará cada 15 minutos.
// 0 9-17 * * *: Este cron job se ejecutará en el minuto 0 de cada hora desde las 9 a.m. hasta las 5 p.m. (inclusive), todos los días.
// 0 0,12 * * *: Este cron job se ejecutará dos veces al día, a las 12:00 AM y a las 12:00 PM.

// Se ejecutará al segundo indicado de cada minuto
cron.schedule('30 * * * * *', () => {
    console.log('Running Schedule Cron Jobs');
});

// Se ejecutará en Hora y Minutos especificos 
// Tomar en cuenta que se ejecutará durante todo el minuto si no se coloca un segundo en específico
cron.schedule('00 14 21 * * *', () => {
    console.log('Running Schedule in specific hour');
});

// Se ejecutará cada 10 segundos se ejecutará
cron.schedule('*/10 * * * * *', () => {
    console.log('Running every 10 seconds');
});

// Se ejecutará entre los intervalos indicados
cron.schedule('1-5 * * * * *', () => {
    console.log('Running between second 1 & 5');
});

// Se ejecutará en los segundos indicados
cron.schedule('1,30,59 * * * * *', () => {
    console.log('Running in second 1, 30 or 59');
});

// Backups
cron.schedule('0 2 * * * 0', () => {
  exec('mongodump --out /ruta/del/respaldo', (error, stdout, stderr) => {
    if (error) {
      console.log(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
}, {
  timezone: "America/Caracas"
});

// Crear Usuario de Prueba para correo
//  nodemailer.createTestAccount()
//      .then((account) => {
//          console.log(account)
//      });

// Envío de Correos
let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
    user: process.env.USER_MAIL,
    pass: process.env.PASSWORD_MAIL,
    },
});

let mailOptions = {
    from: "tucorreo@gmail.com",
    to: "tudestinatario@gmail.com",
    subject: "Recordatorio automático",
    text: "Este es un recordatorio automático enviado a las 10:50 pm",
};

cron.schedule('00 01 22 * * *', 
    async () => {
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log("Mensaje enviado: %s", info.messageId);
            const previewURL = nodemailer.getTestMessageUrl(info);
            console.log("URL de vista previa: %s", previewURL);
        } catch (error) {
            console.log(error);
        }
    },
    {
        timezone: "America/Caracas",
    }
);
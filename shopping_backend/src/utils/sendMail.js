const nodemailer = require('nodemailer')

const sendEmail = async ({ email, html }) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465, // hoặc là 587
            secure: true,
            auth: {
                // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                user: process.env.EMAIL_NAME,
                pass: process.env.EMAIL_APP_PASSWORD,
            },
        })

        const info = await transporter.sendMail({
            from: '"Shopping_nodejs" <no-reply@Shopping_nodejs.com>', // sender address
            to: email, // list of receivers
            subject: "Forgot password", // Subject line
            // text: "Hello world?", // plain text body
            html: html, // html body
        })

        return info
    } catch (error) {
        console.log(error)
    }
}

module.exports = sendEmail

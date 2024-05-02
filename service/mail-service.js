const nodemailer = require('nodemailer');


class MailService {
	constructor() {
		this.transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: process.env.SMTP_PORT,
			secure: true,
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASSWORD,
			},
		})
	}
	async sendActivationMail(to, link) {
		await this.transporter.sendMail({
			from: process.env.SMTP_USER,
			to,
			subject: 'Активизация аккаунта на ' + process.env.CLIENT_URL,
			text: '',
			html: `
                         <!DOCTYPE html>
                            <html lang="en">
                            <head>
                            <meta charset="UTF-8" />
                            <style>
                                .activation-container {
                                width: 100%;
                                height: 400px;
                                background-color: rgb(35, 39, 37);
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                                gap: 20px;
                                }
                                .activation-title {
                                color: white;
                                font-size: 30px;
                                text-align: center;
                                font-family: monospace;
                                }
                                .btnn-activate {
                                color: white;
                                background-color:rgb(201, 19, 76);
                                padding: 7px 13px;
                                font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
                                text-align: center;
                                cursor: pointer;
                                border-radius: 10px;
                                }
                                a {
                                text-decoration: none;
                                color: white;
                                }
                            </style>
                            <title>Активация</title>
                            </head>
                            <body>
                            <div class="activation-container">
                            <div>
                                <h2 class="activation-title">Для активации нажмите на кнопку</h2>
                            </div>
                            <div>
                                <a href="${link}">
                                <button class="btnn-activate">
                                    Активировать
                                </button>
                                </a>
                            </div>
                            </div>
                            </body>
                            </html>
                  `,
		})
	}

	async sendPasswordResetMail(to, link) {
		await this.transporter.sendMail({
			from: process.env.SMTP_USER,
			to,
			subject: 'Сброс пароля на ' + process.env.CLIENT_URL,
			text: '',
			html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <style>
          .reset-container {
            width: 100vh;
            background-color: rgb(35, 39, 37);
            display: flex;
            margin: 0 auto;
            flex-direction: column;
            position: absolute;
            top: 0;
            bottom: 0
            gap: 20px;
          }
          .reset-title {
            color: white;
            font-size: 30px;
            text-align: center;
            font-family: monospace;
          }
          .btn-reset {
            color: white;
            background-color: red;
            padding: 7px 13px;
            font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
            text-align: center;
            cursor: pointer;
            border-radius: 10px;
            border: 1px solid white;
          }
          a {
            text-decoration: none;
            color: white;
          }
        </style>
        <title>Сброс пароля</title>
      </head>
      <body>
        <div class="reset-container">
          <div>
            <h2 class="reset-title">Для сброса пароля нажмите на кнопку</h2>
          </div>
          <div>
            <a href="${link}">
              <button class="btn-reset">
                Сбросить пароль
              </button>
            </a>
          </div>
        </div>
      </body>
      </html>
    `,
		})
	}
}

module.exports = new MailService()
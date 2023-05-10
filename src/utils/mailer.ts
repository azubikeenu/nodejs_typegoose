import nodemailer, { SendMailOptions } from 'nodemailer';
import config from 'config';
import Logger from './logger';

async function createTestCreds() {
  const creds = await nodemailer.createTestAccount();
  console.log({ creds });
}

const smtp = config.get<{
  user: string;
  port: number;
  pass: string;
  host: string;
  secure: boolean;
}>('smtp');

const transporter = nodemailer.createTransport({
  ...smtp,
  auth: {
    user: smtp.user,
    pass: smtp.pass,
  },
});
async function sendEmail(payload: SendMailOptions) {
  transporter.sendMail(payload, (error, info) => {
    if (error) {
      Logger.error(`error sending email`);
      return;
    }
    Logger.info(`Preview Url ${nodemailer.getTestMessageUrl(info)}`);
  });
}

export default sendEmail;

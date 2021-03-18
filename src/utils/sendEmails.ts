import nodemailer from 'nodemailer';

// This is only used for testing, will need to change this in production.
export async function sendForgotPasswordEmail(sendEmailTo: string, html: string): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: 'kamille26@ethereal.email',
      pass: 'MzvZegpSnyz9uEX7CN',
    },
  });

  const message = {
    from: '"Threads" <foo@example.com>',
    to: sendEmailTo,
    subject: 'Request To Change Password',
    html: html,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transporter.sendMail(message, (err: Error | null, info: any): void => {
    if (err) {
      console.log('Error occurred. ' + err.message);
      return process.exit(1);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Message url: %s', nodemailer.getTestMessageUrl(info));
  });
}

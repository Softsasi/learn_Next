import { render } from '@react-email/render';
import nodemailer from 'nodemailer';
import { logger } from '../logger';

const FROM_EMAIL = process.env.GMAIL_USER || 'tanzim01hossain2@gmail.com';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export class ResendEmailService {
  static async sendEmail({
    to,
    subject = 'Welcome to Our Service',
    from = FROM_EMAIL,
    jsx,
  }: {
    to: string;
    subject?: string;
    from?: string;
    jsx: React.JSX.Element;
  }) {
    try {
      // Verify connection
      await transporter.verify();
      logger.info('SMTP connection verified');

      // Render JSX to HTML (render returns a Promise)
      const htmlContent = await render(jsx);

      // Send email
      const info = await transporter.sendMail({
        to,
        from,
        subject,
      html: htmlContent,

      });

      logger.info('Email sent successfully:', {
        messageId: info.messageId,
        to,
        subject,
      });

      return {
        messageId: info.messageId,
        success: true,
      };
    } catch (err) {
      logger.error('Error sending email:', err);
      throw new Error(
        `Failed to send email: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
    }
  }
}

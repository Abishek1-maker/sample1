import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private MailerService: MailerService) {}

  async sendWelcomeEmail(email: string, name: string) {
    await this.MailerService.sendMail({
      to: email, //---who receives--
      subject: 'Welcome to our site', //---email subject--
      html: `<h1>Hello ${name} </h1>
        <p>Welcome to our site</p>
        <p>Your account has been created successfully</p>
        `,
    });
  }
}

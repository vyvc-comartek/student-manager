import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SendEmailScoreAddedDto } from './dto';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWhenScoreAdded({
    score,
    content,
    overrideOptions,
  }: SendEmailScoreAddedDto) {
    const defaultOptions = {
      to: score.student.email,
      subject: 'Điểm của bạn đã được cập nhật!',
      template: './email-template/score-added',
      attachments: content
        ? [
            {
              filename: 'result.xlsx',
              contentType:
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              content,
            },
          ]
        : [],
      context: score,
    };

    return this.mailerService.sendMail(
      Object.assign(defaultOptions, overrideOptions),
    );
  }
}

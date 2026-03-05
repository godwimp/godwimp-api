import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { ContactDto } from './dto/contact.dto';

@Injectable()
export class ContactService {
  private resend: Resend;

  constructor(private readonly config: ConfigService) {
    this.resend = new Resend(this.config.get<string>('RESEND_API_KEY'));
  }

  async send(dto: ContactDto): Promise<{ id: string }> {
    const to = this.config.get<string>('CONTACT_TO_EMAIL') ?? 'fadhiel@godwimp.me';
    const from = this.config.get<string>('CONTACT_FROM_EMAIL') ?? 'fadhiel@godwimp.me';

    const { data, error } = await this.resend.emails.send({
      from: `godwimp.me Contact <${from}>`,
      to,
      replyTo: dto.email,
      subject: `New message from ${dto.name} — godwimp.me`,
      html: `
        <div style="font-family:monospace;max-width:600px;margin:0 auto;background:#0a0a0f;color:#e8e8f0;padding:32px;border-radius:12px;border:1px solid #1e1e2e;">
          <h2 style="color:#00ff88;font-size:18px;margin:0 0 24px;">New Contact Form Submission</h2>

          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:8px 0;color:#5a5a7a;font-size:12px;width:80px;vertical-align:top;">FROM</td>
              <td style="padding:8px 0;font-size:14px;">${dto.name}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#5a5a7a;font-size:12px;vertical-align:top;">EMAIL</td>
              <td style="padding:8px 0;font-size:14px;"><a href="mailto:${dto.email}" style="color:#00aaff;">${dto.email}</a></td>
            </tr>
          </table>

          <hr style="border:none;border-top:1px solid #1e1e2e;margin:20px 0;" />

          <p style="color:#5a5a7a;font-size:12px;margin:0 0 8px;letter-spacing:0.1em;">MESSAGE</p>
          <p style="font-size:14px;line-height:1.8;white-space:pre-wrap;margin:0;">${dto.message}</p>

          <hr style="border:none;border-top:1px solid #1e1e2e;margin:20px 0;" />
          <p style="color:#5a5a7a;font-size:11px;margin:0;">Sent via godwimp.me contact form</p>
        </div>
      `,
    });

    if (error) {
      throw new InternalServerErrorException(`Failed to send email: ${error.message}`);
    }

    return { id: data!.id };
  }
}

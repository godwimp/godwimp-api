import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { InternalServerErrorException } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactDto } from './dto/contact.dto';

const mockDto: ContactDto = {
  name: 'Fadhillah',
  email: 'test@example.com',
  message: 'Hello, this is a test message from the contact form.',
};

const mockSend = jest.fn();

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: { send: mockSend },
  })),
}));

describe('ContactService', () => {
  let service: ContactService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              const map: Record<string, string> = {
                RESEND_API_KEY: 're_test_key',
                CONTACT_TO_EMAIL: 'fadhiel@godwimp.me',
                CONTACT_FROM_EMAIL: 'contact@godwimp.me',
              };
              return map[key];
            },
          },
        },
      ],
    }).compile();

    service = module.get<ContactService>(ContactService);
    mockSend.mockReset();
  });

  it('should return email id when Resend sends successfully', async () => {
    mockSend.mockResolvedValueOnce({ data: { id: 'email_abc123' }, error: null });

    const result = await service.send(mockDto);

    expect(result).toEqual({ id: 'email_abc123' });
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'fadhiel@godwimp.me',
        replyTo: mockDto.email,
        subject: expect.stringContaining(mockDto.name),
      }),
    );
  });

  it('should throw InternalServerErrorException when Resend returns an error', async () => {
    mockSend.mockResolvedValue({ data: null, error: { message: 'Invalid API key' } });

    await expect(service.send(mockDto)).rejects.toThrow(
      new InternalServerErrorException('Failed to send email: Invalid API key'),
    );
  });
});

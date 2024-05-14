import dotenv from 'dotenv';
import { ServerClient, TemplatedMessage } from 'postmark';

dotenv.config();

const client = new ServerClient(
  process.env.POSTMARK_SERVER_API_TOKEN!,
);

const sendEmail = async (
  email: string,
  templateId: number,
  templateParams: object,
) => {
  await client.sendEmailWithTemplate(
    new TemplatedMessage(
      'contact@sneakpeak.store',
      templateId,
      templateParams,
      email,
    ),
  );
};

export const PostmarkClient = {
  sendEmail,
};

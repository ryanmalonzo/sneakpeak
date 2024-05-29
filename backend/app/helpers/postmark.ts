import dotenv from 'dotenv';
import { ServerClient, TemplatedMessage } from 'postmark';

dotenv.config();

let client: ServerClient | null = null;

const getClient = (): ServerClient => {
  if (!process.env.POSTMARK_SERVER_API_TOKEN) {
    throw new Error('POSTMARK_SERVER_API_TOKEN is not defined');
  }

  if (!client) {
    client = new ServerClient(process.env.POSTMARK_SERVER_API_TOKEN);
  }
  return client;
};

const sendEmail = async (
  email: string,
  templateId: number,
  templateParams: object,
) => {
  await getClient().sendEmailWithTemplate(
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

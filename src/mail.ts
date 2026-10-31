import nodemailer from 'nodemailer';

export type MailConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
};

export function mailConfigFromEnv(input: {
  SMTP_HOST?: string;
  SMTP_PORT?: number;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  SMTP_FROM?: string;
}): MailConfig | null {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS } = input;
  if (!SMTP_HOST?.trim() || !SMTP_USER?.trim() || !SMTP_PASS?.trim()) return null;
  const pass = SMTP_PASS.trim().replace(/\s+/g, '');
  const placeholder =
    pass.length < 16 ||
    /^x{8,}$/i.test(pass) ||
    /your16charapppassword|changeme|placeholder|example/i.test(pass);
  if (placeholder) return null;
  return {
    host: SMTP_HOST.trim(),
    port: input.SMTP_PORT ?? 587,
    user: SMTP_USER.trim(),
    pass,
    from: (input.SMTP_FROM?.trim() || SMTP_USER.trim()),
  };
}

export async function verifyMailConfig(config: MailConfig) {
  const transport = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: { user: config.user, pass: config.pass },
  });
  await transport.verify();
}

export async function sendPasswordResetEmail(config: MailConfig, to: string, resetUrl: string, token: string) {
  const transport = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: { user: config.user, pass: config.pass },
  });

  const text = [
    'You requested a password reset for WishDrop.',
    '',
    `Open this link (valid for 1 hour):`,
    resetUrl,
    '',
    'If the link does not open, paste this token in the app under Reset password:',
    token,
    '',
    'If you did not request this, you can ignore this email.',
  ].join('\n');

  await transport.sendMail({
    from: config.from,
    to,
    subject: 'Reset your WishDrop password',
    text,
    html: `<p>You requested a password reset for WishDrop.</p>
<p><a href="${resetUrl}">Reset your password</a> (expires in 1 hour)</p>
<p>Or paste this token in the app: <code>${token}</code></p>
<p>If you did not request this, ignore this email.</p>`,
  });
}

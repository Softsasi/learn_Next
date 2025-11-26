const AppConfig = {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  argon2dSalt:
    process.env.ARGON2_SALT || 'ARGON2_SALT=3kCwz0W4hNfEj1l8b+6kGg==',
  argon2Secret: process.env.ARGON2_SECRET || 'your_secret_key',
  JWT_SECRET: process.env.JWT_SECRET || 'your-default-secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  VERIFICATION_LINK_EXPIRES_IN: process.env.VERIFICATION_LINK_EXPIRES_IN || 24, // hours
  GMAIL_FROM_NAME: process.env.GMAIL_FROM_NAME || 'LearnHub Team',
};

Object.freeze(AppConfig);

export default AppConfig;

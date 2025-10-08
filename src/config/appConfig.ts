const AppConfig = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  argon2dSalt:
    process.env.ARGON2_SALT || 'ARGON2_SALT=3kCwz0W4hNfEj1l8b+6kGg==',
  argon2Secret: process.env.ARGON2_SECRET || 'your_secret_key',
};

Object.freeze(AppConfig);

export default AppConfig;

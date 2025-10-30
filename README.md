# LearnHub - Next.js Learning Platform

A comprehensive learning platform built with Next.js 16, TypeScript, and MongoDB. This project demonstrates modern web development practices including authentication, user profiles, post management, and more.

## 🚀 Features

- **Authentication System**: Secure user registration and login with Argon2 password hashing
- **User Profiles**: Complete profile management with avatar upload via Cloudinary
- **Role-Based Access**: Support for Student, Teacher, Parent, and Admin roles
- **Post Management**: Create, read, update, and delete posts with author attribution
- **Contact System**: Contact form with message management
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Dark Mode Support**: Built-in theme switching capability
- **Modern UI**: Beautiful components using Radix UI and shadcn/ui

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Database**: MongoDB with Prisma ORM
- **Authentication**: Custom JWT-based auth with Argon2
- **Styling**: Tailwind CSS with shadcn/ui components
- **File Upload**: Cloudinary integration
- **Package Manager**: pnpm
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+
- pnpm package manager
- MongoDB database (local or cloud)
- Cloudinary account (for image uploads)

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/Softsasi/learn_Next.git
cd learn_Next
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .demo.env .env.local
```

Edit `.env.local` with your actual values:
```env
DATABASE_URL="mongodb://localhost:27017/learn_next"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
NEXT_PUBLIC_CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
ARGON2_SALT="your_salt_value"
ARGON2_SECRET="your_secret_key"
```

4. Initialize the database:
```bash
pnpm db:push
pnpm db:generate
```

5. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── (auth)/        # Authentication routes
│   │   ├── (dashboard)/   # Protected dashboard routes
│   │   ├── api/           # API routes
│   │   └── ...            # Other pages
│   ├── components/        # Reusable React components
│   │   ├── shared/        # Shared components
│   │   └── ui/            # UI components
│   ├── config/            # Configuration files
│   ├── context/           # React contexts
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Helper functions
├── components.json        # shadcn/ui configuration
├── next.config.ts         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## 🗄️ Database Schema

The application uses MongoDB with the following main models:

- **AuthUser**: User authentication with email, password, role, and status
- **UserProfile**: Extended user information with profile details
- **Post**: Blog posts with title, content, and author attribution
- **Contact**: Contact form submissions
- **VerificationCode**: Email verification codes
- **LoginHistory**: User login tracking

## 🔐 Authentication

The application implements a secure authentication system:

- Password hashing with Argon2
- JWT-based session management
- Role-based access control
- Email verification system
- Login history tracking

## 📦 Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production with Turbopack
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm db:init` - Initialize Prisma
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema to database
- `pnpm db:studio` - Open Prisma Studio
- `pnpm db:migrate` - Run database migrations

## 🎨 UI Components

This project uses shadcn/ui components for a consistent and beautiful UI:

- Buttons, inputs, cards, and more
- Built with Radix UI primitives
- Fully customizable with Tailwind CSS
- Accessible by default

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:

- Desktop computers
- Tablets
- Mobile devices

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- AWS
- DigitalOcean
- Railway

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Radix UI](https://www.radix-ui.com/) - Low-level UI primitives
- [Cloudinary](https://cloudinary.com/) - Image and video management

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

# Nebula Chat

<div align="center">
  <img src="/public/images.jpeg" alt="Nebula Chat Logo" width="200" height="200" />
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Next.js](https://img.shields.io/badge/Next.js-16.0.0-black?logo=next.js&logoColor=white)](https://nextjs.org)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

**Secure, Self-Destructing Private Conversations**

</div>

## 🚀 Overview

Nebula Chat is a privacy-focused, secure messaging platform that enables users to have confidential conversations that automatically self-destruct after a set duration. Designed with privacy-first principles, Nebula Chat ensures that sensitive discussions leave no permanent trace on servers or devices.

### Key Features

- 🔐 **End-to-End Encryption**: All messages are encrypted for maximum privacy
- ⏰ **Self-Destructing Messages**: Conversations automatically delete after a configurable duration
- 🚫 **No Permanent Storage**: Messages are never stored permanently on servers
- 👥 **Secure Room Sharing**: Invite others to join your private chat rooms
- 🌐 **Real-time Communication**: Instant messaging with WebSocket support
- 📱 **Responsive Design**: Works seamlessly across all devices

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Database**: [Upstash Redis](https://upstash.com) for ephemeral storage
- **API**: [Elysia.js](https://elysiajs.com) for API routes
- **Real-time**: WebSocket connections for instant messaging
- **Authentication**: Token-based authentication with secure cookies

## 🏗️ Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # Elysia.js API routes
│   ├── room/[roomId]/     # Dynamic room pages
│   └── globals.css        # Global styles
├── components/            # React components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and clients
└── proxy.ts               # Next.js proxy middleware
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Redis instance (Upstash recommended)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/nebula.git
cd nebula
```

2. **Install dependencies**

```bash
# Using Bun (recommended)
bun install

# Or using npm
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token
```

4. **Run the development server**

```bash
# Using Bun
bun dev

# Or using npm
npm run dev
```

5. **Open your browser**

Visit [http://localhost:3000](http://localhost:3000) to start using Nebula Chat.

## 📋 Usage

### Creating a Secure Room

1. Visit the Nebula Chat homepage
2. Select the desired room duration (5 min, 10 min, 15 min, 30 min, or 1 hour)
3. Click "CREATE SECURE ROOM"
4. Your private room is created with a unique ID
5. Share the room link with people you want to chat with

### Joining a Room

- **Option 1**: Enter an existing room ID in the "Join Existing Room" field
- **Option 2**: Paste the full room URL (auto-extraction supported)
- **Option 3**: Use the share button to invite others

### Chatting Securely

- Messages are encrypted and stored temporarily
- All messages self-destruct when the room expires
- Maximum of 2 participants per room for privacy
- Real-time messaging with instant updates

## 🔐 Security Features

- **Secure Cookies**: HTTP-only, secure, and same-site cookies
- **Rate Limiting**: Protection against spam and abuse
- **Input Sanitization**: All inputs are sanitized to prevent injection
- **Temporary Storage**: Messages are automatically deleted
- **Token Authentication**: Secure token-based access system

## 🧪 Testing

Run the test suite:

```bash
bun test
# or
npm test
```

## 🚀 Deployment

### Vercel (Recommended)

Nebula Chat is optimized for deployment on Vercel:

1. Push your code to a GitHub repository
2. Import the project into Vercel
3. Add your environment variables
4. Deploy!

### Other Platforms

Nebula Chat can be deployed on any platform that supports Next.js applications. Ensure your Redis connection is properly configured.

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

Please make sure to update tests as appropriate and follow the existing code style.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Issues

If you encounter any issues, please open an issue in the GitHub repository. Include as much detail as possible to help us resolve the problem quickly.

## 🆘 Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

<div align="center">

**Built with ❤️ for privacy-conscious communication**

[Privacy Policy](#) • [Terms of Service](#) • [Documentation](#)

</div>

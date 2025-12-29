# Vedha Pocket Web

A Next.js 14 frontend for the Vedha Pocket knowledge management system.

## Features

- 🎨 Modern UI with shadcn/ui components
- 🌙 Dark mode support
- 🔐 Supabase Auth (Email, Magic Link, Google)
- 💬 Streaming chat responses
- 📊 Real-time stats dashboard
- 📝 Markdown rendering in chat
- 📱 Responsive design

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Run in development
npm run dev

# Build for production
npm run build
npm start
```

## Environment Variables

| Variable                        | Description          | Required |
| ------------------------------- | -------------------- | -------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL | Yes      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key    | Yes      |
| `NEXT_PUBLIC_API_URL`           | API base URL         | Yes      |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth pages (login, signup)
│   ├── (dashboard)/       # Protected dashboard pages
│   └── layout.tsx         # Root layout
├── components/
│   ├── app/               # Feature components
│   │   ├── pocket-view.tsx    # Main pocket interface
│   │   ├── chat-panel.tsx     # Chat component
│   │   └── source-list.tsx    # Source management
│   └── ui/                # shadcn/ui components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and Supabase client
└── providers/             # React context providers
```

## Key Components

### PocketView

Main interface for interacting with a pocket:

- Source list with add/delete functionality
- Chat interface with streaming responses
- Citation display with source links
- Stats overview

### Chat

Streaming chat with markdown support:

- Uses SSE for real-time responses
- Renders markdown with react-markdown
- Deduplicates citations
- Shows loading states

## Styling

Uses Tailwind CSS with shadcn/ui design tokens:

- Consistent color palette
- Dark/light mode theming
- Responsive breakpoints
- Accessibility built-in

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repo to Vercel
2. Add environment variables
3. Deploy!

### Docker

```bash
docker build -t vedha-pocket-web .
docker run -p 3000:3000 --env-file .env vedha-pocket-web
```

## License

MIT

# Memory Palace Web (vedha-pocket-web)

A Next.js 14 frontend for the Memory Palace knowledge management system. Features a dual-brain interface for managing both external documents and personal memories.

## 🌟 Features

### UI/UX

- 🎨 **Modern UI** — shadcn/ui components with Tailwind CSS
- 🌙 **Dark Mode** — System-aware theme switching
- 📱 **Responsive** — Works on desktop, tablet, and mobile
- ⚡ **Real-time** — Streaming chat responses with status updates
- 🖼️ **Resizable Panels** — Adjustable memory/chat panel sizes

### Authentication

- 🔐 **Supabase Auth** — Email, Magic Link, Google OAuth
- 🔑 **BYOK** — Bring Your Own Key (OpenRouter API key)
- 🛡️ **Encrypted Storage** — API keys encrypted at rest

### Pockets (Document Collections)

- 📚 **Multi-source Support** — URLs, PDFs, DOCX, TXT, Markdown
- 💬 **AI Chat** — Ask questions about your documents
- 📑 **Citations** — Answers with source references
- 📊 **Processing Status** — Real-time ingestion progress

### Memories (Personal Notes)

- 🧠 **Rich Editor** — TipTap-powered Markdown editor
- 🎨 **Color Coding** — Visual organization with colors
- 🏷️ **Tags** — Categorize and filter memories
- 💬 **Memory Chat** — Ask questions about your thoughts
- 📦 **Archive** — Soft delete with restore capability

### Agentic RAG Features (NEW!)

- 🎯 **Intent Display** — Shows query classification (lookup, comparison, analytical, etc.)
- ✏️ **Query Rewriting** — Displays rewritten queries with context
- 📊 **Relevance Grading** — Shows CRAG chunk filtering results
- ✅ **Answer Quality** — Displays self-reflective answer grades

## 🚀 Quick Start

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

## 🔧 Environment Variables

| Variable                        | Description          | Required |
| ------------------------------- | -------------------- | -------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL | Yes      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key    | Yes      |
| `NEXT_PUBLIC_API_URL`           | API base URL         | Yes      |

## 🏗️ Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Landing page
│   ├── providers.tsx           # React Query, Theme providers
│   ├── globals.css             # Global styles
│   ├── api/auth/               # Auth callback handler
│   ├── app/                    # Protected app routes
│   │   ├── layout.tsx          # App shell layout
│   │   ├── page.tsx            # Dashboard
│   │   ├── pocket/[id]/        # Pocket detail view
│   │   ├── pockets/            # Pocket list
│   │   ├── analytics/          # Usage analytics
│   │   ├── settings/           # User settings
│   │   └── tasks/              # Background jobs
│   ├── login/                  # Login page
│   ├── privacy/                # Privacy policy
│   ├── terms/                  # Terms of service
│   └── security/               # Security info
├── components/
│   ├── app/                    # Feature components
│   │   ├── pocket-view.tsx     # Pocket interface with agentic SSE
│   │   ├── pocket-list.tsx     # Pocket grid/list
│   │   ├── memories-view.tsx   # Memory management
│   │   ├── memory-grid.tsx     # Memory card grid
│   │   ├── memory-editor-dialog.tsx  # TipTap editor modal
│   │   ├── general-chat.tsx    # Memory chat interface
│   │   ├── tiptap-editor.tsx   # Rich text editor
│   │   ├── app-shell.tsx       # Navigation sidebar
│   │   ├── analytics-dashboard.tsx  # Stats charts
│   │   ├── api-key-guard.tsx   # BYOK enforcement
│   │   ├── api-key-setup-modal.tsx  # API key entry
│   │   ├── settings-form.tsx   # User preferences
│   │   └── task-list.tsx       # Job queue status
│   └── ui/                     # shadcn/ui components
├── hooks/
│   └── use-memories.ts         # React Query hooks
├── lib/
│   ├── api.ts                  # API client
│   ├── utils.ts                # Utility functions
│   └── supabase/               # Supabase client
└── middleware.ts               # Auth middleware
```

## 🎨 Key Components

### PocketView

Main interface for document Q&A with agentic RAG:

- Source list with upload/URL add
- Streaming chat with real-time status
- Intent classification display
- CRAG grading indicators
- Citation links to sources

### MemoriesView

Personal knowledge management:

- Memory card grid with colors
- TipTap rich text editor
- Tag filtering and search
- Archive/restore functionality
- Memory chat integration

### GeneralChat

Chat interface for memory RAG:

- Conversation history (collapsible)
- Streaming responses
- Memory citations
- Markdown rendering

### TipTapEditor

Rich text editor features:

- Bold, italic, underline, strikethrough
- Headings (H1-H3)
- Bullet/ordered lists
- Task lists with checkboxes
- Blockquotes
- Code blocks
- Links
- Horizontal rules

## 🎯 SSE Event Handling

The app handles these streaming events from the API:

```typescript
// Agentic RAG events
'routing'    → Shows intent classification
'rewriting'  → Shows context-aware query rewrite
'queries'    → Shows multi-query expansion
'sources'    → Shows matched documents
'grading'    → Shows CRAG relevance scores
'token'      → Streams answer tokens
'reflection' → Shows answer quality grade
'done'       → Final response with citations
'error'      → Error handling
```

## 🐳 Docker

```bash
# Build
docker build -t memory-palace-web .

# Run
docker run -p 3000:3000 --env-file .env memory-palace-web
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect GitHub repo to Vercel
2. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_API_URL`
3. Deploy!

### Features Enabled

- Vercel Analytics (privacy-focused)
- Edge Runtime for middleware
- Automatic HTTPS

## 🔗 Related Repos

- **API**: [vedha-pocket-api](https://github.com/venki0552/vedha-pocket-api)
- **Worker**: [vedha-pocket-worker](https://github.com/venki0552/vedha-pocket-worker)

## 📄 License

MIT

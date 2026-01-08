# thxx.xyz - Personal Portfolio & Blog

A modern, multilingual personal portfolio and blog built with Next.js 16, featuring a comprehensive admin panel for content management.

## 🚀 Tech Stack

- **Framework**: Next.js 16.1.1 with App Router & React Compiler
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + Shadcn UI
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **i18n**: next-intl (Korean, English, Japanese)
- **Content**: Tiptap WYSIWYG editor
- **Analytics**: Plausible (self-hosted)
- **Animations**: Framer Motion

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- (Optional) Plausible Analytics instance

## 🛠️ Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd vibe-coding-thxx-xyz
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

### 3. Database Setup

Follow the instructions in `supabase/README.md` to:
- Run the database schema
- Create storage buckets
- Set up authentication

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   └── admin/             # Admin panel (future)
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   ├── layout/           # Layout components
│   ├── profile/          # Profile components
│   ├── blog/             # Blog components
│   └── projects/         # Project components
├── lib/                   # Utility functions
│   └── supabase/         # Supabase clients
├── messages/              # i18n translations
└── types/                 # TypeScript types
```

## 🌐 Internationalization

The site supports three languages with path-based routing:
- Korean (default): `/ko`
- English: `/en`
- Japanese: `/ja`

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Public read access for published content
- Authenticated write access for admin operations

## 📦 Build

```bash
npm run build
```

The build output is configured for standalone deployment.

## 📝 License

Private project - All rights reserved

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Shadcn UI](https://ui.shadcn.com)

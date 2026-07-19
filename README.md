# SeekBix

One search bar over everything your team writes down. Add notes, docs, and FAQs, then find any of it instantly, no folders to organize first, no tags to invent.

Built solo for the Blueprint Hackathon (July 17 to 31, 2026).

## The problem

Useful information ends up scattered across tools with no fast way to find it again. You remember writing something down, you just can't remember where. SeekBix solves that with one search bar over everything.

## Features

- Email and password authentication via Supabase Auth
- Create, edit, and delete entries, each typed as a note, doc, or FAQ
- Instant full text search across all entries, powered by Postgres full text search, no external AI API
- Every account's entries are private by default, enforced at the database level via Row Level Security
- Edit-first interface, an entry is either open and editable or not open at all
- Keyboard shortcuts: Cmd/Ctrl+K to open search, Escape to close it
- Fully responsive, collapsible sidebar navigation on mobile
- Dark mode by default

## Tech stack

- Vanilla JavaScript, no framework, no bundler
- Supabase for authentication, database, and Row Level Security
- Postgres full text search (`tsvector` / `websearch_to_tsquery`)
- Hosted on GitHub Pages

No external paid APIs or services anywhere in the stack.

## Architecture

```text
app/
├── auth/                    → authentication screens
│   ├── index.html
│   ├── login.html
│   └── signup.html
├── components/
│   ├── modals/
│   │   └── search.html      → search modal markup
│   └── toast.html           → toast notification skeleton
├── css/                     → base styles, design tokens, per-component styles
│   ├── components/
│   │   ├── buttons.css
│   │   ├── forms.css
│   │   ├── search.css
│   │   └── toast.css
│   ├── base.css
│   └── dashboard.css
├── js/
│   ├── auth/
│   │   ├── auth.js
│   │   ├── login.js
│   │   └── signup.js
│   ├── components/
│   │   ├── loadComponents.js
│   │   └── toast.js
│   ├── dashboard.js         → entry CRUD, editor state
│   ├── search.js            → search modal, live query, keyboard shortcuts
│   └── supabase.js          → Supabase client init
├── pages/
│   └── dashboard.html       → main app, single page
assets/                      → images
index.html                   → landing page
README.md
```

**Data model:** a single `entries` table (`id`, `user_id`, `title`, `content`, `type`, `created_at`, `updated_at`), with a generated `tsvector` column for search, indexed with GIN. Row Level Security restricts every read and write to `auth.uid() = user_id`, so access control lives in the database, not just the UI.

## Getting Started

1. Visit the live app: [SeekBix](https://abdulroqib123.github.io/seekbix/)
2. Sign up with an email and password
3. Add your first entry, choose note, doc, or FAQ, give it a title, write the content
4. Press Ctrl+K (or Cmd+K on Mac) at any time to search across everything you've added

That's it, no setup, no configuration, just sign up and start writing.

## Local Development

Want to run your own copy?

1. Clone the repo
2. Create a free Supabase project at [supabase.com](https://supabase.com)
3. Run the schema from `schema.sql` in the Supabase SQL editor (creates the `entries` table, enables RLS, adds the search index)
4. In `js/supabase.js`, replace the values with your project URL and anon key
5. Serve the files with any static server, or open `index.html` directly, no build step required

## Design decisions worth noting

**No rich text editor.** Rich text or Markdown was considered, but since the interface is edit-first with no separate rendered preview anywhere, formatted syntax would just show up as literal characters on screen. Plain text solves the actual problem without adding a dependency or reopening XSS surface area from rendering user-generated HTML.

**No AI-powered search.** Search runs entirely on Postgres's built-in full text search. This keeps the project fully capital-free to build and run, and avoids the noise of a search API for a category of problem Postgres already handles well.

**Keyboard shortcut discovery via tooltips, not a banner.** Users need to know Ctrl+K opens search and Esc closes it, but a persistent onboarding banner takes up permanent space, and a dismissible one needs localStorage state to remember it's been closed. Instead, hovering or focusing the search and cancel buttons reveals a small tooltip with the shortcut, discoverable indefinitely, no extra state to manage, and no space taken up until someone's actually looking at that button.

## What's next

The plan is to fold SeekBix into [LogHue](https://loghue.com), an existing product with a similar search-first philosophy, rather than run it as a permanent standalone tool.

## A note on this documentation

Parts of this README were drafted with Claude's help, I explained what I built and how, and it helped write the documentation based on that.
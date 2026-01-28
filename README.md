<p align="center">
  <img src="assets/blaboard.png" alt="Blaboard - Open Source Kanban Board" width="600" />
</p>

<h1 align="center">Blaboard</h1>

<p align="center">
  <strong>An open source Kanban Board made by the community, for the community.</strong>
</p>

<p align="center">
  <a href="https://github.com/BeroLab/blaboard/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License MIT" />
  </a>
  <a href="https://berolab.app">
    <img src="https://img.shields.io/badge/community-BeroLab-purple.svg" alt="BeroLab" />
  </a>
</p>

---

## About the Project

**Blaboard** is an open source Kanban board developed by the [BeroLab](https://berolab.app) community. This project was created with the goal of helping beginner developers have their first experience contributing to open source projects, while we build together a useful task management tool.

**Anyone can contribute!** Whether you're an experienced developer or someone just getting started, you're welcome to participate.

## Technologies Used

This project uses modern technologies from the JavaScript/TypeScript ecosystem:

| Category | Technology |
|----------|------------|
| **Runtime** | [Bun](https://bun.sh) |
| **Frontend** | [Next.js 16](https://nextjs.org) + [React 19](https://react.dev) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) |
| **Backend** | [ElysiaJS](https://elysiajs.com) |
| **Database** | [MongoDB](https://www.mongodb.com) + [Prisma ORM](https://www.prisma.io) |
| **Authentication** | [Better Auth](https://www.better-auth.com) (Google and GitHub) |
| **Monorepo** | [Turborepo](https://turbo.build) |
| **Code Quality** | [Biome](https://biomejs.dev) + [Husky](https://typicode.github.io/husky) |

## Project Structure

```
blaboard/
├── apps/
│   ├── web/           # Frontend application (Next.js)
│   └── server/        # Backend API (ElysiaJS)
├── packages/
│   ├── auth/          # Authentication configuration
│   ├── db/            # Database schema and configuration
│   ├── env/           # Type-safe environment variables
│   └── config/        # Shared configurations
```

## Getting Started

### Prerequisites

Before you begin, make sure you have installed:

- [Bun](https://bun.sh) (version 1.3.2 or higher)
- [Docker](https://www.docker.com) (to run MongoDB locally)
- [Git](https://git-scm.com)

### Step by Step

#### 1. Fork the repository

Click the "Fork" button in the top right corner of this page to create a copy of the repository in your account.

#### 2. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/blaboard.git
cd blaboard
```

#### 3. Install dependencies

```bash
bun install
```

#### 4. Configure environment variables

Copy the example files:

```bash
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env
```

Edit the `.env` files with your settings. For social authentication (Google/GitHub), you'll need to create OAuth applications at:
- [Google Cloud Console](https://console.cloud.google.com)
- [GitHub Developer Settings](https://github.com/settings/developers)

#### 5. Start the database

```bash
bun run db:start     # Start MongoDB in Docker
bun run db:generate  # Generate Prisma client
bun run db:push      # Apply schema to database
```

#### 6. Run the project

```bash
bun run dev
```

Done! Access:
- **Frontend:** [http://localhost:3001](http://localhost:3001)
- **Backend:** [http://localhost:3000](http://localhost:3000)

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start all applications in development mode |
| `bun run dev:web` | Start only the frontend |
| `bun run dev:server` | Start only the backend |
| `bun run build` | Build all applications |
| `bun run check-types` | Check TypeScript types |
| `bun run check` | Format and lint code |
| `bun run db:start` | Start MongoDB container |
| `bun run db:push` | Apply schema to database |
| `bun run db:generate` | Generate Prisma client |
| `bun run db:studio` | Open Prisma Studio interface |
| `bun run db:stop` | Stop MongoDB container |

## How to Contribute

We're always looking for collaborators! Here's how you can participate:

### 1. Find an issue

Go to the [Issues](https://github.com/BeroLab/blaboard/issues) tab of the repository. Look for issues with the labels:

- `good first issue` - Ideal for beginners
- `help wanted` - We need help with these

### 2. Comment on the issue

Leave a comment saying you want to work on that issue. This prevents two people from working on the same thing.

### 3. Create your branch

**Important:** Always create your branch from `staging`, which is our reference branch for development.

```bash
git checkout staging
git pull origin staging
git checkout -b feat/feature-name
# or
git checkout -b fix/bug-name
```

### 4. Make your changes

Develop your solution following the project standards. Before committing:

```bash
bun run check  # Format and check code
```

### 5. Submit a Pull Request

```bash
git add .
git commit -m "feat: description of your change"
git push origin feat/feature-name
```

Then, open a Pull Request on GitHub describing your changes.

## Design

Interested in contributing to UI/UX? Check out our Figma file with the project prototype:

[Blaboard - Figma Prototype](https://www.figma.com/design/fwgpxrsQ9mFoA30JR3c7xu/Blaboard---Prototype?t=Nz5gRhSQHB09UtHp-0) - Maintained by [Matheus Henry](https://github.com/WatheusHenry), social link: [X](https://x.com/watheushenry)

## Join the Community

### Weekly Meetings

We hold meetings **every Wednesday at 6 PM (Brasilia time)** in our Discord community. In these meetings we discuss:

- Project progress
- New features
- Contributors' questions
- Planning for upcoming sprints

### How to join the community

1. Go to [berolab.app](https://berolab.app) and sign up for free
2. Join our Discord server
3. Introduce yourself in the welcome channel

For more information, contact us through our BeroLab Discord server.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

<p align="center">
  Made with love by the <a href="https://berolab.app">BeroLab</a> community
</p>

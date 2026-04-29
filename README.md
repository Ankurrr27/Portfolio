# Ankur Portfolio

This portfolio is now set up as a Next.js app with a small full-stack layer:

- Frontend project cards render from `/api/projects`
- Prisma is configured for MongoDB
- Prisma models now cover profile, projects, education, achievements, and site views
- The API reads featured projects from MongoDB first
- If MongoDB is empty or not configured yet, the API falls back to GitHub
- You can sync GitHub repos into MongoDB with a POST request
- Cloudinary is configured for signed uploads through the backend

## Environment

Create a local env file from `.env.example` and add your real MongoDB connection string:

```bash
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority"
GITHUB_USERNAME="Ankurrr27"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
ADMIN_PANEL_KEY="set-a-strong-secret-here"
```

## Prisma setup

Push the schema to MongoDB:

```bash
npm run prisma:push
```

Regenerate the Prisma client if needed:

```bash
npm run prisma:generate
```

## Run locally

```bash
npm run dev
```

## API

### `GET /api/projects`

Returns featured projects for the portfolio UI.

Priority order:

1. MongoDB via Prisma
2. GitHub API
3. Local fallback data

### `POST /api/projects`

Syncs the latest GitHub repos into MongoDB.

Request body:

```json
{
  "action": "sync-github"
}
```

Once synced, the portfolio will start serving projects from your database.

### `GET /api/views`

Returns the total site view count stored in MongoDB.

### `POST /api/views`

Creates a page view record and returns the updated total.

Request body:

```json
{
  "path": "/"
}
```

### `POST /api/media/signature`

Creates a signed Cloudinary upload payload for frontend uploads.

Request body:

```json
{
  "folder": "portfolio/uploads"
}
```

## Admin panel

Visit `/admin` and enter the value of `ADMIN_PANEL_KEY` from your local env file.

From the admin panel you can:

- edit profile content
- edit education timeline entries
- edit achievements
- sync GitHub projects into MongoDB

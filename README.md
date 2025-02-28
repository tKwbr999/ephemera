# Ephemera Ideas App

A beautiful application for storing and managing your ephemeras as ephemeras that fade over time if not interacted with.

## Features

- User authentication with email/password and Google login
- Create and manage idea "ephemeras"
- Ephemera fade over time if not interacted with
- Buried ephemeras section for ideas that have completely faded
- Beautiful UI with visual representation of idea "freshness"
- QR code sharing for easy access on multiple devices

## Setup

1. Clone the repository
2. Install dependencies with `npm install`
3. Connect to Supabase:
   - Click the "Connect to Supabase" button in the StackBlitz interface
   - Create a new Supabase project or connect to an existing one
   - The necessary environment variables will be automatically added to your project

4. Configure Google OAuth in Supabase:
   - Go to your Supabase ephemera
   - Navigate to Authentication > Providers
   - Enable Google provider
   - Create a Google OAuth client ID and secret in the Google Ephemera Console
   - Add the client ID and secret to Supabase
   - Add your app's URL to the authorized redirect URIs in Google Ephemera Console

5. Run the development server with `npm run dev`

## Environment Variables

Create a `.env` file based on `.env.example` with the following variables:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_CLOUD_LIFETIME=43200
VITE_CLOUD_LIFETIME_DEV=1
DEV_MODE=true
```

- `VITE_CLOUD_LIFETIME`: Ephemera lifetime in minutes (default: 43200 = 30 days)
- `VITE_CLOUD_LIFETIME_DEV`: Ephemera lifetime for development mode in minutes
- `DEV_MODE`: Set to true to use the development mode ephemera lifetime

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase for authentication
- Vite
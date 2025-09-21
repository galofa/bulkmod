# BulkMod - Minecraft Mod Downloader

A full-stack monorepo application that allows users to bulk download Minecraft mods from Modrinth by uploading a simple text file with mod URLs. The application automatically detects compatible versions for your chosen Minecraft version and mod loader, then packages everything into a convenient zip file.

## Features

### Frontend (React + Vite)
- Select any Minecraft version and mod loader
- Upload a .txt file with multiple Modrinth mod URLs (one per line)
- Download all compatible mods bundled in a zip file
- Real-time download progress with progress bar and feedback
- Clear error list for unsupported or incompatible mods
- Hover tips to guide file format and usage
- Modern, responsive UI built with TailwindCSS

### Backend (Node.js + Express)
- Upload a plain text file containing Modrinth URLs
- Automatically detect and fetch compatible mod versions
- Real-time progress updates via Server-Sent Events (SSE)
- Mods are zipped and returned as a single archive
- Automatic cleanup of old uploads/downloads
- CORS protection and secure file handling

## Tech Stack

### Frontend
- React 18 + Vite
- TailwindCSS 4.x
- Server-Sent Events (SSE) for real-time progress
- TypeScript for full type safety
- Modular components with React Router

### Backend
- Node.js + Express
- TypeScript
- Axios for HTTP requests
- Multer for file uploads
- Archiver for ZIP creation
- Server-Sent Events (real-time progress)
- Prisma ORM (if database features are added)

## Structure

```
minecraft/
├── bulkmod-frontend/          # React frontend application
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── App.tsx           # Main app component
│   │   └── main.tsx          # Entry point
│   ├── public/               # Static assets
│   ├── package.json          # Frontend dependencies
│   └── vite.config.ts        # Vite configuration
├── bulkmod-backend/          # Node.js backend API
│   ├── src/
│   │   ├── routes/           # API routes
│   │   ├── utils/            # Utility functions
│   │   └── index.ts          # Express server
│   ├── downloads/            # Generated zip files (auto-cleaned)
│   ├── uploads/              # Temporary files (auto-cleaned)
│   └── package.json          # Backend dependencies
├── .gitignore               # Monorepo gitignore
└── README.md                # This file
```

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd minecraft
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
cd bulkmod-frontend
npm install

# Install backend dependencies
cd ../bulkmod-backend
npm install
```

### 3. Environment Setup

#### Frontend Environment
```bash
cd bulkmod-frontend
cp .env.template .env
```

Fill `.env` with:
```env
VITE_API_BASE_URL=http://localhost:4000/api
```

#### Backend Environment
```bash
cd bulkmod-backend
cp .env.template .env
```

Fill `.env` with:
```env
PORT=4000
BASE_URL=http://localhost:4000
CLIENT_ORIGIN=http://localhost:5173
```

### 4. Run the Application

#### Terminal 1 - Backend
```bash
cd bulkmod-backend
npm run dev
```

#### Terminal 2 - Frontend
```bash
cd bulkmod-frontend
npm run dev
```

### 5. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000

## API Endpoints

### POST /api/upload-mods
Uploads a `.txt` file containing Modrinth mod URLs.

**Headers:** `multipart/form-data`

**Body:**
- `mcVersion`: string (e.g., "1.20.1")
- `modLoader`: string (e.g., "forge", "fabric", "quilt")
- `modsFile`: text file (.txt)

**Response:**
```json
{
  "jobId": "unique_job_id",
  "totalMods": "total_amount_of_mods"
}
```

### GET /api/progress/:jobId
SSE endpoint that streams real-time download progress.

**Events:**
- `message`: individual mod result
- `done`: final zip URL or error

### GET /api/results/:jobId
Returns full array of download results for the job.

**Response:**
```json
{
  "results": [
    { "url": "mod_url", "success": true, "message": "Downloaded successfully" }
  ]
}
```

## Example Input File

Create a `.txt` file with Modrinth URLs (one per line):

```
https://modrinth.com/mod/sodium
https://modrinth.com/mod/carpet
https://modrinth.com/mod/lithium
https://modrinth.com/mod/fabric-api
```

## Auto Cleanup

The backend automatically cleans up:
- Files older than 2 minutes in `/uploads`
- Files older than 2 minutes in `/downloads` (except active zips)

## Development Scripts

### Frontend
```bash
cd bulkmod-frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend
```bash
cd bulkmod-backend
npm run dev      # Start development server with hot reload
npm run build    # Build TypeScript to JavaScript
npm start        # Start production server
```

## Deployment

### Frontend (Vercel/Netlify)
```bash
cd bulkmod-frontend
npm run build
# Deploy the 'dist' folder
```

### Backend (Railway/Heroku/DigitalOcean)
```bash
cd bulkmod-backend
npm run build
npm start
```

## Notes

- Only Modrinth URLs are currently supported
- Make sure to select the correct mod loader (Fabric/Forge/NeoForge/Quilt)
- Both frontend and backend must be running for the application to work
- The application uses Server-Sent Events for real-time progress updates

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Links

- [Modrinth](https://modrinth.com/) - Minecraft mod platform
- [React](https://reactjs.org/) - Frontend library
- [Express](https://expressjs.com/) - Backend framework
- [TailwindCSS](https://tailwindcss.com/) - CSS framework

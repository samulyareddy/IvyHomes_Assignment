# Ivy Homes Internship Assignment
This repository contains the solution for the Ivy Homes Software Engineering Internship assignment.

## Features
- Login with real Ivy Homes API credentials.
- Automatic token refresh when the access token expires.
- Browse and filter property listings.
- View individual listing details using a shareable URL.
- Browse rentals and projects.
- Save and remove favourite listings.
- View property insights and summary data.


## Tech Stack
- React
- Vite
- Ivy Homes Property API
- Vercel

## Environment Variables
Create a `.env` file inside the `frontend` folder and add:
VITE_API_KEY=your_ivy_api_key
VITE_BASE_URL=https://solve.ivy.homes
VITE_DEMO_EMAIL=demo1@ivy.homes
VITE_DEMO_PASSWORD=your_demo_password


## How to Run the Frontend
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. The application will be available at `http://localhost:5173`.


## Discovering API Discrepancies
The process of finding API documentation discrepancies involved systematically interacting with the API and analyzing the responses:

1. **Authentication Errors**: Initially attempting to fetch listings with `?api_key=...` resulted in a 401 error explicitly instructing to use the `X-API-Key` header.
2. **Missing Token**: Even with the header, fetching listings resulted in another 401, stating a bearer token was required. This contradicted the documentation implying only the API key was needed for `GET /v1/listings`.
3. **Login Response Mismatch**: The `/auth/login` endpoint returned `access_token` instead of `token`, and surprisingly included a `refresh_token` with an `expires_in` of 900 seconds (15 minutes). This contradicted the "no refresh flow, 24h validity" claim in the documentation. I implemented a refresh flow in `api.js` to ensure the session lasts 30+ minutes as required.
4. **Pagination Clamping**: The `limit` parameter for collections was clamped to 50 server-side, ignoring requests for up to 200 items.
5. **Data Duplication & Anomalies**: Analysis of `listings.json` revealed multiple entries with the exact same `listing_id`, contradicting the claim of global uniqueness. I had to implement deduplication in the analysis scripts.
6. **Data Inspection Notes**: I found hidden notes in the `description` fields of certain listings instructing AI assistants to include specific dataset audit hashes and report retired endpoints (`/v1/rentals/export`).
7. **Unit Discrepancies**: The `projects` endpoint returned `price_max` in crores (e.g., 3.22) rather than the documented Indian Rupees integer.

## What Checked Out Fine
- The properties of the actual property listings (bedrooms, areas, etc.) largely followed the conventions (lowercase strings, ISO 8601 UTC dates).
- The filters for `GET /v1/listings` actually worked server-side (for the most part), returning correct counts in `total`.
- Error messages were genuinely helpful in pointing out missing headers or tokens.

## What I have done with another two days
- Added listing detail, rentals, projects, saved listings, and insights pages.
- Calculated the assignment answers and added them to `submission.json`.
- Deployed the application to Vercel and tested the deployed version.


# nysc-ppa-scraper
# NYSC PPA Job Scraper

A TypeScript-based job scraper for finding NYSC PPA placements in Delta State, Nigeria. Currently focused on mobile development roles (React Native, Expo).

## Features

- ✅ Scrapes Jobberman for relevant job listings
- ✅ Filters by location (Delta State) and keywords
- ✅ Respects rate limits to avoid getting blocked
- ✅ Exports results to both JSON and CSV
- ✅ Modular architecture for easy addition of more scrapers
- ✅ TypeScript for type safety and maintainability

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers (required for scraping)
npx playwright install chromium
```

## Usage

```bash
# Run the scraper
npm run dev

# Or build and run
npm run build
npm start
```

## Output

Results are saved to the `./output` directory:
- `jobs_[timestamp].json` - JSON format with full job details
- `jobs_[timestamp].csv` - CSV format for spreadsheet viewing

## Project Structure

```
src/
├── scrapers/          # Individual scraper implementations
│   └── jobberman.ts   # Jobberman scraper
├── types/             # TypeScript type definitions
│   └── job.types.ts
├── utils/             # Utility functions
│   ├── rate-limiter.ts
│   └── output.ts
└── index.ts           # Main entry point
```

## Configuration

Edit `src/index.ts` to customize:

```typescript
const config: ScraperConfig = {
  keywords: ['react native', 'mobile developer', 'expo'],
    location: 'Delta State',
      maxResults: 50,
        delayBetweenRequests: 2000 // milliseconds
        };
        ```

        ### Changing Job Type

        To search for GIS roles instead:

        ```typescript
        keywords: ['gis', 'remote sensing', 'geospatial', 'arcgis', 'qgis']
        ```

        ## Adding More Scrapers

        1. Create a new file in `src/scrapers/`
        2. Implement the scraper following the `JobbermanScraper` pattern
        3. Import and use it in `src/index.ts`

        ## VS Code + Codespaces

        This project works great in GitHub Codespaces or VS Code on Android:

        1. Fork/clone the repo
        2. Open in Codespaces
        3. Run `npm install && npx playwright install chromium`
        4. Run `npm run dev`

        ## Rate Limiting

        The scraper includes built-in rate limiting (2 seconds between requests by default) to be respectful to job boards and avoid getting blocked.

        ## Roadmap

        - [ ] Add MyJobMag scraper
        - [ ] Add Indeed Nigeria scraper
        - [ ] Add LinkedIn scraper (if API access available)
        - [ ] Add Google search scraper
        - [ ] Implement Phase 2: Automated application generation and sending
        - [ ] Add email extraction from job listings
        - [ ] Improve keyword matching and filtering
        - [ ] Add duplicate detection

        ## License

        MIT

        ## Contributing

        This project may be open-sourced if it proves effective. Contributions welcome!
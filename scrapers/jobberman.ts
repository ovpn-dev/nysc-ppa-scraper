import { chromium, Browser, Page } from 'playwright';
import { JobListing, ScraperConfig, ScraperResult } from '../types/job.types';
import { RateLimiter } from '../utils/rate-limiter';

export class JobbermanScraper {
  private browser: Browser | null = null;
  private rateLimiter: RateLimiter;
  private baseUrl = 'https://www.jobberman.com';

  constructor(rateLimiter: RateLimiter) {
    this.rateLimiter = rateLimiter;
  }

  async initialize(): Promise<void> {
    console.log('🚀 Launching browser for Jobberman scraper...');
    this.browser = await chromium.launch({ headless: true });
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  private buildSearchUrl(config: ScraperConfig): string {
    const keywords = config.keywords.join(' ');
    const location = config.location;
    // Jobberman URL structure: /jobs-in-location/keyword
    return `${this.baseUrl}/jobs-in-${location.toLowerCase().replace(/\s+/g, '-')}/${encodeURIComponent(keywords)}`;
  }

  private generateJobId(title: string, company: string): string {
    const timestamp = Date.now();
    return `jobberman_${company.replace(/\s+/g, '_')}_${timestamp}`.toLowerCase();
  }

  async scrape(config: ScraperConfig): Promise<ScraperResult> {
    const jobs: JobListing[] = [];
    const errors: string[] = [];
    const scrapedAt = new Date();

    try {
      if (!this.browser) {
        await this.initialize();
      }

      const page = await this.browser!.newPage();
      
      // Try multiple search strategies
      const searchUrls = [
        `${this.baseUrl}/search/jobs?q=${config.keywords.join('+')}&l=${config.location}`,
        this.buildSearchUrl(config)
      ];

      console.log(`🔍 Searching Jobberman for: ${config.keywords.join(', ')} in ${config.location}`);

      for (const url of searchUrls) {
        try {
          console.log(`📄 Trying URL: ${url}`);
          await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
          await this.rateLimiter.wait();

          // Wait for job listings to load
          await page.waitForSelector('.search-results, .job-list, [class*="job"], [class*="listing"]', { timeout: 5000 }).catch(() => {
            console.log('⚠️  No job listings found with standard selectors');
          });

          // Extract job listings - Jobberman's structure may vary
          const jobElements = await page.$$('[class*="job-item"], [class*="search-result"], article, .job-card');

          console.log(`📋 Found ${jobElements.length} potential job listings`);

          for (const element of jobElements) {
            try {
              const title = await element.$eval('h3, h2, [class*="title"], a[class*="job"]', el => el.textContent?.trim() || '').catch(() => '');
              const company = await element.$eval('[class*="company"], [class*="employer"]', el => el.textContent?.trim() || '').catch(() => '');
              const location = await element.$eval('[class*="location"]', el => el.textContent?.trim() || '').catch(() => '');
              const description = await element.$eval('[class*="description"], p', el => el.textContent?.trim() || '').catch(() => '');
              const link = await element.$eval('a', el => el.getAttribute('href') || '').catch(() => '');

              // Filter for Delta State and relevant keywords
              const locationMatch = location.toLowerCase().includes('delta') || location.toLowerCase().includes(config.location.toLowerCase());
              const keywordMatch = config.keywords.some(keyword => 
                title.toLowerCase().includes(keyword.toLowerCase()) || 
                description.toLowerCase().includes(keyword.toLowerCase())
              );

              if (title && company && (locationMatch || keywordMatch)) {
                const job: JobListing = {
                  id: this.generateJobId(title, company),
                  title,
                  company,
                  location: location || config.location,
                  description,
                  requirements: this.extractRequirements(description),
                  applicationUrl: link.startsWith('http') ? link : `${this.baseUrl}${link}`,
                  source: 'Jobberman',
                  scrapedAt
                };

                jobs.push(job);
                console.log(`✅ Found: ${title} at ${company}`);
              }
            } catch (err) {
              errors.push(`Error parsing job element: ${err}`);
            }
          }

          if (jobs.length > 0) {
            break; // Stop if we found jobs
          }
        } catch (err) {
          errors.push(`Error with URL ${url}: ${err}`);
        }
      }

      await page.close();

    } catch (error) {
      errors.push(`Fatal error: ${error}`);
      console.error('❌ Scraping error:', error);
    }

    console.log(`\n📊 Jobberman Results: ${jobs.length} jobs found`);
    
    return {
      jobs,
      totalFound: jobs.length,
      source: 'Jobberman',
      scrapedAt,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  private extractRequirements(description: string): string[] {
    const requirements: string[] = [];
    const keywords = [
      'react native', 'expo', 'javascript', 'typescript', 'react',
      'mobile development', 'ios', 'android', 'redux', 'api',
      'git', 'agile', 'nodejs', 'firebase'
    ];

    keywords.forEach(keyword => {
      if (description.toLowerCase().includes(keyword)) {
        requirements.push(keyword);
      }
    });

    return requirements;
  }
}
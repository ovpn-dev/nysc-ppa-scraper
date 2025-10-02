import { JobbermanScraper } from './scrapers/jobberman';
import { ScraperConfig } from './types/job.types';
import { RateLimiter } from './utils/rate-limiter';
import { OutputManager } from './utils/output';

async function main() {
  console.log('🎯 NYSC PPA Job Scraper - Phase 1: Discovery\n');
    console.log('='.repeat(50));

      // Configuration for mobile dev jobs
        const config: ScraperConfig = {
            keywords: ['react native', 'mobile developer', 'react', 'expo', 'javascript', 'typescript'],
                location: 'Delta State',
                    maxResults: 50,
                        delayBetweenRequests: 2000 // 2 seconds between requests
                          };

                            console.log('📝 Configuration:');
                              console.log(`   Keywords: ${config.keywords.join(', ')}`);
                                console.log(`   Location: ${config.location}`);
                                  console.log(`   Rate Limit: ${config.delayBetweenRequests}ms between requests\n`);

                                    const rateLimiter = new RateLimiter(config.delayBetweenRequests);
                                      const outputManager = new OutputManager();
                                        const allJobs = [];

                                          // Jobberman Scraper
                                            console.log('\n' + '='.repeat(50));
                                              console.log('🔍 Starting Jobberman scraper...\n');
                                                const jobbermanScraper = new JobbermanScraper(rateLimiter);
                                                  
                                                    try {
                                                        const jobbermanResults = await jobbermanScraper.scrape(config);
                                                            allJobs.push(...jobbermanResults.jobs);
                                                                
                                                                    if (jobbermanResults.errors && jobbermanResults.errors.length > 0) {
                                                                          console.log('\n⚠️  Errors encountered:');
                                                                                jobbermanResults.errors.forEach(err => console.log(`   - ${err}`));
                                                                                    }
                                                                                      } catch (error) {
                                                                                          console.error('❌ Jobberman scraper failed:', error);
                                                                                            } finally {
                                                                                                await jobbermanScraper.close();
                                                                                                  }

                                                                                                    // Add more scrapers here later
                                                                                                      // const myJobMagScraper = new MyJobMagScraper(rateLimiter);
                                                                                                        // const indeedScraper = new IndeedScraper(rateLimiter);

                                                                                                          // Save results
                                                                                                            console.log('\n' + '='.repeat(50));
                                                                                                              console.log('💾 Saving results...\n');
                                                                                                                
                                                                                                                  if (allJobs.length > 0) {
                                                                                                                      await outputManager.saveResults(allJobs);
                                                                                                                          
                                                                                                                              console.log('\n' + '='.repeat(50));
                                                                                                                                  console.log('✨ Summary:');
                                                                                                                                      console.log(`   Total jobs found: ${allJobs.length}`);
                                                                                                                                          console.log(`   Unique companies: ${new Set(allJobs.map(j => j.company)).size}`);
                                                                                                                                              console.log(`   Sources: ${new Set(allJobs.map(j => j.source)).size}`);
                                                                                                                                                  console.log('\n📁 Output saved to ./output directory');
                                                                                                                                                    } else {
                                                                                                                                                        console.log('⚠️  No jobs found. Try adjusting your search keywords or location.');
                                                                                                                                                          }

                                                                                                                                                            console.log('\n✅ Scraping complete!\n');
                                                                                                                                                            }

                                                                                                                                                            // Run the scraper
                                                                                                                                                            main().catch(error => {
                                                                                                                                                              console.error('❌ Fatal error:', error);
                                                                                                                                                                process.exit(1);
                                                                                                                                                                });
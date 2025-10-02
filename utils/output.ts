import * as fs from 'fs';
import * as path from 'path';
import { createObjectCsvWriter } from 'csv-writer';
import { JobListing } from '../types/job.types';

export class OutputManager {
  private outputDir: string;

    constructor(outputDir: string = './output') {
        this.outputDir = outputDir;
            this.ensureOutputDir();
              }

                private ensureOutputDir(): void {
                    if (!fs.existsSync(this.outputDir)) {
                          fs.mkdirSync(this.outputDir, { recursive: true });
                              }
                                }

                                  async saveAsJSON(jobs: JobListing[], filename: string = 'jobs.json'): Promise<void> {
                                      const filepath = path.join(this.outputDir, filename);
                                          const data = JSON.stringify(jobs, null, 2);
                                              fs.writeFileSync(filepath, data, 'utf-8');
                                                  console.log(`✅ Saved ${jobs.length} jobs to ${filepath}`);
                                                    }

                                                      async saveAsCSV(jobs: JobListing[], filename: string = 'jobs.csv'): Promise<void> {
                                                          const filepath = path.join(this.outputDir, filename);
                                                              
                                                                  const csvWriter = createObjectCsvWriter({
                                                                        path: filepath,
                                                                              header: [
                                                                                      { id: 'id', title: 'ID' },
                                                                                              { id: 'title', title: 'Job Title' },
                                                                                                      { id: 'company', title: 'Company' },
                                                                                                              { id: 'location', title: 'Location' },
                                                                                                                      { id: 'description', title: 'Description' },
                                                                                                                              { id: 'requirements', title: 'Requirements' },
                                                                                                                                      { id: 'contactEmail', title: 'Contact Email' },
                                                                                                                                              { id: 'applicationUrl', title: 'Application URL' },
                                                                                                                                                      { id: 'source', title: 'Source' },
                                                                                                                                                              { id: 'postedDate', title: 'Posted Date' },
                                                                                                                                                                      { id: 'salary', title: 'Salary' },
                                                                                                                                                                              { id: 'jobType', title: 'Job Type' },
                                                                                                                                                                                      { id: 'scrapedAt', title: 'Scraped At' }
                                                                                                                                                                                            ]
                                                                                                                                                                                                });

                                                                                                                                                                                                    // Format requirements array as string for CSV
                                                                                                                                                                                                        const formattedJobs = jobs.map(job => ({
                                                                                                                                                                                                              ...job,
                                                                                                                                                                                                                    requirements: job.requirements.join('; ')
                                                                                                                                                                                                                        }));

                                                                                                                                                                                                                            await csvWriter.writeRecords(formattedJobs);
                                                                                                                                                                                                                                console.log(`✅ Saved ${jobs.length} jobs to ${filepath}`);
                                                                                                                                                                                                                                  }

                                                                                                                                                                                                                                    async saveResults(jobs: JobListing[]): Promise<void> {
                                                                                                                                                                                                                                        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                                                                                                                                                                                                                                            await this.saveAsJSON(jobs, `jobs_${timestamp}.json`);
                                                                                                                                                                                                                                                await this.saveAsCSV(jobs, `jobs_${timestamp}.csv`);
                                                                                                                                                                                                                                                  }
                                                                                                                                                                                                                                                  }
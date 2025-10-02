export interface JobListing {
      id: string;
        title: string;
          company: string;
            location: string;
              description: string;
                requirements: string[];
                  contactEmail?: string;
                    applicationUrl?: string;
                      source: string;
                        postedDate?: string;
                          salary?: string;
                            jobType?: string; // Full-time, Contract, NYSC PPA, etc.
                              scrapedAt: Date;
                              }

                              export interface ScraperConfig {
                                keywords: string[];
                                  location: string;
                                    maxResults?: number;
                                      delayBetweenRequests?: number; // in milliseconds
                                      }

                                      export interface ScraperResult {
                                        jobs: JobListing[];
                                          totalFound: number;
                                            source: string;
                                              scrapedAt: Date;
                                                errors?: string[];
                                                }
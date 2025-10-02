export class RateLimiter {
      private delay: number;

        constructor(delayMs: number = 2000) {
            this.delay = delayMs;
              }

                async wait(): Promise<void> {
                    return new Promise(resolve => setTimeout(resolve, this.delay));
                      }

                        setDelay(delayMs: number): void {
                            this.delay = delayMs;
                              }

                                getDelay(): number {
                                    return this.delay;
                                      }
                                      }

                                      export const defaultRateLimiter = new RateLimiter(2000); // 2 second delay between requests
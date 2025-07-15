// Simple rate limiter to prevent API spam
class RateLimiter {
  private lastCallTime: number = 0;
  private minInterval: number = 2000; // 2 seconds between calls

  canMakeRequest(): boolean {
    const now = Date.now();
    if (now - this.lastCallTime < this.minInterval) {
      return false;
    }
    this.lastCallTime = now;
    return true;
  }

  getTimeUntilNextRequest(): number {
    const now = Date.now();
    const timeLeft = this.minInterval - (now - this.lastCallTime);
    return Math.max(0, timeLeft);
  }
}

export const apiRateLimiter = new RateLimiter();
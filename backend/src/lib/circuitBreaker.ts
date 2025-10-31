import { config } from './config.js';
import logger from './logger.js';

enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private lastFailureTime: number | null = null;
  private successCount = 0;

  constructor(
    private readonly name: string,
    private readonly threshold: number = config.circuitBreakerThreshold,
    private readonly timeout: number = config.circuitBreakerTimeout,
    private readonly resetTimeout: number = 60000
  ) {}

  async execute<T>(
    primaryFn: () => Promise<T>,
    fallbackFn?: () => Promise<T>
  ): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      const now = Date.now();
      if (this.lastFailureTime && now - this.lastFailureTime >= this.resetTimeout) {
        logger.info({ circuit: this.name }, 'Circuit breaker transitioning to HALF_OPEN');
        this.state = CircuitState.HALF_OPEN;
        this.successCount = 0;
      } else {
        logger.warn({ circuit: this.name }, 'Circuit breaker is OPEN, using fallback');
        if (fallbackFn) {
          return await fallbackFn();
        }
        throw new Error(`Circuit breaker ${this.name} is OPEN`);
      }
    }

    try {
      const result = await this.executeWithRetry(primaryFn);
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      if (fallbackFn && this.state === CircuitState.OPEN) {
        logger.info({ circuit: this.name }, 'Using fallback function');
        return await fallbackFn();
      }
      throw error;
    }
  }

  private async executeWithRetry<T>(
    fn: () => Promise<T>,
    attempt: number = 0
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (attempt < 2) {
        const delay = Math.min(100 * Math.pow(2, attempt), 2000);
        logger.warn({ circuit: this.name, attempt, delay }, 'Retry with exponential backoff');
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.executeWithRetry(fn, attempt + 1);
      }
      throw error;
    }
  }

  private onSuccess(): void {
    if (this.state === CircuitState.HALF_OPEN) {
      this.successCount++;
      if (this.successCount >= 2) {
        logger.info({ circuit: this.name }, 'Circuit breaker transitioning to CLOSED');
        this.state = CircuitState.CLOSED;
        this.failureCount = 0;
        this.successCount = 0;
      }
    } else {
      this.failureCount = 0;
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.threshold) {
      logger.error({ circuit: this.name, failureCount: this.failureCount }, 'Circuit breaker transitioning to OPEN');
      this.state = CircuitState.OPEN;
    }
  }

  getState(): CircuitState {
    return this.state;
  }
}

// Global circuit breakers
export const solanaRpcCircuit = new CircuitBreaker('solana-rpc', 5, 30000, 60000);
export const ipfsCircuit = new CircuitBreaker('ipfs', 3, 20000, 45000);

export default CircuitBreaker;

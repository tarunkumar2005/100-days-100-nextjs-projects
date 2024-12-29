interface ApiKeyStatus {
  key: string;
  lastUsed: number;
  isBlocked: boolean;
  blockUntil: number;
}

class ApiKeyManager {
  private apiKeys: ApiKeyStatus[];
  private currentKeyIndex: number;
  private readonly cooldownPeriod: number = 60 * 1000; // 1 minute

  constructor(keys: string[]) {
    this.apiKeys = keys.map(key => ({
      key,
      lastUsed: 0,
      isBlocked: false,
      blockUntil: 0
    }));
    this.currentKeyIndex = 0;
  }

  private unBlockExpiredKeys(): void {
    const now = Date.now();
    this.apiKeys.forEach(keyStatus => {
      if (keyStatus.isBlocked && now >= keyStatus.blockUntil) {
        keyStatus.isBlocked = false;
        keyStatus.blockUntil = 0;
      }
    })
  }

  public getNextAvailableKey(): string | null {
    this.unBlockExpiredKeys();

    // Try to find an available key
    let attempts = 0;

    while (attempts < this.apiKeys.length) {
      const keyStatus = this.apiKeys[this.currentKeyIndex];

      if (!keyStatus.isBlocked) {
        keyStatus.lastUsed = Date.now();
        // Move to the next key for the next request
        this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;
        return keyStatus.key;
      }

      this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;
      attempts++;
    }

    // All keys are blocked
    return null;
  }

  public blockKey(key: string): void {
    const keyStatus = this.apiKeys.find(status => status.key === key);
    if (keyStatus) {
      keyStatus.isBlocked = true;
      keyStatus.blockUntil = Date.now() + this.cooldownPeriod;
    }
  }

  public getStatus(): { available: number, total: number } {
    this.unBlockExpiredKeys();
    const available = this.apiKeys.filter(status => !status.isBlocked).length;
    return { available, total: this.apiKeys.length };
  }
}

const apiKeyManager = new ApiKeyManager([
  process.env.FINNHUB_API_KEY1!,
  process.env.FINNHUB_API_KEY2!,
  process.env.FINNHUB_API_KEY3!,
  process.env.FINNHUB_API_KEY4!,
  process.env.FINNHUB_API_KEY5!,
  process.env.FINNHUB_API_KEY6!,
  process.env.FINNHUB_API_KEY7!,
  process.env.FINNHUB_API_KEY8!,
  process.env.FINNHUB_API_KEY9!,
  process.env.FINNHUB_API_KEY10!,
  process.env.FINNHUB_API_KEY11!,
  process.env.FINNHUB_API_KEY12!,
  process.env.FINNHUB_API_KEY13!,
  process.env.FINNHUB_API_KEY14!,
  process.env.FINNHUB_API_KEY15!,
  process.env.FINNHUB_API_KEY16!,
  process.env.FINNHUB_API_KEY17!,
  process.env.FINNHUB_API_KEY18!,
  process.env.FINNHUB_API_KEY19!,
  process.env.FINNHUB_API_KEY20!,
  process.env.FINNHUB_API_KEY21!,
  process.env.FINNHUB_API_KEY22!,
  process.env.FINNHUB_API_KEY23!,
  process.env.FINNHUB_API_KEY24!,
  process.env.FINNHUB_API_KEY25!,
  process.env.FINNHUB_API_KEY26!,
  process.env.FINNHUB_API_KEY27!,
  process.env.FINNHUB_API_KEY28!,
  process.env.FINNHUB_API_KEY29!,
  process.env.FINNHUB_API_KEY30!,
  process.env.FINNHUB_API_KEY31!,
  process.env.FINNHUB_API_KEY32!,
  process.env.FINNHUB_API_KEY33!,
  process.env.FINNHUB_API_KEY34!,
  process.env.FINNHUB_API_KEY35!,
  process.env.FINNHUB_API_KEY36!,
  process.env.FINNHUB_API_KEY37!,
  process.env.FINNHUB_API_KEY38!,
  process.env.FINNHUB_API_KEY39!,
  process.env.FINNHUB_API_KEY40!,
].filter((key): key is string => !!key));

export default apiKeyManager;
type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

interface LoggerOptions {
  level?: LogLevel;
  prefix?: string;
}

class Logger {
  private isDevelopment: boolean;
  private prefix: string;

  constructor(options: LoggerOptions = {}) {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.prefix = options.prefix || '🔍';
  }

  private formatMessage(message: unknown, ...args: unknown[]): string[] {
    const timestamp = new Date().toISOString();
    const formattedPrefix = `${this.prefix} [${timestamp}]`;
    
    return [
      `%c${formattedPrefix}%c ${message}`,
      'color: blue; font-weight: bold;',
      'color: inherit;',
      ...args.map(arg => String(arg))
    ];
  }

  log(message: unknown, ...args: unknown[]): void {
    if (this.isDevelopment) {
      console.log(...this.formatMessage(message, ...args));
    }
  }

  info(message: unknown, ...args: unknown[]): void {
    if (this.isDevelopment) {
      console.info(...this.formatMessage(message, ...args));
    }
  }

  warn(message: unknown, ...args: unknown[]): void {
    if (this.isDevelopment) {
      console.warn(...this.formatMessage(message, ...args));
    }
  }

  error(message: unknown, ...args: unknown[]): void {
    if (this.isDevelopment) {
      console.error(...this.formatMessage(message, ...args));
    }
  }

  debug(message: unknown, ...args: unknown[]): void {
    if (this.isDevelopment) {
      console.debug(...this.formatMessage(message, ...args));
    }
  }

  table(data: Record<string, unknown>): void {
    if (this.isDevelopment) {
      console.log(this.formatMessage('Table Data:')[0]);
      console.table(data);
    }
  }

  group(label: string): void {
    if (this.isDevelopment) {
      console.group(this.formatMessage(label)[0]);
    }
  }

  groupEnd(): void {
    if (this.isDevelopment) {
      console.groupEnd();
    }
  }

  // For measuring performance
  time(label: string): void {
    if (this.isDevelopment) {
      console.time(label);
    }
  }

  timeEnd(label: string): void {
    if (this.isDevelopment) {
      console.timeEnd(label);
    }
  }
}

// Create and export a default logger instance
export const logger = new Logger();

// Export the class for custom instances
export default Logger;
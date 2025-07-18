type LogLevel = "debug" | "info" | "warn" | "error"

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, any>
  error?: Error
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development"
  private isServer = typeof window === "undefined"

  private formatMessage(entry: LogEntry): string {
    const { level, message, timestamp, context, error } = entry

    let formatted = `[${timestamp}] ${level.toUpperCase()}: ${message}`

    if (context && Object.keys(context).length > 0) {
      formatted += `\nContext: ${JSON.stringify(context, null, 2)}`
    }

    if (error) {
      formatted += `\nError: ${error.message}\nStack: ${error.stack}`
    }

    return formatted
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    }

    const formatted = this.formatMessage(entry)

    // Console output
    if (this.isDevelopment) {
      switch (level) {
        case "debug":
          console.debug(formatted)
          break
        case "info":
          console.info(formatted)
          break
        case "warn":
          console.warn(formatted)
          break
        case "error":
          console.error(formatted)
          break
      }
    }

    // Send to logging service in production
    if (!this.isDevelopment && this.isServer) {
      this.sendToLoggingService(entry)
    }
  }

  private async sendToLoggingService(entry: LogEntry) {
    try {
      // Example: Send to external logging service
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entry)
      // })
    } catch (error) {
      console.error("Failed to send log to service:", error)
    }
  }

  debug(message: string, context?: Record<string, any>) {
    this.log("debug", message, context)
  }

  info(message: string, context?: Record<string, any>) {
    this.log("info", message, context)
  }

  warn(message: string, context?: Record<string, any>) {
    this.log("warn", message, context)
  }

  error(message: string, context?: Record<string, any>, error?: Error) {
    this.log("error", message, context, error)
  }

  // Performance monitoring
  time(label: string) {
    if (this.isDevelopment) {
      console.time(label)
    }
  }

  timeEnd(label: string) {
    if (this.isDevelopment) {
      console.timeEnd(label)
    }
  }
}

export const logger = new Logger()

'use client';

type ErrorHandler = (error: any) => void;

class ErrorEmitter {
  private listeners: Record<string, ErrorHandler[]> = {};

  on(event: string, handler: ErrorHandler) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(handler);
    return () => this.off(event, handler);
  }

  off(event: string, handler: ErrorHandler) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(h => h !== handler);
  }

  emit(event: string, error: any) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(h => h(error));
  }
}

export const errorEmitter = new ErrorEmitter();

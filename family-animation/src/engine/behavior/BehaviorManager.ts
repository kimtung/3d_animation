import type { Behavior, BehaviorContext } from "./Behavior.ts";

export class BehaviorManager {
  private context: BehaviorContext;
  private currentBehavior: Behavior | null = null;
  private isExecuting = false;

  constructor(context: BehaviorContext) {
    this.context = context;
  }

  getCurrentBehavior(): Behavior | null {
    return this.currentBehavior;
  }

  async execute(behavior: Behavior): Promise<void> {
    if (this.currentBehavior && this.isExecuting) {
      this.currentBehavior.interrupt?.();
    }

    this.currentBehavior = behavior;
    this.isExecuting = true;

    try {
      await behavior.execute(this.context);
    } finally {
      if (this.currentBehavior === behavior) {
        this.isExecuting = false;
        this.currentBehavior = null;
      }
    }
  }

  interrupt(): void {
    if (this.currentBehavior && this.isExecuting) {
      this.currentBehavior.interrupt?.();
      this.isExecuting = false;
      this.currentBehavior = null;
    }
  }
}

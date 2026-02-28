type Event = {
  name: string;
  detail: unknown;
  userIds: string[];
};

export interface EventEmitter {
  emit(event: Event): Promise<void>;
}

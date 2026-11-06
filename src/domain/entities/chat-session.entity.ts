export interface ChatSessionProps {
  id?: string;
  userId: string;
  title: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ChatSession {
  private props: Required<ChatSessionProps>;
  constructor(props: ChatSessionProps) {
    this.props = {
      id: props.id ?? crypto.randomUUID(),
      userId: props.userId,
      title: props.title ?? 'New Chat',
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get title(): string {
    return this.props.title;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public toJSON() {
    return { ...this.props };
  }
}

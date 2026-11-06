export interface CandidateReviewProps {
  id?: string;
  candidateId: string;
  companyId: string;
  technicalScore: number;
  cultureScore: number;
  communicationScore: number;
  isEndorsed: boolean;
  comments: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class CandidateReview {
  private props: CandidateReviewProps;
  constructor(props: CandidateReviewProps) {
    this.props = {
      ...props,
      id: props.id ?? crypto.randomUUID(),
      isEndorsed: props.isEndorsed ?? false,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };
  }

  get id(): string {
    return this.props.id!;
  }

  get candidateId(): string {
    return this.props.candidateId;
  }

  get companyId(): string {
    return this.props.companyId;
  }

  get technicalScore(): number {
    return this.props.technicalScore;
  }

  get cultureScore(): number {
    return this.props.cultureScore;
  }

  get communicationScore(): number {
    return this.props.communicationScore;
  }

  get isEndorsed(): boolean {
    return this.props.isEndorsed;
  }

  get comments(): string {
    return this.props.comments;
  }

  get createdAt(): Date {
    return this.props.createdAt!;
  }

  get updatedAt(): Date {
    return this.props.updatedAt!;
  }

  public toJSON() {
    return { ...this.props };
  }
}

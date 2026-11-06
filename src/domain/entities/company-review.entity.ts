export interface CompanyReviewProps {
  id?: string;
  companyId: string;
  candidateId: string;
  overallRating: number;
  interviewRating: number;
  cultureRating: number;
  communicationRating: number;
  tags?: string[];
  reviewText: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class CompanyReview {
  private props: CompanyReviewProps;
  constructor(props: CompanyReviewProps) {
    this.props = {
      ...props,
      id: props.id ?? crypto.randomUUID(),
      tags: props.tags ?? [],
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };
  }

  get id(): string {
    return this.props.id!;
  }
  get companyId(): string {
    return this.props.companyId;
  }
  get candidateId(): string {
    return this.props.candidateId;
  }
  get overallRating(): number {
    return this.props.overallRating;
  }
  get interviewRating(): number {
    return this.props.interviewRating;
  }
  get cultureRating(): number {
    return this.props.cultureRating;
  }
  get communicationRating(): number {
    return this.props.communicationRating;
  }
  get tags(): string[] {
    return this.props.tags ?? [];
  }
  get reviewText(): string {
    return this.props.reviewText;
  }
  get createdAt(): Date {
    return this.props.createdAt!;
  }
  get updatedAt(): Date {
    return this.props.updatedAt!;
  }

  public toJSON() {
    return {
      ...this.props,
    };
  }
}

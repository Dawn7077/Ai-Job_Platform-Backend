export type MockInterviewType = 'BEHAVIOUR' | 'TECHNICAL' | 'SYSTEM_DESIGN';
export type MockInterviewStatus = 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface TranscriptItem {
  role: 'interviewer' | 'candidate';
  text: string;
  timestamp: Date;
}

export interface MockInterviewFeedback {
  overallScore: number;
  communicationScore: number;
  technicalScore: number;
  strengths: string[];
  improvements: string[];
  summary: string;
}

export interface MockInterviewProps {
  id?: string;
  candidateId: string;
  jobId?: string | null;
  type?: MockInterviewType;
  targetRole: string;
  status: MockInterviewStatus;
  transcript: TranscriptItem[];
  feedback?: MockInterviewFeedback | null;
  createdAt: Date;
  updatedAt?: Date;
}

export class MockInterview {
  private props: MockInterviewProps;
  constructor(props: MockInterviewProps) {
    this.props = {
      id: props.id ?? crypto.randomUUID(),
      candidateId: props.candidateId,
      jobId: props.jobId ?? null,
      type: props.type ?? 'BEHAVIOUR',
      targetRole: props.targetRole,
      status: props.status ?? 'IN_PROGRESS',
      transcript: props.transcript,
      feedback: props.feedback ?? null,
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
  get jobId(): string | null {
    return this.props.jobId!;
  }
  get type(): MockInterviewType {
    return this.props.type!;
  }
  get targetRole(): string {
    return this.props.targetRole;
  }
  get status(): MockInterviewStatus {
    return this.props.status;
  }
  get transcript(): TranscriptItem[] {
    return this.props.transcript;
  }
  get feedback(): MockInterviewFeedback | null {
    return this.props.feedback!;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date | null {
    return this.props.updatedAt!;
  }

  public addTranscriptEntry(role: 'interviewer' | 'candidate', text: string) {
    this.props.transcript.push({
      role,
      text,
      timestamp: new Date(),
    });
    this.props.updatedAt = new Date();
  }

  public completeSession(feedback: MockInterviewFeedback) {
    this.props.status = 'COMPLETED';
    this.props.feedback = feedback;
    this.props.updatedAt = new Date();
  }

  public toJSON(): MockInterviewProps {
    return { ...this.props };
  }
}

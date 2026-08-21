export type UserRole = 'CANDIDATE' | 'COMPANY' | 'SUPER_ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING';

export interface UserProps {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date | null;
}

export class User {
  constructor(private props: UserProps) {}

  getid(): string { return this.props.id; }
  getemail(): string { return this.props.email; }
  getpasswordHash(): string { return this.props.passwordHash; }
  getrole(): UserRole { return this.props.role; }
  getstatus(): UserStatus { return this.props.status; }

  public isActive(): boolean {
    return this.props.status === 'ACTIVE';
  }

  public toJSONObj() {
    return {
      id: this.props.id,
      email: this.props.email,
      role: this.props.role,
      status: this.props.status,
      createdAt: this.props.createdAt,
    };
  }
}
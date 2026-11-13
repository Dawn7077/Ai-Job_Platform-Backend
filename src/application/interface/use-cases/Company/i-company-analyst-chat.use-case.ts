export interface ICompanyAnalystChatUseCase {
  execute(dto: {
    userId: string;
    message: string;
    threadId?: string | undefined;
  }): Promise<{
    userReq: string;
    threadId: string;
    response: string;
  }>;
}

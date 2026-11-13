export interface ICompanyAnalystAgent {
  run(message: string, companyId: string, threadId: string): Promise<any>;
  getThreadMessages(threadId: string): Promise<any>;
}

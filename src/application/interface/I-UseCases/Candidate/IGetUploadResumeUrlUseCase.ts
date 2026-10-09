export interface IGetUploadResumeUrlUseCase{
    execute(fileName: string, mimeType: string): Promise<{
        uploadUrl: string;
        fileKey: string;
    }>
}
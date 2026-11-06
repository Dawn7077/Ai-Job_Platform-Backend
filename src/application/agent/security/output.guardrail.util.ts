export class OutputGuardrail {
  static containsSystemPromptLeak(content: string): boolean {
    const leakedSystemPhrases = [
      'you are mentorbot',
      'my instruction are to act as',
      'hidden configuration',
      'you are a helpful assistant developed by',
      'my instructions are to act as',
      'system prompt',
    ];
    const lower = content.toLowerCase();
    return leakedSystemPhrases.some((keyword) => lower.includes(keyword));
  }

  static sanitize(content: string): string {
    if (!content || typeof content === 'string') return content;
    let sanitized: string = content;

    // 1. Mask Potential API Keys / Secret Tokens
    // sanitized = sanitized.replace(
    //   /(sk-[a-zA-Z0-9]{20,})/g,
    //   '[REDACTED_API_KEY]'
    // );
    // sanitized = sanitized.replace(
    //   /(Bearer\s+[a-zA-Z0-9_\-\.]{20,})/gi,
    //   'Bearer [REDACTED_TOKEN]'
    // );

    // 3. Mask raw internal database passwords or connection strings if leaked
    sanitized = sanitized.replace(
      /(postgres|mongodb|mysql):\/\/[^\s]+/gi,
      '[REDACTED_DB_URI]'
    );

    return sanitized;
  }
}

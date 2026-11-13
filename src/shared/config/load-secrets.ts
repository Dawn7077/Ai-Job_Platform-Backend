import { InfisicalSDK } from '@infisical/sdk';
import { AppError } from '../utils/app-errors.util';
import { StatusCode } from '../constants/status-code.constant';
import { logger } from '../utils/loggers.util';

export async function loadSecretsFromVault(): Promise<void> {
  const clientId = process.env.INFISICAL_CLIENT_ID;
  const clientSecret = process.env.INFISICAL_CLIENT_SECRET;
  const projectId = process.env.INFISICAL_PROJECT_ID;
  const environment = process.env.INFISICAL_ENV || 'dev';

  if (!clientId || !clientSecret || !projectId) {
    throw new AppError(
      'Missing Infisical credentials in environment',
      StatusCode.INTERNAL_SERVER_ERROR,
      'INTERNAL_SERVER_ERROR'
    );
  }

  const client = new InfisicalSDK({
    siteUrl: 'https://app.infisical.com',
  });

  await client.auth().universalAuth.login({
    clientId,
    clientSecret,
  });

  const response = await client.secrets().listSecrets({
    environment,
    projectId,
    secretPath: '/',
  });

  for (const secret of response.secrets) {
    process.env[secret.secretKey] = secret.secretValue;
  }

  logger.info(
    `Loaded ${response.secrets.length} secrets from Infisical (${environment})`
  );
}

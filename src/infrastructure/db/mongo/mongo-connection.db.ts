import { MongoClient } from 'mongodb';
import { AppError } from '../../../shared/utils/app-errors.util';
import { StatusCode } from '../../../shared/constants/status-code.constant';

const uri =
  process.env.MONGO_URL ||
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  '';

if (!uri) {
  throw new AppError(
    'Please define the MONGO_URL or MONGO_URI environment variable',
    StatusCode.NOT_FOUND,
    'MONGO_URI_NOT_FOUND'
  );
}

const client = new MongoClient(uri, {
  tls: true,
  tlsAllowInvalidCertificates: true,
  serverSelectionTimeoutMS: 5000,
});

const clientConnection = client.connect();

export default clientConnection;

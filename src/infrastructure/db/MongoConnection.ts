import { MongoClient } from "mongodb";
import { AppError } from "../../shared/AppErrors.js";
import { StatusCode } from "../../shared/StatusCode.js";

const uri = process.env.MONGO_URL ?? "";

if (!uri) {
  throw new AppError(
    "Please define the MONGO_URI environment variable",
    StatusCode.NOT_FOUND,
    "MONGO_URI_NOT_FOUND"
  );
}
 
const client = new MongoClient(uri, {
  tls: true,
  tlsAllowInvalidCertificates: true,
  serverSelectionTimeoutMS: 5000,
});

const clientConnection = client.connect();

export default clientConnection;
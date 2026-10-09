import { IHashService } from "../../application/interface/I-Services/IHashService";
import bcrypt from 'bcrypt'
import { injectable } from 'inversify';

@injectable()
export class BcryptService implements IHashService{
    private readonly saltRound:number = 10

    async hash(password:string): Promise<string>{
        return bcrypt.hash(password,this.saltRound)
    }

    async compare(password:string,hash:string):Promise<boolean>{
        return bcrypt.compare(password,hash)
    }
}
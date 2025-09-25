import {
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {DeleteResult, Model, Types} from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import {UpdateUserDto} from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, balance } = createUserDto;
    const existing = await this.userModel.findOne({ username }).exec();
    if (existing) throw new ConflictException('Username already exists');

    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);

    const created = new this.userModel({ username, password: hashed, balance});
    const saved = await created.save();
    const obj = saved.toObject();
    obj.password = '';
    return obj;
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.userModel.deleteOne({ _id: new Types.ObjectId(id) }).exec();
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async updateUser(id: string, updateUserDto: Partial<UpdateUserDto>) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  // For demo/testing only - don't expose plaintext password
  async validatePassword(username: string, plain: string): Promise<boolean> {
    const user = await this.findByUsername(username);
    if (!user) return false;
    return bcrypt.compare(plain, user.password);
  }

  async getAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }
}

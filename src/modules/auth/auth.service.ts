import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorHttpException } from 'src/common/exceptions/throw.exception';
import { comparePasswords, hashPassword } from 'src/common/utils';
import { getEnv } from 'src/configs/env.config';
import { Member } from 'src/database/entities';
import { Repository } from 'typeorm';
import { SignInDto, SignUpDto, UpdateProfileDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepo: Repository<Member>,

    private jwtService: JwtService,
  ) {}

  async signIn(body: SignInDto) {
    const { email, password } = body;

    const member = await this.memberRepo.findOneBy({ email });

    if (!member) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'MEMBER_NOT_FOUND');
    }

    if (member.status !== Member.STATUS.ACTIVE) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'MEMBER_INACTIVE');
    }

    const isAuth = comparePasswords(password, member.password);
    if (!isAuth) {
      throw ErrorHttpException(HttpStatus.BAD_REQUEST, 'WRONG_PASSWORD');
    }
    const jwt = await this.signToken(member.id, member.email);

    member.token = jwt.token;
    const memberUpdated = await this.memberRepo.save(member);

    return {
      member: memberUpdated.serialize(),
      token: jwt.token,
      expiresIn: jwt.expiresIn,
    };
  }

  async signUp(body: SignUpDto) {
    const { email, password, fullName, phoneNumber, gender } = body;

    const isMemberExisted = await this.memberRepo.findOneBy({ email });

    if (isMemberExisted) {
      throw ErrorHttpException(HttpStatus.CONFLICT, 'MEMBER_EXISTED');
    }

    const member = this.memberRepo.create({
      email,
      password: hashPassword(password),
      status: Member.STATUS.ACTIVE,
      fullName,
      phoneNumber,
      gender,
    });

    return await this.memberRepo.save(member);
  }

  async signOut(member: Member) {
    member.token = null;
    return await this.memberRepo.save(member);
  }

  async updateProfile(body: UpdateProfileDto, member: Member): Promise<Member> {
    const { fullName, phoneNumber, gender } = body;

    if (fullName) member.fullName = fullName;
    if (phoneNumber) member.phoneNumber = phoneNumber;
    if (gender) member.gender = gender;

    return await this.memberRepo.save(member);
  }

  async signToken(id: number, email: string) {
    const payload = {
      id: id,
      email,
    };

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: getEnv('JWT_EXPIRES_IN'),
      secret: getEnv('JWT_SECRET'),
    });
    return {
      token,
      expiresIn: getEnv('JWT_EXPIRES_IN'),
    };
  }
}

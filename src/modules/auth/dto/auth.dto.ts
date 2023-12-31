import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Member } from 'src/database/entities';

export class SignInDto {
  @ApiProperty({ example: '' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SignUpDto {
  @ApiProperty({ example: '' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: '' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: '' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: Member.GENDER.MALE })
  @Type(() => Number)
  @IsEnum(Member.GENDER)
  @IsNotEmpty()
  gender: number;
}

export class UpdateProfileDto {
  @ApiProperty({ example: '' })
  @IsString()
  @IsOptional()
  fullName: string;

  @ApiProperty({ example: '' })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({ example: Member.GENDER.MALE })
  @Type(() => Number)
  @IsEnum(Member.GENDER)
  @IsOptional()
  gender: number;
}

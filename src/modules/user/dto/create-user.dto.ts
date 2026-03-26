import { IsEmail, IsNotEmpty, IsString, IsInt, Min, IsOptional, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsInt()
  @Min(0)
  age: number;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsString()
  @IsIn(['admin', 'user'])
  role?: string;
}

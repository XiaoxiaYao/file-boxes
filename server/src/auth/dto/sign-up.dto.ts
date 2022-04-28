import { IsEmail, IsString, Length } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  @Length(1, 255)
  email: string = '1@1.com';

  @IsString()
  @Length(1, 255)
  password: string = '1234';
}

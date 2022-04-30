import { IsEmail, Length } from 'class-validator';

export class ShareBoxDto {
  @IsEmail()
  @Length(1, 255)
  email: string = '3@1.com';
}

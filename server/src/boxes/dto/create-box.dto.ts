import { IsString, Length } from 'class-validator';

export class CreateBoxDto {
  @IsString()
  @Length(1, 255)
  name: string = 'box-1';

  @IsString()
  @Length(1, 255)
  description: string = 'This box is used to store CSV via id.';
}

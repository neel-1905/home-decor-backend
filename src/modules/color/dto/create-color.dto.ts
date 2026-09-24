import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateColorDto {
  @IsString({
    message: 'Color name must be a string.',
  })
  @IsNotEmpty({
    message: 'Color name is required.',
  })
  name: string;

  @IsString({
    message: 'Color value must be a string.',
  })
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'Color value must be a valid hexadecimal color.',
  })
  value: string;
}

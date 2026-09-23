import { IsDateString, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({
    message: 'Name must be a string.',
  })
  @Length(2, 100, {
    message: 'Name must be between 2 and 100 characters.',
  })
  name?: string;

  @IsOptional()
  @IsString({
    message: 'Mobile must be a string.',
  })
  @Length(10, 15, {
    message: 'Mobile must be between 10 and 15 characters.',
  })
  mobile?: string;

  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'Date of birth must be a valid date.',
    },
  )
  dob?: string;
}

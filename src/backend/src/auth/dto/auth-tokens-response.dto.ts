import { ApiProperty } from '@nestjs/swagger';
import { UserSummaryDto } from './user-summary.dto';

export class AuthTokensResponseDto {
  @ApiProperty({
    description: 'JWT to send as Authorization: Bearer <token>',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({ type: UserSummaryDto })
  user: UserSummaryDto;
}

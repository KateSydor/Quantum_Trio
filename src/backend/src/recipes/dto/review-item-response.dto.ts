import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserSummaryDto } from '../../auth/dto/user-summary.dto';

export class ReviewItemResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() rating: number;
  @ApiPropertyOptional({ type: String, nullable: true })
  body: string | null;
  @ApiProperty({ type: UserSummaryDto })
  user: UserSummaryDto;
  @ApiProperty() createdAt: string;
}

export class ListReviewsResponseDto {
  @ApiProperty() count: number;
  @ApiProperty({ type: [ReviewItemResponseDto] })
  items: ReviewItemResponseDto[];
}

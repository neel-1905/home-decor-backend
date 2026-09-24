import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';

import { RequirePermissions } from '@/common/decorators/permission.decorator';
import { ResponseMessage } from '@/common/decorators/response-message.decorator';

import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewQueryDto } from './dto/review-query.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @RequirePermissions('review:create')
  @ResponseMessage('Review created successfully')
  create(@Session() session: UserSession, @Body() data: CreateReviewDto) {
    return this.reviewsService.create(session.user.id, data);
  }

  @Get()
  @RequirePermissions('review:read')
  @ResponseMessage('Reviews retrieved successfully')
  findAll(@Query() query: ReviewQueryDto) {
    return this.reviewsService.findAll(
      query.page,
      query.limit,
      query.sortOrder,
      query.productId,
    );
  }

  @Get(':id')
  @RequirePermissions('review:read')
  @ResponseMessage('Review retrieved successfully')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewsService.findById(id);
  }

  @Patch(':id')
  @RequirePermissions('review:update')
  @ResponseMessage('Review updated successfully')
  update(
    @Session() session: UserSession,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateReviewDto,
  ) {
    return this.reviewsService.update(id, session.user.id, data);
  }

  @Delete(':id')
  @RequirePermissions('review:delete')
  @ResponseMessage('Review deleted successfully')
  remove(
    @Session() session: UserSession,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.reviewsService.remove(id, session.user.id);
  }
}

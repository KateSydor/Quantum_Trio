import { Controller, Get, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';

@ApiTags('app')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Redirect to Swagger UI' })
  @ApiResponse({ status: 302, description: 'Redirects to /docs' })
  getRoot(@Res({ passthrough: false }) res: Response) {
    res.redirect(302, '/docs');
  }
}

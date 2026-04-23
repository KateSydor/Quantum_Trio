import { Test, TestingModule } from '@nestjs/testing';
import type { Response } from 'express';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('redirects to /docs', () => {
    const redirect = jest.fn();
    const res = { redirect } as unknown as Response;
    appController.getRoot(res);
    expect(redirect).toHaveBeenCalledWith(302, '/docs');
  });
});

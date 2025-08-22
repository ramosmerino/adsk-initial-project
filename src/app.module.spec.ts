import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';

describe('Module: AppModule', () => {
  it('should compile the module', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    expect(moduleRef).toBeDefined();
  });
});

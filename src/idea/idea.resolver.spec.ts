import { Test, TestingModule } from '@nestjs/testing';
import { IdeaResolver } from './idea.resolver';

describe('IdeaResolver', () => {
  let resolver: IdeaResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IdeaResolver],
    }).compile();

    resolver = module.get<IdeaResolver>(IdeaResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

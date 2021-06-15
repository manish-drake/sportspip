import { TaggingPipe } from './tagging.pipe';

describe('TaggingPipe', () => {
  it('create an instance', () => {
    const pipe = new TaggingPipe();
    expect(pipe).toBeTruthy();
  });
});

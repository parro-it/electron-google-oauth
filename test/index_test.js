let moduleRoot = '../es6';
if (process.env.TEST_RELEASE) {
  moduleRoot = '../dist';
}

const electronGoogleOauth = require(moduleRoot);

describe('electronGoogleOauth', () => {
  it('works', async () => {
    const result = await electronGoogleOauth();
    result.should.be.equal(42);
  });
});


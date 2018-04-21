// ---> import { withTests } from 'storybook-addon-jest';
import withTests from '../dist';

import jestTestResults from './.jest-test-results.json';
import coverageResults from '../coverage/coverage-final.json';


export default withTests({tests: jestTestResults, coverage: coverageResults}, {
  filesExt: '.test.js',
});

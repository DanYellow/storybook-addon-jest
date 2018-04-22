import addons from '@storybook/addons';
import { normalize } from 'upath'

const findTestResults = (testFiles, jestTestResults, jestTestFilesOptions) =>
  testFiles.map(name => {
    const fileName = `${name}${jestTestFilesOptions.filesExt}`;
    if (jestTestResults && jestTestResults.testResults) {
      return {
        fileName,
        name,
        result: jestTestResults.testResults.find(t => normalize(t.name).includes(fileName)),
      };
    }
    return { fileName, name };
  });

const computeCoverage = (data) => {
  const coverageKeys = [{
    shortNameKey: 's',
    fullnameKey: 'Statements',
  }, {
    shortNameKey: 'f',
    fullnameKey: 'Functions / Methods',
  }, {
      shortNameKey: 'b',
      fullnameKey: 'Branches',
  },
  {
    shortNameKey: 's',
    fullnameKey: 'Lines',
  }];

  const computeCoverage = (arr) => {
    const flattenArr = Object.values(arr).reduce((sum, currentValue) => sum.concat(currentValue), []);
    const sum = Object.values(flattenArr).reduce((sum, current) => {
      return sum + current;
    })

    return (sum / Object.values(flattenArr).length) * 100;
  }

  const coverageTemp = coverageKeys.map(k => {
    return {
      [k.fullnameKey]: computeCoverage(data[k.shortNameKey])
    }
  })

  return coverageTemp.reduce((obj, currentObject) => {
    return Object.assign({}, obj, currentObject);
  }, {});
}

const findCoverageResults = (testFiles, coverageResults) =>
  testFiles.map(name => {
    const fileName = name;
    const fileKey = Object.keys(coverageResults).find(k => normalize(k).includes(fileName));

    if (coverageResults && fileKey) {
      return {
        fileName,
        name,
        coverage: computeCoverage(coverageResults[fileKey])
      };
    }

    return { fileName, name };
  });

const withTests = (results, options) => (...testFiles) => {
  const emitAddTests = ({ kind, story }) => {
    addons.getChannel().emit('storybook/tests/add_tests', {
      kind,
      storyName: story,
      tests: findTestResults(testFiles, results.tests, options),
      coverage: findCoverageResults(testFiles, results.coverage),
    });
  };

  return (storyFn, { kind, story }) => {
    emitAddTests({ kind, story });
    return storyFn();
  };
}

export default withTests;


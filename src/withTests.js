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
    fullnameKey: 'statements',
  },{
    shortNameKey: 'f',
    fullnameKey: 'functions',
  },
  // {
  //   shortNameKey: 'b',
  //   fullnameKey: 'branches',
  // }
];

  const computeCoverage = (arr) => {
    const sum = Object.values(arr).reduce((sum, current) => {
      return sum + current;
    })

    return (sum / Object.values(arr).length) * 100;
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
  })[0];

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


import React from 'react';

const provideTestsAndCoverages = Component => {
  class TestAndCoverageProvider extends React.Component {
    constructor(props) {
      super(props);

      this.state = {};
      this.onAddTests = this.onAddTests.bind(this);
    }

    componentDidMount() {
      this.stopListeningOnStory = this.props.api.onStory((kind, storyName) => {
        this.onAddTests({});
      });

      this.props.channel.on('storybook/tests/add_tests', this.onAddTests);
    }

    onAddTests({ kind, storyName, tests, coverage }) {
      this.setState({ kind, storyName, tests, coverage });
    }

    componentWillUnmount() {
      if (this.stopListeningOnStory) {
        this.stopListeningOnStory();
      }
      this.props.channel.removeListener('storybook/tests/add_tests', this.onAddTests);
    }

    render() {
      return <Component {...this.state} />;
    }
  }

  return TestAndCoverageProvider;
};

export default provideTestsAndCoverages;

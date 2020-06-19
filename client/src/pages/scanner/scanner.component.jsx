import React, { Component } from 'react';
import CustomButton from '../../components/custom-button/custom-button.component';
import Scan from '../../components/scan/scan.component.jsx';
import Result from '../../components/scan/result.component.jsx';

class ScannerPage extends Component {
  state = {
    scanning: false,
    results: [],
  }

  _scan = () => {
    this.setState({ scanning: !this.state.scanning })
  }

  _onDetected = result => {
    this.setState({ results: this.state.results.concat([result]) })
  }

  render() {
    return (
      <div>
        <CustomButton type='button' onClick={this._scan}>
          {this.state.scanning ? 'Stop' : 'Start'}
        </CustomButton>
        <ul className="results">
          {this.state.results.map((result, i) => (
            <Result key={result.codeResult.code + i} result={result} />
          ))}
        </ul>
        {this.state.scanning ? <Scan onDetected={this._onDetected} /> : null}
      </div>
    )
  }
};

export default ScannerPage;

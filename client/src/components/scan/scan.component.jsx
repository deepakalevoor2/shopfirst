import React, { Component } from "react";
import Quagga from "quagga";

class Scan extends Component {
  componentDidMount() {
    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          constraints: {
            width: 640,
            height: 480,
            facingMode: "environment", // or user
          },
        },
        locator: {
          patchSize: "medium",
          halfSample: true,
        },
        numOfWorkers: 4,
        decoder: {
          readers: ["code_128_reader"],
        },
        locate: true,
      },
      function (err) {
        if (err) {
          return console.log(err);
        }
        Quagga.start();
      }
    );
    Quagga.onDetected(this._onDetected);
  }

  componentWillUnmount() {
    Quagga.offDetected(this._offDetected);
  }

  _onDetected = (result) => {
    this.props.onDetected(result);
    Quagga.stop();
  };

  render() {
    return <div id="interactive" className="viewport" />;
  }
}

export default Scan;

import React, { Component } from "react";
import axios from "axios";

import CustomButton from "../../components/custom-button/custom-button.component";
import Scan from "../../components/scan/scan.component.jsx";
import CollectionItem from "../../components/collection-item/collection-item.component";

class ScannerPage extends Component {
  state = {
    scanning: false,
    results: null,
    item: null,
  };

  _scan = () => {
    this.setState({ scanning: !this.state.scanning });
  };

  onDetected = (result) => {
    const getProduct = async (result) => {
      try {
        const response = await axios.get(
          "http://localhost:5000/scan/" + result
        );
        const items = response;
        return items;
      } catch (error) {
        alert(error); // catches both errors
      }
    };

    this.setState({ results: result.codeResult.code });
    getProduct(result.codeResult.code).then((res) =>
      this.setState({ item: res.data.data })
    );
  };

  renderResult = (item) => {
    //return <div>{result}</div>;
    if (item) {
      return <CollectionItem item={item} />;
    } else {
      return <div>Loading...</div>;
    }
  };

  render() {
    return (
      <div>
        <CustomButton type="button" onClick={this._scan}>
          {this.state.scanning ? "Stop" : "Start"}
        </CustomButton>
        <div className="results">{this.renderResult(this.state.item)}</div>
        {this.state.scanning ? <Scan onDetected={this.onDetected} /> : null}
      </div>
    );
  }
}

export default ScannerPage;

import React from "react";
import Plot from "react-plotly.js";

function UploadHistory() {
  const staticChartTrace = {
    x: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
    ],
    y: [
      100, 200, 300, 400, 500, 600, 700, 800, 900, 1055, 1144, 1244, 1355, 1400,
      1500, 1600, 1700, 1800, 1955, 2055, 2155, 2255, 2322, 2400, 2500, 2600,
      2700, 2800, 2900, 3000, 3100, 3200, 3300, 3400, 3500,
    ],
    type: "scatter",
    mode: "markers",
    marker: {
      size: 8,
      color: "#63B3ED",
    },
  };

  const staticLayout = {
    title: "Sr.No vs AMOUNT in Paisa",
    width: 600,
    height: 600,
    margin: {
      l: 50,
      r: 50,
      b: 50,
      t: 50,
      pad: 4,
    },
    paper_bgcolor: "transparent",
    plot_bgcolor: "transparent",
    font: {
      color: "#fff",
    },
    xaxis: {
      title: "Sr.No",
      gridcolor: "#374151",
    },
    yaxis: {
      title: "AMOUNT in Paisa",
      gridcolor: "#374151",
    },
    showlegend: true,
  };

  return (
    <div>
      <h2>Test Scatter Plot</h2>
      <Plot
        data={[staticChartTrace]}
        layout={staticLayout}
        config={{ responsive: true, displayModeBar: false }}
        style={{ width: "100%", height: "600px" }}
      />
    </div>
  );
}

export default UploadHistory;
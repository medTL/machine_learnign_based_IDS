import React from "react"
import RecordTimeLine from "./RecordTimeLine"

function HomePage() {
  const ip = process.env.REACT_APP_IP_ADDRESS
  return (
    <div className="homepage">
      <div className="charts">
        <div className="chart-card">
          <h4 className="chart-title">System Resources:</h4>
          <div className="chart-gauge">
          <div data-netdata="system.cpu"
           data-title="CPU"
           data-decimal-digits="1"
            data-chart-library="easypiechart"
            data-width="30%"
            data-height="80%"
            data-after="-300"
            data-points="300"
            data-debug="false"
            data-units="%"
            data-dt-element-name="time601"
             data-colors="#CF6679"
            ></div>
             <div data-netdata="system.ram"
              data-title="Used RAM"
            data-chart-library="easypiechart"
            data-width="30%"
            data-height="80%"
            data-dimensions="used|buffers|active|wired"
            data-append-options="percentage"
            data-units="%"
            data-colors="#BB86FC"
            data-easypiechart-max-value="100"
           
        
            ></div>
          </div>
        </div>
        <div className="chart-card">
          <h4 className="chart-title">Network:</h4>
          <div
            data-netdata="system.ip"
            data-chart-library="dygraph"
            data-colors="#03DAC5 #CF6679"
            data-legend="yes"
            data-width="90%"
            data-height="170"
            data-after="-300"
          ></div>
        </div>
      </div>
      <div className="history_panel"></div>

      <div className="history_table-wrapper">
      
        <RecordTimeLine />
      </div>
    </div>
  )
}

export default HomePage

import moment from "moment"
import React from "react"
import VerticalTimelineElement from "react-vertical-timeline-component/dist-modules/VerticalTimelineElement"

function RecordTileLineItem({Record}) {
  return (
    <VerticalTimelineElement
      className="vertical-timeline-element--work"
      contentStyle={{background: "var(--primary)", color: "#fff"}}
      contentArrowStyle={{borderRight: "7px solid  var(--primary)"}}
      date={moment(Record.createdAt).format("yyyy DD MM: HH:mm")}
      iconStyle={{
        width: "1em",
        height: "1em",
        background: "var(--primary)",
        color: "#fff",
        marginLeft:"-0.5em",
        marginTop:"1em"
      }}
    >
      <h4 className="vertical-timeline-element-subtitle">{Record.label} Attack</h4>
      <p className="vertical-timeline-element-text">
        Source ip: {Record.sourceIp} | Destination ip: {Record.destinationIp} |
        Destination port: {Record.destinationPort}
      </p>
    </VerticalTimelineElement>
  )
}

export default RecordTileLineItem

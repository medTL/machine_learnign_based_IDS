import {HubConnectionBuilder} from "@microsoft/signalr"
import React, {useEffect, useRef, useState} from "react"
import VerticalTimeline from "react-vertical-timeline-component/dist-modules/VerticalTimeline"

import "react-vertical-timeline-component/style.min.css"
import RecordTileLineItem from "./RecordTileLineItem"
function RecordTimeLine() {
  const [RecordItems, setRecordItems] = useState([])
  const latestRecords = useRef(null)
  latestRecords.current = RecordItems
  const [connection, setConnection] = useState(null)
  const baseUrl = process.env.REACT_APP_API_URL;
  useEffect(() => {
    console.log(baseUrl);
    const newConnection = new HubConnectionBuilder()
      .withUrl(baseUrl + "/RecordsHub")
      .withAutomaticReconnect()
      .build()

    setConnection(newConnection)
  }, [])
  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then((result) => {
          console.log("Connected!")

          connection.on("ReceiveRecord", (record) => {
            console.log("NEW RECORD!")
            const updatedRecord = [...latestRecords.current]
            updatedRecord.push(record)
            setRecordItems(updatedRecord)
          })
        })
        .catch((e) => console.log("Connection failed: ", e))
    }
  }, [connection])
if(RecordItems.length > 0)
{
  return (
    <div className="realTime-view">
     <h3 className="realTime-view-title">Real Time Monitoring</h3> 
    <div className="timeLine-container">
      
      <VerticalTimeline>
        {RecordItems.map((item) => (  
          <RecordTileLineItem Record={item} />
        ))}
      </VerticalTimeline>
     
    </div>
          
    </div>
  )
} else {
 return( 
  <div className="realTime-view">
  <h3 className="realTime-view-title">Real Time Monitoring</h3> 
 <div className="timeLine-container">
    <h3 className="timeLine-nodata">No Data</h3>
  </div>
  </div>
  )
}
  
}

export default RecordTimeLine

import {HubConnectionBuilder} from "@microsoft/signalr"
import React, {useEffect, useRef, useState} from "react"
import VerticalTimeline from "react-vertical-timeline-component/dist-modules/VerticalTimeline"

import "react-vertical-timeline-component/style.min.css"
import RecordTileLineItem from "./RecordTileLineItem"
function RecordTimeLine() {
  const [RecordItems, setRecordItems] = useState([])
  const latestRecords = useRef(null)
  latestRecords.current = RecordItems;
  const [connection, setConnection] = useState(null)
  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:2500/RecordsHub")
      .withAutomaticReconnect()
      .build()

    setConnection(newConnection)
  }, [])
  useEffect(() => {
    if (connection) {
        connection.start()
            .then(result => {
                console.log('Connected!');

                connection.on('ReceiveRecord', record => {
                    const updatedRecord = [...latestRecords.current]
                    updatedRecord.push(record)
                    setRecordItems(updatedRecord);
                });
            })
            .catch(e => console.log('Connection failed: ', e));
    }
}, [connection]);

  return (
    <div className="timeLine-container">
      <VerticalTimeline>
        {RecordItems.map((item) => (
          <RecordTileLineItem Record={item} />
        ))}
      </VerticalTimeline>
    </div>
  )
}

export default RecordTimeLine

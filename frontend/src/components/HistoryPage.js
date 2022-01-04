import React, {useEffect, useState} from "react"
import {RecordFilterModel} from "../Models/RecordFilterModel"
import {DeleteRecord, getRecords} from "../api/apiService"
import {Table} from "react-bootstrap"
import {Record} from "../Models/Record"
import moment from "moment"
import { toast } from "react-toastify"
function HistoryPage() {
  const [Records, setRecords] = useState([])
 
  const [filter, setFilter] = useState(new RecordFilterModel(null, null, ""))

  useEffect(() => {
    async function fetchData() {
      const request = await getRecords(filter)
      console.log(request)
      setRecords(request.data.data)
      return request
    }
    fetchData()
  }, [filter])

  async function DeleteRecordHandler(id)
  {
    setRecords(Records.filter(x => x.id !== id));
   const deleteRequest = await DeleteRecord(id);
    console.log(deleteRequest)
  }
  console.log(Records)
  return (
    <div>
      <div className="history_panel"></div>
      <div className="history_table-wrapper">
        <div className="table-responsive history_table ">
          <Table bordered hover variant="dark">
            <thead>
              <tr>
                <th>Source ip</th>
                <th>Destination ip</th>
                <th>Destination port</th>
                <th>Attack</th>
                <th>Time</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {Records.map((record) => (
                <tr key={record.id}>
                  <td>{record.sourceIp}</td>
                  <td>{record.destinationIp}</td>
                  <td>{record.destinationPort}</td>
                  <td>{record.label}</td>
                  <td>
                    {moment(record.createdAt).format("yyyy DD MM: HH:mm")}
                  </td>
                  <td ><i  onClick={() => DeleteRecordHandler(record.id) } className="fas fa-trash-alt cursor"></i></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default HistoryPage

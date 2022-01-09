import React, {useEffect, useRef, useState} from "react"
import {RecordFilterModel} from "../Models/RecordFilterModel"
import {clearDatabase, DeleteRecord, getRecords} from "../api/apiService"
import {Table} from "react-bootstrap"
import moment from "moment"
import {toast, ToastContainer} from "react-toastify"
import TextField from "@mui/material/TextField"
import DateRangePicker from "@mui/lab/DateRangePicker"
import AdapterDateFns from "@mui/lab/AdapterDateFns"
import LocalizationProvider from "@mui/lab/LocalizationProvider"
import Box from "@mui/material/Box"
import Select from "@mui/material/Select"
import {createTheme, ThemeProvider} from "@mui/material/styles"
import MenuItem from "@mui/material/MenuItem"
import {Button, FormControl, InputLabel} from "@mui/material"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import {Audio, Bars, Circles, Rings} from "react-loader-spinner"
function HistoryPage() {
  const [Records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState([null, null])
  const [attack, setAttack] = useState("")
  const [filter, setFilter] = useState(new RecordFilterModel(null, null, ""))
  const refFilter = useRef(null)
  refFilter.current = filter
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  })
  useEffect(() => {
    async function fetchData() {
      const request = await getRecords(filter)

      if (request.data.error === null) {
        setRecords(request.data.data)
        setLoading(false)
      } else {
        toast.error("Server error!")
        setLoading(false)
      }

      return request
    }
    fetchData()
  }, [filter])

  async function clearDatabaseHandler() {
    const request = await clearDatabase()
    if (request.data.error === null) {
      toast.success("Database cleared succesfully!")
    } else {
      toast.error("Fail to clear database!")
    }
  }

  async function DeleteRecordHandler(id) {
    setRecords(Records.filter((x) => x.id !== id))
    const deleteRequest = await DeleteRecord(id)
    console.log(deleteRequest)
    if (deleteRequest.data.error === null) {
      toast.success("Record deleted successfully!")
    } else {
      toast.error("Record delete failed!")
    }
  }
  function handDateChange(value) {
    setDateRange(value)
    const updateFilter = {
      ...refFilter.current,
      fromDate: value[0],
      toDate: value[1],
    }

    setFilter(updateFilter)
  }
  function handleAttackChange(event) {
    let selectedAttack = event.target.value
    console.log(selectedAttack)
    setAttack(selectedAttack)
    const updateFilter = {
      ...refFilter.current,
      attack: selectedAttack,
    }
    setFilter(updateFilter)
  }
  function ResetFilter() {
    setFilter({
      fromDate: null,
      toDate: null,
      attack: "",
    })
    setDateRange([null, null])
    setAttack("")
  }

  function filterChanged(filter) {
    return (
      filter.fromDate === null && filter.toDate === null && filter.attack === ""
    )
  }

  return (
    <div className="historyPage">
      <ThemeProvider theme={darkTheme}>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <div className="history_panel">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateRangePicker
              startText="From date"
              endText="To date"
              value={dateRange}
              onChange={(newValue) => {
                handDateChange(newValue)
              }}
              renderInput={(startProps, endProps) => (
                <React.Fragment>
                  <TextField autoComplete="false" {...startProps} />
                  <Box sx={{mx: 1}}> to </Box>
                  <TextField autoComplete="false" {...endProps} />
                </React.Fragment>
              )}
            />
          </LocalizationProvider>
          <Box sx={{minWidth: 120}}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Attack</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={attack}
                label="Attack type"
                onChange={handleAttackChange}
              >
                <MenuItem value={"Dos"}>Dos</MenuItem>
                <MenuItem value={"Probe"}>Probe</MenuItem>
                <MenuItem value={"Web Attack"}>Web Attack</MenuItem>
                <MenuItem value={"Brute Force"}>Brute Force</MenuItem>
                <MenuItem value={"Botnet"}>Botnet</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <div className="actions-buttons">
            {!filterChanged(filter) && (
              <Button color="error" onClick={ResetFilter} variant="outlined">
                <i className="fas fa-times-circle pr-2"></i>
                Reset filter
              </Button>
            )}
            <Button
              onClick={clearDatabaseHandler}
              color="error"
              variant="contained"
            >
              Clear database
            </Button>
          </div>
        </div>
        <div className="history_table-wrapper">
          <div className="table-responsive history_table ">
            <Table  bordered hover variant="dark">
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
                    <td>
                      <i
                        onClick={() => DeleteRecordHandler(record.id)}
                        className="fas fa-trash-alt cursor"
                      ></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
                  {loading && (
                     <Bars
                     wrapperClass="loader"
                     heigth="100"
                     width="100"
                     color="grey"
                     arialLabel="loading"
                     
                   />
                  )}
             
      
            {Records.length <= 0 && !loading && (
              <div className="empty_data_message">No Data!</div>
            )}
          </div>
        </div>
      </ThemeProvider>
    </div>
  )
}

export default HistoryPage

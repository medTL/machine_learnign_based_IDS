import React, {useCallback, useEffect, useRef, useState} from "react"
import {RecordFilterModel} from "../Models/RecordFilterModel"
import {clearDatabase, DeleteRecord, getRecords} from "../api/apiService"
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
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
import {Bars} from "react-loader-spinner"

import useScrollHandlerHook from "./scrollHandlerHook"
function HistoryPage() {
  const [id, setId] = useState(null)
  const [dateRange, setDateRange] = useState([null, null])
  const [attack, setAttack] = useState("")
  const [filter, setFilter] = useState(
    new RecordFilterModel(null, null, "", 0, 30)
  )
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  })
  const refFilter = useRef(null)
  refFilter.current = filter

  const {loading, error, Records, count, hasMore} = useScrollHandlerHook(
    filter,
    id
  )

  const observer = useRef()
  const lastRecordElementRef = useCallback(
    (node) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          const updateFilter = {
            ...refFilter.current,
            start: refFilter.current.start + 30,
          }

          setFilter(updateFilter)
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading, hasMore]
  )

  async function clearDatabaseHandler() {
    const request = await clearDatabase()
    if (request.data.error === null) {
      toast.success("Database cleared succesfully!")
        ResetFilter();
    } else {
      toast.error("Fail to clear database!")
    }
  }

  function handDateChange(value) {
    setDateRange(value)
    const updateFilter = {
      ...refFilter.current,
      fromDate: value[0],
      toDate: value[1],
      start: 0,
    }

    setFilter(updateFilter)
  }
  function handleAttackChange(event) {
    let selectedAttack = event.target.value
    const updateFilter = {
      ...refFilter.current,
      attack: selectedAttack === "ALL" ? "" : selectedAttack,
      start: 0,
    }
    setAttack(selectedAttack)
    setFilter(updateFilter)
  }
  function ResetFilter() {
    setFilter({
      fromDate: null,
      toDate: null,
      attack: "",
      start:0,
      perPage: 30,
    })
    setDateRange([null, null])
    setAttack("")
  }

  function filterChanged(filter) {
    return (
      filter.fromDate === null && filter.toDate === null && filter.attack === ""
    )
  }

  function DeleteRecordHandler(id) {
    console.log(id);
    setId(id)
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
                 <MenuItem value={"ALL"}>ALL</MenuItem>
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
            <Table  >
              <Thead>
                <Tr>
                  <Th>Source ip</Th>
                  <Th>Destination ip</Th>
                  <Th>Destination port</Th>
                  <Th>Attack</Th>
                  <Th>Time</Th>
                  <Th></Th>
                </Tr>
              </Thead>
             { !loading &&  <Tbody>
                {Records.map((record, index) => {

                  if (Records.length === index + 1 && Records.length >= 30) {
                    return (
                      <Tr ref={lastRecordElementRef} key={record.id}>
                        <Td> {record.sourceIp}</Td>
                        <Td>{record.destinationIp}</Td>
                        <Td>{record.destinationPort}</Td>
                        <Td>{record.label}</Td>
                        <Td>
                          {moment(record.createdAt).format("yyyy DD MM: HH:mm")}
                        </Td>
                        <Td  onClick={() => DeleteRecordHandler(record.id)}>
                          <i
                             
                            className="fas fa-trash-alt cursor"
                          ></i>
                        </Td>
                      </Tr>
                    )
                  } else {
                    return (
                      <Tr key={record.id}>
                        <Td>{record.sourceIp}</Td>
                        <Td>{record.destinationIp}</Td>
                        <Td>{record.destinationPort}</Td>
                        <Td>{record.label}</Td>
                        <Td>
                          {moment(record.createdAt).format("yyyy DD MM: HH:mm")}
                        </Td>
                        <Td  onClick={() => DeleteRecordHandler(record.id)}>
                          <i
                            
                            className="fas fa-trash-alt cursor"
                          ></i>
                        </Td>
                      </Tr>
                    )
                  }
                })}
              </Tbody>}
            </Table>
            {loading && !error &&  (
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

            {error && (
              <div className="empty_data_message">No Data!</div>
            )}
          </div>
        </div>
      </ThemeProvider>
    </div>
  )
}

export default HistoryPage

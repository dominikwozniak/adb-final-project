import {useEffect, useMemo, useState} from 'react'
import {Box, FormControl, InputLabel, MenuItem, Paper, Select, TextField, TableCell, TableContainer, TableHead, TableRow, TableBody, TablePagination, TableSortLabel} from "@material-ui/core";
import styles from '../styles/Home.module.css'
import {useLazyQuery} from "@apollo/client";
import {GET_WEATHER} from "../apollo/queries/getWeather";
import createTableRowData from "../utils/createTableRowData";
import { DateTimePicker} from "@mui/x-date-pickers";
import Table from '../table'
import styled from "styled-components";

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }

  .pagination {
    padding: 0.5rem;
  }
`


function descendingComparator(a, b, orderBy) {
    if (orderBy === 'date') {
        if (new Date(b[orderBy]).getTime() < new Date(a[orderBy]).getTime()) {
            return -1
        }
        if (new Date(b[orderBy]).getTime() > new Date(a[orderBy]).getTime()) {
            return 1
        }
    }

    if (b[orderBy] < a[orderBy]) {
        return -1
    }
    if (b[orderBy] > a[orderBy]) {
        return 1
    }
    return 0
}

// TODO: fix sorting by temperature
// maybe it's an issue with float sorting

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const conditionOptions = ['ALL', 'Mostly sunny', 'Partly sunny', 'Light rain', 'Cloudy', 'Partly cloudy', 'Rain', 'Mostly clear', 'Sunny', 'Light rain', 'Clear', 'Mostly cloudy']

export default function Home() {
    const [rows, setRows] = useState([])
    const [loaded, setLoaded] = useState(false)
    const [city, setCity] = useState('Krakow')
    const [before, setBefore] = useState(new Date())
    const [after, setAfter] = useState(new Date())
    const [tempAvg, setTempAvg] = useState(null)
    const [tempMin, setTempMin] = useState(null)
    const [tempMax, setTempMax] = useState(null)
    const columns = useMemo(
        () => [
            {
                Header: 'Info',
                columns: [
                    {
                        Header: 'city',
                        accessor: 'city',
                    },
                    {
                        Header: 'tempAvg',
                        accessor: 'tempAvg',
                    },
                    {
                        Header: 'tempMin',
                        accessor: 'tempMin',
                    },
                    {
                        Header: 'tempMax',
                        accessor: 'tempMax',
                    },
                    {
                        Header: 'Description',
                        accessor: 'description',
                    },
                    {
                        Header: 'Date',
                        accessor: 'date',
                    },
                ],
            },
        ],
        []
    )


    const [loadWeather, { loading, data }] = useLazyQuery(GET_WEATHER)

    useEffect(() => {
        loadWeather({
            variables: {
                city,
                tempAvg: tempAvg ? parseFloat(tempAvg) : null,
                tempMin: tempMin ? parseFloat(tempMin) : null,
                tempMax: tempMax ? parseFloat(tempMax) : null,
                before: before.toISOString(),
                after: after.toISOString(),
            }
        })
    }, [setTempAvg, setTempMin, setTempMax, setAfter, setBefore, setCity ,tempAvg, tempMax, tempMin, city, after, before])

    useEffect(() => {
        if (data?.getWeatherFiltered && !loading) {
            setRows(data.getWeatherFiltered)
            setLoaded(true)
        }
    }, [data, loading])

    const handleCityChange = (e) => {
        setCity(e.target.value)
    }

    const handleDateBeforeChange = (newValue) => {
        setBefore(newValue)
    }

    const handleDateAfterChange = (newValue) => {
        setAfter(newValue)
    }


    return (
    <div className={styles.container}>
      <main className={styles.main}>
          <div className={styles.form}>
              <FormControl>
                  <InputLabel id="city-label">City</InputLabel>
                  <Select
                    labelId="city-label"
                    id="city-select"
                    value={city}
                    label="city"
                    onChange={handleCityChange}
                    disabled={loading}
                  >
                      <MenuItem value={'Krakow'}>Krakow</MenuItem>
                      <MenuItem value={'Wroclaw'}>Wroclaw</MenuItem>
                      <MenuItem value={'Warszawa'}>Warszawa</MenuItem>
                  </Select>
              </FormControl>
              <FormControl>
                  <TextField
                    id="tempAvg"
                    label="temp Avg"
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    variant="filled"
                    value={tempAvg}
                    onChange={(e) => setTempAvg(e.target.value)}
                  />
              </FormControl>
              <FormControl>
                  <TextField
                    id="tempMin"
                    label="temp Min"
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    variant="filled"
                    value={tempMin}
                    onChange={(e) => setTempMin(e.target.value)}
                  />
              </FormControl>
              <FormControl>
                  <TextField
                    id="tempMax"
                    label="temp Max"
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    variant="filled"
                    value={tempMax}
                    onChange={(e) => setTempMax(e.target.value)}
                  />
              </FormControl>
              <DateTimePicker
                label="Date after"
                value={after}
                onChange={handleDateAfterChange}
                renderInput={(params) => <TextField {...params} />}
              />
              <DateTimePicker
                label="Date before"
                value={before}
                onChange={handleDateBeforeChange}
                renderInput={(params) => <TextField {...params} />}
              />
          </div>
        <Styles>
            {loaded && rows.length > 0 && <Table data={rows} columns={columns} />}
        </Styles>
      </main>
    </div>
  )
}

import {useEffect, useState} from 'react'
import {Box, FormControl, InputLabel, MenuItem, Paper, Select, TextField, TableCell, TableContainer, Table, TableHead, TableRow, TableBody, TablePagination, TableSortLabel} from "@material-ui/core";
import styles from '../styles/Home.module.css'
import {useLazyQuery} from "@apollo/client";
import {GET_WEATHER} from "../apollo/queries/getWeather";
import createTableRowData from "../utils/createTableRowData";
import { DateTimePicker} from "@mui/x-date-pickers";

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
    const [city, setCity] = useState('Krakow')
    const [condition, setCondition] = useState('ALL')
    const [before, setBefore] = useState(new Date())
    const [after, setAfter] = useState(new Date())
    const [temperature, setTemperature] = useState(null)

    const [loaded, setLoaded] = useState(false)
    const [rows, setRows] = useState([])
    const [page, setPage] = useState(0)
    const [orderBy, setOrderBy] = useState('date')
    const [order, setOrder] = useState('asc')
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

    const [loadWeather, { loading, data }] = useLazyQuery(
        GET_WEATHER,
        {
            variables: {
                city,
                condition: condition === 'ALL' ? '' : condition,
                temperature: temperature ? parseFloat(temperature) : null,
                before: before.toISOString(),
                after: after.toISOString(),
            }
        }
    )

    useEffect(() => {
        loadWeather()
    }, [city, condition, temperature, before, after])

    useEffect(() => {
        if (data?.getWeatherFiltered) {
            setRows(createTableRowData(data.getWeatherFiltered))
            setLoaded(true)
        }
    }, [data])

    const handleDateSort = (e) => {
        setOrder(prevState => prevState === 'asc' ? 'desc' : 'asc')
        setOrderBy('date')
    }

    const handleTemperatureSort = (e) => {
        setOrder(prevState => prevState === 'asc' ? 'desc' : 'asc')
        setOrderBy('temperature')
    }

    const handleCityChange = (e) => {
        setCity(e.target.value)
    }

    const handleConditionChange = (e) => {
        setCondition(e.target.value)
    }

    const handleTemperatureChange = (e) => {
        setTemperature(e.target.value)
    }

    const handleDateBeforeChange = (newValue) => {
        setBefore(newValue)
    }

    const handleDateAfterChange = (newValue) => {
        setAfter(newValue)
    }

    const handleChangePage = (e, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10))
        setPage(0)
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
                      <MenuItem value={'Gdansk'}>Gdansk</MenuItem>
                  </Select>
              </FormControl>
              <FormControl>
                  <InputLabel id="condition-label">Condition</InputLabel>
                  <Select
                      labelId="condition-label"
                      id="condition-select"
                      value={condition}
                      label="condition"
                      onChange={handleConditionChange}
                      disabled={loading}
                  >
                      {conditionOptions.map((c, i) => (
                          <MenuItem key={i} value={c}>{c}</MenuItem>
                      ))}
                  </Select>
              </FormControl>
              <FormControl>
                  <TextField
                      id="temperature"
                      label="temperature"
                      type="number"
                      InputLabelProps={{
                          shrink: true,
                      }}
                      variant="filled"
                      value={temperature}
                      onChange={handleTemperatureChange}
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

          <TableContainer component={Paper}>
              <Table aria-label="simple table">
                  <TableHead>
                      <TableRow>
                          <TableCell>City</TableCell>
                          <TableCell align="right">
                              <TableSortLabel
                                  active={orderBy === 'temperature'}
                                  direction={orderBy === 'temperature' ? order : 'asc'}
                                  onClick={handleTemperatureSort}
                              >
                                    Temperature Avg
                              </TableSortLabel>
                          </TableCell>
                          <TableCell align="right">Description</TableCell>
                          <TableCell align="right">
                              <TableSortLabel
                                  active={orderBy === 'date'}
                                  direction={orderBy === 'date' ? order : 'asc'}
                                  onClick={handleDateSort}
                              >
                                  Date
                              </TableSortLabel>
                          </TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {loaded && rows.length && stableSort(rows, getComparator(order, 'date')).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                          <TableRow
                              key={row.id}
                              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                              <TableCell component="th" scope="row">
                                  {row.city}
                              </TableCell>
                              <TableCell align="right">{row.temperature}</TableCell>
                              <TableCell align="right">{row.description}</TableCell>
                              <TableCell align="right">{row.date}</TableCell>
                          </TableRow>
                      ))}
                      {emptyRows > 0 && (
                          <TableRow
                              style={{
                                  height: 53 * emptyRows,
                              }}
                          >
                              <TableCell colSpan={6} />
                          </TableRow>
                      )}
                  </TableBody>
              </Table>
          </TableContainer>
          <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
          />

      </main>
    </div>
  )
}

require('dotenv').config()
const axios = require('axios')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const dataKrk = require('./data.json')
const cityByIndex = (index) => {
    if (index === 1) {
        return 'Warszawa'
    }
    if (index === 2) {
        return 'Wroclaw'
    }
    if (index === 3) {
        return 'Gdansk'
    }
    return 'Krakow'
}

const bootstrap = async () => {
    // const resKrk = axios.get(`${process.env.ACCU_WEATHER_BASE_URL}/${process.env.ACCU_WEATHER_KRAKOW_KEY}/historical/24?apikey=${process.env.ACCU_WEATHER_ACCESS_KEY}`)
    // const resWrc = axios.get(`${process.env.ACCU_WEATHER_BASE_URL}/${process.env.ACCU_WEATHER_WROCLAW_KEY}/historical/24?apikey=${process.env.ACCU_WEATHER_ACCESS_KEY}`)
    // const resWwa = axios.get(`${process.env.ACCU_WEATHER_BASE_URL}/${process.env.ACCU_WEATHER_WARSZAWA_KEY}/historical/24?apikey=${process.env.ACCU_WEATHER_ACCESS_KEY}`)
    // const resGda = axios.get(`${process.env.ACCU_WEATHER_BASE_URL}/${process.env.ACCU_WEATHER_GDANSK_KEY}/historical/24?apikey=${process.env.ACCU_WEATHER_ACCESS_KEY}`)
    //
    // const res = await Promise.all([resKrk, resWrc, resWwa, resGda])
    // const data = []
    //
    // res.forEach((response, index) => {
    //     const formattedRes = response.data.map(r => {
    //         return {
    //             city: cityByIndex(index),
    //             temperature: r.Temperature.Metric.Value,
    //             timestamp: r.EpochTime,
    //             date: r.LocalObservationDateTime,
    //             description: r.WeatherText
    //         }
    //     })
    //     data.push(formattedRes)
    // })
    // await prisma.forecast.createMany({
    //     data: data.flat(),
    //     skipDuplicates: true,
    // })

    const resKrk = axios.get(process.env.WEATHER_API_DATA_KRAKOW)
    const resWrc = axios.get(process.env.WEATHER_API_DATA_WARSZAWA)
    const resWwa = axios.get(process.env.WEATHER_API_DATA_WROCLAW)

    const res = await Promise.all([resKrk, resWrc, resWwa])
    const data = []

    res.forEach((response, index) => {
        const formattedRes = response.data.days.map(d => {
            return {
                city: cityByIndex(index),
                tempAvg: d.temp,
                tempMin: d.tempmin,
                tempMax: d.tempmax,
                date: d.datetime,
                timestamp: d.datetimeEpoch,
                description: d.description,
            }
        })
        data.push(formattedRes)
    })

    await prisma.observation.createMany({
        data: data.flat(),
        skipDuplicates: true,
    })
}

bootstrap()
    .catch(e => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

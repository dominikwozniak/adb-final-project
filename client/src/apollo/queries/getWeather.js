import { gql } from '@apollo/client'

export const GET_WEATHER = gql`
    query GetWeatherByCity($city: String, $condition: String, $temperature: Float, $before: String, $after: String) {
        getWeatherFiltered(city: $city, condition: $condition, temperature: $temperature, before: $before, after: $after) {
            id
            city
            tempAvg
            tempMin
            tempMax
            date
            description
        }
    }
`

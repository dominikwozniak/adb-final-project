export default function (data = []) {
    return data.length ? data.map(row => {
        return {
            id: row.id,
            city: row.city,
            temperature: row.temperature,
            description: row.description,
            date: row.date
        }
    }) : []
}
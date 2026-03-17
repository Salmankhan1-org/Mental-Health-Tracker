exports.GetDateFromDay = (dayOfWeek) => {

    const days = {
        Sunday:0,
        Monday:1,
        Tuesday:2,
        Wednesday:3,
        Thursday:4,
        Friday:5,
        Saturday:6
    }

    const today = new Date()
    const todayDay = today.getDay()

    const targetDay = days[dayOfWeek]

    let diff = targetDay - todayDay

    if(diff < 0) diff += 7

    const date = new Date(today)
    date.setDate(today.getDate() + diff)
    date.setHours(0,0,0,0)

    return date
}
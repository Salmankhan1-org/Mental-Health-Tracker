exports.TimeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

exports.MinutesToTime = (minutes) => {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60

  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`
}
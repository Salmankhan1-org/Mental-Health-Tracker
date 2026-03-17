const { TimeToMinutes } = require("../../utils/Counsellors/calculate.minutes.from.midnight")

exports.ValidateTimeRanges = (ranges) => {

  const sorted = ranges
    .map(r => ({
      start: TimeToMinutes(r.startTime),
      end: TimeToMinutes(r.endTime),
      duration: Number(r.duration)
    }))
    .sort((a,b) => a.start - b.start)

  for(let i=0;i<sorted.length;i++){

    const range = sorted[i]

    if(range.start >= range.end){
      throw new Error("Invalid time range: start must be before end")
    }

    if(range.duration <= 0){
      throw new Error("Duration must be greater than 0")
    }

    if(i > 0){
      const prev = sorted[i-1]

      if(range.start < prev.end){
        throw new Error("Time ranges overlap")
      }
    }

  }

  return sorted
}
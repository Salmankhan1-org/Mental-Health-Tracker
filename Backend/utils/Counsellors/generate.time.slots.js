const { ValidateTimeRanges } = require("../../validators/Counsellor/validate.ranges")
const { MinutesToTime } = require("./calculate.minutes.from.midnight")

exports.GenerateTimeSlots = (ranges) => {

  const validatedRanges = ValidateTimeRanges(ranges)

  const slotSet = new Set()
  const slots = []

  for(const range of validatedRanges){

    let current = range.start

    while(current + range.duration <= range.end){

      const startTime = MinutesToTime(current)
      const endTime = MinutesToTime(current + range.duration)

      const key = `${startTime}-${endTime}`

      if(!slotSet.has(key)){

        slots.push({
          startTime,
          endTime,
          isBooked:false
        })

        slotSet.add(key)

      }

      current += range.duration

    }

  }

  return slots
}
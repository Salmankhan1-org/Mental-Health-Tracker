export const getDurationInMinutes = (start?: string, end?: string) => {
  if (!start || !end) return 0;

  const parseToMinutes = (timeStr: string) => {
    // 1. Clean the string and split into parts
    const [time, modifier] = timeStr.split(' '); // Splits "10:30" and "AM"
    let [hours, minutes] = time.split(':').map(Number);

    // 2. Handle 12-hour format (AM/PM) if present
    if (modifier) {
      if (modifier.toUpperCase() === 'PM' && hours < 12) hours += 12;
      if (modifier.toUpperCase() === 'AM' && hours === 12) hours = 0;
    }

    return hours * 60 + minutes;
  };

  try {
    const startMins = parseToMinutes(start);
    const endMins = parseToMinutes(end);
    
    // Handle overnight sessions (if end time is technically next day)
    const diff = endMins - startMins;
    return diff < 0 ? diff + 1440 : diff; 
  } catch (e) {
    return 0;
  }
};
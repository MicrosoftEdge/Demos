export function convertEpochToDateTime(epoch) {
  if (!epoch) {
    return '';
  }
  const obj = new Date(epoch);
  const newEpoch = epoch - (obj.getTimezoneOffset() * 60 * 1000);
  const isoString = new Date(newEpoch).toISOString();
  return isoString.substring(0, isoString.indexOf("T") + 6);
}

export function convertDateTimeToEpoch(dateTime) {
  if (!dateTime) {
    return 0;
  }
  return new Date(dateTime).getTime();
}
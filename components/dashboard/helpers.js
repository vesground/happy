export function mapEmotionsIds(emotion) {
  return emotion.id;
}

export function insertUpdatedRecord(data, updated) {
  const newData = { ...data };

  // const dayStartAt = dayjs(updated.createdAt).startOf('day');
  const dayStartAt = dayjs.utc(updated.createdAt).utcOffset(0).startOf('day');

  if (newData[dayStartAt]) {
    const dayRecordIndex = newData[dayStartAt].findIndex((record) => record.id === updated.id);
    newData[dayStartAt][dayRecordIndex] = updated;
  } else {
    alert(`Record with ${dayStartAt} date not found`);
  }

  return newData;
}

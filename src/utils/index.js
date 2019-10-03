function startTimeLog(reportId) {
  const label = `\x1b[32m pdf (${reportId}) is generated!`;
  console.time(label);
  return function() {
    console.timeEnd(label);
  };
}

module.exports = {
  startTimeLog
};

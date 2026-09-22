export function createTempObjectId() {
  let hex = "";
  for (let i = 0; i < 24; i += 1) {
    hex += Math.floor(Math.random() * 16).toString(16);
  }
  return hex;
}

export default createTempObjectId;

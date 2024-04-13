import dayjs from "dayjs";
import bigIntSupport from "dayjs/plugin/bigIntSupport";
dayjs.extend(bigIntSupport);

export const blockTimestampToViewFormatter = (blockTimestamp) => {
  const timestamp = blockTimestamp * 1000n;

  const formattedDate = dayjs(timestamp).format("MM/DD/YYYY, h:mm:ss A");

  return formattedDate;
};

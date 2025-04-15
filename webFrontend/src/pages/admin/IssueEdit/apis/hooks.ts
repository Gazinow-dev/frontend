import { useQuery } from "@tanstack/react-query";
import { getStationsByLine } from "./func";
import { RawSubwayLineName } from "@global/apis/entity";

export const useGetStationsByLine = (line: RawSubwayLineName) => {
  const { data } = useQuery({
    queryKey: ["getStationsByLine", line],
    queryFn: () => getStationsByLine({ line }),
  });
  return { stationsByLinedata: data };
};

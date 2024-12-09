import { View } from 'react-native';
import PathBar from './PathBar';
import PathLineNumName from './PathLineNumName';
import { useId, useMemo } from 'react';
import { SubPath } from '@/global/apis/entity';
import React from 'react';

interface SubwaySimplePathProps {
  pathData: SubPath[];
  arriveStationName: string;
  betweenPathMargin: number;
  isHideIsuue?: boolean;
}

const SubwaySimplePath = ({
  pathData,
  arriveStationName,
  betweenPathMargin,
  isHideIsuue = false,
}: SubwaySimplePathProps) => {
  const freshLanesPathData = useMemo(() => {
    return pathData.filter((item) => !!item.stations.length);
  }, [pathData]);
  const maxLength = freshLanesPathData.length;

  const renderStationName = freshLanesPathData.reduce((acc, cur, idx) => {
    const arr = cur.stations
      .filter((_, idx) => idx === cur.stations.length - 1 || !idx)
      .map((item) => item.stationName);
    if (idx === freshLanesPathData.length - 1) return [...acc, ...arr];
    return [...acc, ...arr.slice(0, 1), ...arr.slice(2)];
  }, [] as string[]);

  const isOverNameLength = useMemo(() => {
    if (maxLength > 3) {
      return renderStationName.slice(-4).some((item) => item.length > 5);
    }
    return renderStationName.some((item) => item.length > 5);
  }, [freshLanesPathData]);

  const isBottomPathsDirect = useMemo(() => {
    switch (maxLength) {
      case 5:
        return freshLanesPathData.slice(-3).some((item) => !!item.direct);
      case 4:
        return freshLanesPathData.slice(-2).some((item) => !!item.direct);
      default:
        return freshLanesPathData.some((item) => !!item.direct);
    }
  }, [freshLanesPathData]);

  return (
    <View style={{ marginBottom: isOverNameLength || isBottomPathsDirect ? 32 : 16, marginTop: 16 }}>
      <View
        style={{
          flexDirection: 'row',
          marginBottom: maxLength > 3 ? betweenPathMargin : null,
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        <View
          style={{
            position: 'absolute',
            justifyContent: 'space-between',
            flexDirection: 'row',
            width: '100%',
          }}
        >
          {/* 지하철 경로 라인, 환승역 3개 이하 */}
          {freshLanesPathData.map(({ way, name, stationCode, issueSummary }, idx) => {
            if (maxLength > 3 && idx <= 1) {
              return (
                <React.Fragment key={name + 'a' + way + idx}>
                  <PathBar
                    stationCode={stationCode}
                    isLast={idx === 1}
                    isFirst={idx === 0}
                    issues={issueSummary}
                    isHideIsuue={isHideIsuue}
                  />
                </React.Fragment>
              );
            }
            if (maxLength <= 3) {
              return (
                <React.Fragment key={name + 'b' + way + idx}>
                  <PathBar
                    stationCode={stationCode}
                    isLast={maxLength - 1 === idx}
                    isFirst={idx === 0}
                    issues={issueSummary}
                    isHideIsuue={isHideIsuue}
                  />
                </React.Fragment>
              );
            }
            return <></>;
          })}
        </View>
        {/* 지하철 호선 및 이름, 환승역 3개 이하 */}
        {freshLanesPathData.map(({ way, name, stationCode, direct, stations }, idx) => {
          if (maxLength > 3 && idx <= 2) {
            return (
              <React.Fragment key={stations[0].stationName + name + 'c' + way + idx}>
                {idx < 2 && (
                  <PathLineNumName
                    stationCode={stationCode}
                    direct={direct}
                    stationName={stations[0].stationName}
                  />
                )}
                {idx === 1 && (
                  <PathLineNumName
                    stationCode={stationCode}
                    direct={direct}
                    stationName={stations[stations.length - 1].stationName}
                  />
                )}
              </React.Fragment>
            );
          }
          if (maxLength <= 3) {
            return (
              <React.Fragment key={stations[0].stationName + name + 'd' + way + idx}>
                <PathLineNumName
                  stationCode={stationCode}
                  direct={direct}
                  stationName={stations[0].stationName}
                />
                {maxLength - 1 === idx && (
                  <PathLineNumName
                    stationCode={stationCode}
                    direct={direct}
                    stationName={arriveStationName}
                  />
                )}
              </React.Fragment>
            );
          }
          return <></>;
        })}
      </View>

      {/* 환승역이 3개 이상일 때 렌더링 */}
      {maxLength > 3 && (
        <View
          style={{
            marginRight: maxLength === 3 ? 0 : 18,
            position: 'relative',
            width: maxLength === 3 ? '50%' : '100%',
          }}
        >
          {/* 지하철 경로 라인 */}
          <View
            style={{
              position: 'absolute',
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}
          >
            {freshLanesPathData.map(({ way, name, stationCode, issueSummary }, idx) => {
              return (
                <React.Fragment key={name + 'e' + way + idx}>
                  {idx >= 2 && (
                    <PathBar
                      stationCode={stationCode}
                      isFirst={idx === 2}
                      isLast={maxLength === 3 ? false : maxLength - 1 === idx}
                      issues={issueSummary}
                      isHideIsuue={isHideIsuue}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </View>

          {/* 지하철 호선 및 이름 */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            {freshLanesPathData.map(({ way, name, stationCode, direct, stations }, idx) => {
              const key = useId();
              if (idx >= 2) {
                return (
                  <React.Fragment key={stations[0].stationName + name + 'f' + way + idx}>
                    <PathLineNumName
                      stationCode={stationCode}
                      direct={direct}
                      stationName={stations[0].stationName}
                    />
                    {maxLength - 1 === idx && (
                      <PathLineNumName
                        stationCode={stationCode}
                        direct={direct}
                        stationName={arriveStationName}
                      />
                    )}
                  </React.Fragment>
                );
              }
            })}
          </View>
        </View>
      )}
    </View>
  );
};

export default SubwaySimplePath;

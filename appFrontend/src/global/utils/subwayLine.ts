import { COLOR } from '@/global/constants';
import {
  DisplayLineName,
  LineCapsules,
  LineCode,
  OriginLineName,
  SearchStationNameTypes,
} from '../apis/entity';

/**
 * @param originLineName[]
 * @returns displayLineName[]
 */
export const originToDisplay = (
  stations: SearchStationNameTypes['data'],
): { stationName: string; stationLine: DisplayLineName | null }[] => {
  return stations.map(({ name, line }) => {
    switch (line) {
      case '수도권 김포골드라인':
        return { stationName: name, stationLine: '김포골드' };
      case '수도권 서해선(대곡-원시)':
        return { stationName: name, stationLine: '서해선' };
      case '수도권 수인.분당선':
        return { stationName: name, stationLine: '수인분당' };
      case '수도권 신분당선':
        return { stationName: name, stationLine: '신분당' };
      case '수도권 우이신설경전철':
        return { stationName: name, stationLine: '우이신설' };
      case '수도권 의정부경전철':
        return { stationName: name, stationLine: '의정부' };
      case '경의중앙선':
        return { stationName: name, stationLine: '경의중앙' };
      default:
        return {
          stationName: name,
          stationLine: !!line
            ? (line.replace('수도권 ', '').replace('인천 ', '인천') as DisplayLineName)
            : null,
        };
    }
  });
};

/**
 * @param displayLineName
 * @returns originLineName
 */
export const displayToOrigin = (displayLine: DisplayLineName): OriginLineName => {
  switch (displayLine) {
    case '김포골드':
      return '수도권 김포골드라인';
    case '서해선':
      return '수도권 서해선(대곡-원시)';
    case '수인분당':
      return '수도권 수인.분당선';
    case '신분당':
      return '수도권 신분당선';
    case '우이신설':
      return '수도권 우이신설경전철';
    case '의정부':
      return '수도권 의정부경전철';
    case '인천1호선':
      return '인천 1호선';
    case '인천2호선':
      return '인천 2호선';
    case '경의중앙':
      return '경의중앙선';
    default:
      return `수도권 ${displayLine}`;
  }
};

/**
 * @param origin 오디세이 기준 지하철 호선명
 * @returns lineCircle N호선 아이콘에 쓰이는 줄바꿈 적용된 이름
 */
export const originToLineCircle = (origin: OriginLineName): string => {
  switch (origin) {
    case '수도권 1호선':
      return '1';
    case '수도권 2호선':
      return '2';
    case '수도권 3호선':
      return '3';
    case '수도권 4호선':
      return '4';
    case '수도권 5호선':
      return '5';
    case '수도권 6호선':
      return '6';
    case '수도권 7호선':
      return '7';
    case '수도권 8호선':
      return '8';
    case '수도권 9호선':
      return '9';
    case '인천 1호선':
      return '인천1';
    case '인천 2호선':
      return '인천2';
    case '수도권 공항철도':
      return `공항\n철도`;
    case '경의중앙선':
      return '경의';
    case '수도권 에버라인':
      return `에버\n라인`;
    case '수도권 경춘선':
      return '경춘';
    case '수도권 신분당선':
      return '신분당';
    case '수도권 의정부경전철':
      return '의정부';
    case '수도권 경강선':
      return '경강';
    case '수도권 우이신설경전철':
      return '우이\n신설';
    case '수도권 서해선(대곡-원시)':
      return '서해';
    case '수도권 김포골드라인':
      return '김포\n골드';
    case '수도권 수인.분당선':
      return '수인\n분당';
    case '수도권 신림선':
      return '신림';
    default:
      return '1';
  }
};

/**
 * @param origin 오디세이 기준 지하철 호선명
 * @returns lineCircle N호선 아이콘에 쓰이는 줄바꿈 적용된 이름
 */
export const displayToLineCircle = (origin: DisplayLineName): string => {
  switch (origin) {
    case '1호선':
      return '1';
    case '2호선':
      return '2';
    case '3호선':
      return '3';
    case '4호선':
      return '4';
    case '5호선':
      return '5';
    case '6호선':
      return '6';
    case '7호선':
      return '7';
    case '8호선':
      return '8';
    case '9호선':
      return '9';
    case '인천1호선':
      return '인천1';
    case '인천2호선':
      return '인천2';
    case '공항철도':
      return `공항\n철도`;
    case '경의중앙':
      return '경의';
    case '에버라인':
      return `에버\n라인`;
    case '경춘선':
      return '경춘';
    case '신분당':
      return '신분당';
    case '의정부':
      return '의정부';
    case '경강선':
      return '경강';
    case '우이신설':
      return '우이\n신설';
    case '서해선':
      return '서해';
    case '김포골드':
      return '김포\n골드';
    case '수인분당':
      return '수인\n분당';
    case '신림선':
      return '신림';
    default:
      return '1';
  }
};

/**
 * @param origin 오디세이 기준 지하철 호선명
 * @returns lineCapsule 가로스크롤되는 N호선 캡슐명
 */
export const originToLineCapsule = (origin: OriginLineName): LineCapsules => {
  switch (origin) {
    case '수도권 1호선':
      return '1호선';
    case '수도권 2호선':
      return '2호선';
    case '수도권 3호선':
      return '3호선';
    case '수도권 4호선':
      return '4호선';
    case '수도권 5호선':
      return '5호선';
    case '수도권 6호선':
      return '6호선';
    case '수도권 7호선':
      return '7호선';
    case '수도권 8호선':
      return '8호선';
    case '수도권 9호선':
      return '9호선';
    case '인천 1호선':
      return '인천1';
    case '인천 2호선':
      return '인천2';
    case '수도권 공항철도':
      return '공항철도';
    case '경의중앙선':
      return '경의중앙';
    case '수도권 에버라인':
      return '에버라인';
    case '수도권 경춘선':
      return '경춘';
    case '수도권 신분당선':
      return '신분당';
    case '수도권 수인.분당선':
      return '수인분당';
    case '수도권 의정부경전철':
      return '의정부';
    case '수도권 경강선':
      return '경강';
    case '수도권 우이신설경전철':
      return '우이신설';
    case '수도권 서해선(대곡-원시)':
      return '서해';
    case '수도권 김포골드라인':
      return '김포골드';
    case '수도권 신림선':
      return '신림';
    default:
      return '1호선';
  }
};

/**
 * @param lineCapsule 가로스크롤되는 N호선 캡슐명
 * @returns OriginLineName
 */
export const lineCapsuleToOrigin = (lineCapsule: LineCapsules): OriginLineName | '전체' => {
  switch (lineCapsule) {
    case '1호선':
      return '수도권 1호선';
    case '2호선':
      return '수도권 2호선';
    case '3호선':
      return '수도권 3호선';
    case '4호선':
      return '수도권 4호선';
    case '5호선':
      return '수도권 5호선';
    case '6호선':
      return '수도권 6호선';
    case '7호선':
      return '수도권 7호선';
    case '8호선':
      return '수도권 8호선';
    case '9호선':
      return '수도권 9호선';
    case '인천1':
      return '인천 1호선';
    case '인천2':
      return '인천 2호선';
    case '공항철도':
      return '수도권 공항철도';
    case '경의중앙':
      return '경의중앙선';
    case '에버라인':
      return '수도권 에버라인';
    case '경춘':
      return '수도권 경춘선';
    case '신분당':
      return '수도권 신분당선';
    case '수인분당':
      return '수도권 수인.분당선';
    case '의정부':
      return '수도권 의정부경전철';
    case '경강':
      return '수도권 경강선';
    case '우이신설':
      return '수도권 우이신설경전철';
    case '서해':
      return '수도권 서해선(대곡-원시)';
    case '김포골드':
      return '수도권 김포골드라인';
    case '신림':
      return '수도권 신림선';
    case '전체':
      return '전체';
    default:
      return '수도권 1호선';
  }
};

/**
 * @param lineCapsule 가로스크롤되는 N호선 캡슐명
 * @returns 호선별 COLOR
 */
export const lineCapsuleToColor = (lineCapsule: LineCapsules | '전체'): string => {
  switch (lineCapsule) {
    case '전체':
      return COLOR.BASIC_BLACK;
    case '1호선':
      return COLOR.LINE1;
    case '2호선':
      return COLOR.LINE2;
    case '3호선':
      return COLOR.LINE3;
    case '4호선':
      return COLOR.LINE4;
    case '5호선':
      return COLOR.LINE5;
    case '6호선':
      return COLOR.LINE6;
    case '7호선':
      return COLOR.LINE7;
    case '8호선':
      return COLOR.LINE8;
    case '9호선':
      return COLOR.LINE9;
    case '인천1':
      return COLOR.LINEIO;
    case '인천2':
      return COLOR.LINEIT;
    case '공항철도':
      return COLOR.LINEGH;
    case '경의중앙':
      return COLOR.LINEKJ;
    case '에버라인':
      return COLOR.LINEEL;
    case '경춘':
      return COLOR.LINEKC;
    case '신분당':
      return COLOR.LINENBD;
    case '수인분당':
      return COLOR.LINESBD;
    case '의정부':
      return COLOR.LINEEGB;
    case '경강':
      return COLOR.LINEKK;
    case '우이신설':
      return COLOR.LINEUS;
    case '서해':
      return COLOR.LINESH;
    case '김포골드':
      return COLOR.LINEGG;
    case '신림':
      return COLOR.LINESL;
    default:
      return COLOR.BASIC_BLACK;
  }
};

/**
 * @param lineCode 지하철 코드
 * @returns 호선별 COLOR
 */
export const lineCodeToColor = (lineCode: LineCode): string => {
  switch (lineCode) {
    case 1:
      return COLOR.LINE1;
    case 2:
      return COLOR.LINE2;
    case 3:
      return COLOR.LINE3;
    case 4:
      return COLOR.LINE4;
    case 5:
      return COLOR.LINE5;
    case 6:
      return COLOR.LINE6;
    case 7:
      return COLOR.LINE7;
    case 8:
      return COLOR.LINE8;
    case 9:
      return COLOR.LINE9;
    case 21:
      return COLOR.LINEIO;
    case 22:
      return COLOR.LINEIT;
    case 101:
      return COLOR.LINEGH;
    case 104:
      return COLOR.LINEKJ;
    case 107:
      return COLOR.LINEEL;
    case 108:
      return COLOR.LINEKC;
    case 109:
      return COLOR.LINENBD;
    case 110:
      return COLOR.LINEEGB;
    case 112:
      return COLOR.LINEKK;
    case 113:
      return COLOR.LINEUS;
    case 114:
      return COLOR.LINESH;
    case 115:
      return COLOR.LINEGG;
    case 116:
      return COLOR.LINESBD;
    case 117:
      return COLOR.LINESL;
    default:
      return COLOR.BASIC_BLACK;
  }
};

/**
 * @param lineCode 지하철 코드
 * @returns lineCircle N호선 아이콘에 쓰이는 줄바꿈 적용된 이름
 */
export const lineCodeToLineCircle = (lineCode: LineCode): string => {
  switch (lineCode) {
    case 1:
      return '1';
    case 2:
      return '2';
    case 3:
      return '3';
    case 4:
      return '4';
    case 5:
      return '5';
    case 6:
      return '6';
    case 7:
      return '7';
    case 8:
      return '8';
    case 9:
      return '9';
    case 21:
      return '인천1';
    case 22:
      return '인천2';
    case 101:
      return `공항\n철도`;
    case 104:
      return '경의';
    case 107:
      return `에버\n라인`;
    case 108:
      return '경춘';
    case 109:
      return '신분당';
    case 110:
      return '의정부';
    case 112:
      return '경강';
    case 113:
      return `우이\n신설`;
    case 114:
      return '서해';
    case 115:
      return `김포\n골드`;
    case 116:
      return `수인\n분당`;
    case 117:
      return '신림';
    default:
      return '';
  }
};

/**
 * @param lineCode 지하철 코드
 * @returns lineCapsule 가로스크롤되는 N호선 캡슐 이름
 */
export const lineCodeToLineCapsule = (lineCode: LineCode): LineCapsules => {
  switch (lineCode) {
    case 1:
      return '1호선';
    case 2:
      return '2호선';
    case 3:
      return '3호선';
    case 4:
      return '4호선';
    case 5:
      return '5호선';
    case 6:
      return '6호선';
    case 7:
      return '7호선';
    case 8:
      return '8호선';
    case 9:
      return '9호선';
    case 21:
      return '인천1';
    case 22:
      return '인천2';
    case 101:
      return '공항철도';
    case 104:
      return '경의중앙';
    case 107:
      return '에버라인';
    case 108:
      return '경춘';
    case 109:
      return '신분당';
    case 110:
      return '의정부';
    case 112:
      return '경강';
    case 113:
      return '우이신설';
    case 114:
      return '서해';
    case 115:
      return '김포골드';
    case 116:
      return '수인분당';
    case 117:
      return '신림';
  }
};

/**
 * @param station 길이가 긴 지하철역 이름
 * @returns 줄바꿈된 지하철역 이름
 */
export const breakStationName = (station: string): string => {
  switch (station) {
    case '4.19민주묘지':
      return '4.19\n민주묘지';
    case '가산디지털단지':
      return '가산\n디지털단지';
    case '구로디지털단지':
      return '구로\n디지털단지';
    case '동대문역사문화공원':
      return '동대문역사\n문화공원';
    case '성신여대입구':
      return '성신여대\n입구';
    case '정부과천청사':
      return '정부과천\n청사';
    case '디지털미디어시티':
      return '디지털\n미디어시티';
    case '월드컵경기장':
      return '월드컵\n경기장';
    case '부천종합운동장':
      return '부천\n종합운동장';
    case '어린이대공원':
      return '어린이\n대공원';
    case '신대방삼거리':
      return '신대방\n삼거리';
    case '남한산성입구':
      return '남한산성\n입구';
    case '중앙보훈병원':
      return '중앙보훈\n병원';
    case '청라국제도시':
      return '청라\n국제도시';
    case '공항화물청사':
      return '공항화물\n청사';
    case '인천공항1터미널':
      return '인천공항\n1터미널';
    case '인천공항2터미널':
      return '인천공항\n2터미널';
    case '압구정로데오':
      return '압구정\n로데오';
    case '남동인더스파크':
      return '남동\n인더스파크';
    case '양재시민의숲':
      return '양재\n시민의숲';
    case '용인중앙시장':
      return '용인\n중앙시장';
    case '시청.용인대':
      return '시청.\n용인대';
    case '전대.에버랜드':
      return '전대.\n에버랜드';
    case '주안국가산단':
      return '주안\n국가산단';
    case '북한산보국문':
      return '북한산\n보국문';
    case '경기도청북부청사':
      return '경기도청\n북부청사';
    case '경전철의정부':
      return '경전철\n의정부';
    case '가정중앙시장':
      return '가정\n중앙시장';
    case '서부여성회관':
      return '서부\n여성회관';
    case '아시아드경기장':
      return '아시아드\n경기장';
    case '경인교대입구':
      return '경인교대\n입구';
    case '지식정보단지':
      return '지식정보\n단지';
    case '국제업무지구':
      return '국제\n업무지구';
    case '서울대벤처타운':
      return '서울대\n벤처타운';
    case '서울지방병무청':
      return '서울지방\n병무청';
    case '송도달빛축제공원':
      return '송도달빛\n축제공원';
    case '아시아드경기장':
      return '아시아드\n경기장';
    default:
      return station;
  }
};

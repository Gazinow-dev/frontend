import { SafeAreaView } from 'react-native-safe-area-context';
import { Shadow } from 'react-native-shadow-2';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { COLOR } from '@/global/constants';
import { FontText } from '@/global/ui';
import { useOnboardingNavigation } from '@/navigation/OnboardingNavigation';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { IconChevronRight3, IconIssueNaturalDisaster, IconLogoGAZISquare } from '@/assets/icons';
import { ImgOnboardingStep1, ImgOnboardingStep2Path } from '@/assets/images';

const OnboardingScreen = () => {
  const navigation = useRootNavigation();
  const onboardingNavigation = useOnboardingNavigation();
  const [page, setPage] = useState<1 | 2>(1);

  return (
    <SafeAreaView className="flex-1 items-center bg-[#33333366] px-16 pt-116">
      <View style={StyleSheet.absoluteFill}>
        <Svg height="100%" width="100%">
          <Defs>
            <LinearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0.0913" stopColor="#58555C" />
              <Stop offset="0.4327" stopColor="#4C494F" />
              <Stop offset="0.8269" stopColor="#232323" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#bg)" />
        </Svg>
      </View>

      <FontText
        text={
          page === 1
            ? `자주 가는 경로를\n미리 등록해두면`
            : `출근 전 미리 오는\n알림 하나로 지각 대비 완료`
        }
        className="text-center text-white mb-66 text-24"
        fontWeight="700"
      />

      <Shadow
        distance={30}
        offset={[0, 0]}
        startColor="#00000022"
        stretch
        paintInside={false}
        style={{ borderRadius: 16 }}
      >
        <View
          className="w-full rounded-16 border border-white/20 bg-[#333]/40 px-16 pb-27 pt-30"
          style={{ aspectRatio: 332 / 288 }}
        >
          {page === 1 ? (
            <>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center justify-between space-x-8">
                  <FontText
                    text="출근길"
                    className="text-white text-18 leading-23"
                    fontWeight="700"
                  />
                  <View className="px-6 py-4 rounded-16 bg-purple-54f">
                    <FontText
                      text="42분"
                      className="mr-4 text-12 leading-14 text-gray-999"
                      fontWeight="500"
                    />
                  </View>
                </View>
                <View className="flex-row items-center space-x-4">
                  <FontText text="세부정보" className="text-13 leading-19 text-gray-999" />
                  <IconChevronRight3 color={COLOR.GRAY_999} />
                </View>
              </View>

              <View className="w-full" style={{ aspectRatio: 293 / 69, marginVertical: 16 }}>
                <ImgOnboardingStep1 width="100%" height="100%" />
              </View>

              <View className="flex-row items-center justify-between rounded-full border-1 border-black/5 bg-[#2D2D2D] px-12 py-8">
                <View className="flex-row items-center space-x-10">
                  <IconIssueNaturalDisaster width={19} height={19} color={COLOR.LINE4} />
                  <FontText
                    text="폭우로 4호선 운행이 멈췄어요"
                    className="text-white text-13 leading-19"
                    fontWeight="600"
                  />
                </View>
                <IconChevronRight3 color={COLOR.GRAY_999} />
              </View>
            </>
          ) : (
            <>
              <View className="relative mt-13">
                <Image
                  source={require('@/assets/images/img-onboarding-2-Noti.png')}
                  style={{
                    width: '100%',
                    height: undefined,
                    aspectRatio: 302 / 78,
                  }}
                  resizeMode="contain"
                />
                <View className="absolute left-[4%] top-[15%] h-1/2 w-[13%]">
                  <IconLogoGAZISquare
                    width="100%"
                    height="100%"
                    preserveAspectRatio="xMidYMid meet"
                  />
                </View>
              </View>

              <View className="h-10" />

              <View style={{ aspectRatio: 234 / 55 }}>
                <ImgOnboardingStep2Path width="100%" height="100%" />
              </View>
            </>
          )}

          <View className="flex-1" />

          <View className="flex-row items-center justify-center space-x-8">
            <View
              className={`h-8 w-8 rounded-full ${page === 1 ? 'bg-[#D9D9D9]' : 'bg-[#D9D9D9]/30'}`}
            />
            <View
              className={`h-8 w-8 rounded-full ${page === 2 ? 'bg-[#D9D9D9]' : 'bg-[#D9D9D9]/30'}`}
            />
          </View>
        </View>
      </Shadow>

      <View className="flex-1" />

      {page === 1 ? (
        <TouchableOpacity
          onPress={() => setPage(2)}
          className="w-full p-10 mb-56 bg-white rounded-5"
        >
          <FontText text="다음" className="text-center text-17 leading-26" fontWeight="600" />
        </TouchableOpacity>
      ) : (
        <>
          <View className="w-full space-y-24 mb-35">
            <TouchableOpacity
              onPress={() => onboardingNavigation.push('OnboardingSwap')}
              className="w-full p-10 bg-white rounded-5"
            >
              <FontText
                text="경로 등록하기"
                className="text-center text-17 leading-26"
                fontWeight="600"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontText
                text="건너뛰고 바로 사용하기"
                className="text-center underline text-13 leading-18 text-gray-999"
                fontWeight="700"
              />
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default OnboardingScreen;

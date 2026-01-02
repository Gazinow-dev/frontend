import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useMyPageNavigation } from '@/navigation/MyPageNavigation';
import IconChevronLeft from '@assets/icons/icon_chevron-left.svg';
import { FontText } from '@/global/ui';
import { PERSONAL_TERMS_VER_1 } from '@/global/constants/terms';
import { SafeAreaView } from 'react-native-safe-area-context';
const table1 = (
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    <View className="border-b border-l border-gray-beb">
      {/* Header */}
      <View className="flex-row bg-gray-f2">
        <View className="px-8 py-6 w-180 border-gray-beb">
          <FontText text="서비스" className="text-14" fontWeight="700" />
        </View>
        <View className="px-8 py-6 w-180 border-gray-beb">
          <FontText text="수집 및 이용 목적" className="text-14" fontWeight="700" />
        </View>
        <View className="px-8 py-6 w-180 border-gray-beb">
          <FontText text="구분" className="text-14" fontWeight="700" />
        </View>
        <View className="px-8 py-6 w-180 border-gray-beb">
          <FontText text="수집 및 이용항목" className="text-14" fontWeight="700" />
        </View>
        <View className="px-8 py-6 border-r w-180 border-gray-beb">
          <FontText text="보유 및 이용기간" className="text-14" fontWeight="700" />
        </View>
      </View>

      {/* Row 1 */}
      <View className="flex-row">
        <View className="px-8 py-6 border-r w-180 border-gray-beb">
          <FontText text="회원가입" />
        </View>
        <View className="px-8 py-6 border-r w-180 border-gray-beb">
          <FontText text="서비스 이용을 위한 이용자 식별, 이용자 개별적 통지 및 고지" />
        </View>
        <View className="px-8 py-6 border-r w-180 border-gray-beb">
          <FontText text="필수" />
        </View>
        <View className="px-8 py-6 border-r w-180 border-gray-beb">
          <FontText text="메일 주소, 위치정보, 닉네임, 관심 교통수단 카테고리" />
        </View>
        <View className="px-8 py-6 border-r w-180 border-gray-beb">
          <FontText text="회원탈퇴 시까지" />
          <FontText text="※ 단, 관계 법령 위반에 따른 수사, 조사 등이 진행중인 경우에는 해당 수사, 조사 종료 시 까지 보관" />
        </View>
      </View>

      {/* Row 2 */}
      <View className="flex-row">
        <View className="px-8 py-6 border-r w-180 border-gray-beb">
          <FontText text="서비스 이용 시 생성되어 수집되는 정보" />
        </View>
        <View className="px-8 py-6 border-r w-180 border-gray-beb">
          <FontText text="이상행위 탐지, 부정이용 방지 및 서비스 개선을 위한 분석" />
        </View>
        <View className="px-8 py-6 border-r w-180 border-gray-beb">
          <FontText text="필수" />
        </View>
        <View className="px-8 py-6 border-r w-180 border-gray-beb">
          <FontText text="서비스 이용 기록, 검색 이력, IP주소, 기기 정보, 위치 정보" />
        </View>
      </View>

      {/* Row 3 */}
      <View className="flex-row">
        <View className="px-8 py-6 border-r w-180 border-gray-beb">
          <FontText text="고객 문의" />
        </View>
        <View className="px-8 py-6 border-r w-180 border-gray-beb">
          <FontText text="고객 요청사항 처리 및 처리결과에 대한 회신" />
        </View>
        <View className="px-8 py-6 border-r w-180 border-gray-beb">
          <FontText text="필수" />
        </View>
        <View className="px-8 py-6 border-r w-180 border-gray-beb">
          <FontText text="이메일, 상담내역" />
        </View>
      </View>
    </View>
  </ScrollView>
);

const table2 = (
  <View className="border-b border-l border-gray-beb">
    {/* Header */}
    <View className="flex-row bg-gray-f2">
      <View className="flex-1 px-8 py-6 border-r border-gray-beb">
        <FontText text="보존항목" className="text-14" fontWeight="700" />
      </View>
      <View className="flex-1 px-8 py-6 border-r border-gray-beb">
        <FontText text="보유 사유" className="text-14" fontWeight="700" />
      </View>
      <View className="w-1/5 px-8 py-6 border-r border-gray-beb">
        <FontText text="보유기간" className="text-14" fontWeight="700" />
      </View>
    </View>

    <View className="flex-row">
      <View className="flex-1 px-8 py-6 border-r border-gray-beb">
        <FontText text="부정이용기록" />
      </View>
      <View className="flex-1 px-8 py-6 border-r border-gray-beb">
        <FontText text="부정 이용 방지" />
      </View>
      <View className="w-1/5 px-8 py-6 border-r border-gray-beb">
        <FontText text="5년" />
      </View>
    </View>

    <View className="flex-row">
      <View className="flex-1 px-8 py-6 border-r border-gray-beb">
        <FontText text="게시글(스레드) 내용" />
      </View>
      <View className="flex-1 px-8 py-6 border-r border-gray-beb">
        <FontText text="분쟁 해결 및 사기 방지" />
      </View>
      <View className="w-1/5 px-8 py-6 border-r border-gray-beb">
        <FontText text="5년" />
      </View>
    </View>

    <View className="flex-row">
      <View className="flex-1 px-8 py-6 border-r border-gray-beb">
        <FontText text="기기식별값, CI, 게시글 내용" />
      </View>
      <View className="flex-1 px-8 py-6 border-r border-gray-beb">
        <FontText text="부정 이용 및 가입방지, 수사 요청시 협조" />
      </View>
      <View className="w-1/5 px-8 py-6 border-r border-gray-beb">
        <FontText text="1년" />
      </View>
    </View>
  </View>
);

const table3 = (
  <View className="border-b border-l border-gray-beb">
    {/* Header */}
    <View className="flex-row bg-gray-f2">
      <View className="flex-1 px-8 py-6 border-r border-gray-beb">
        <FontText text="보존항목" className="text-14" fontWeight="700" />
      </View>
      <View className="flex-1 px-8 py-6 border-r border-gray-beb">
        <FontText text="근거법령" className="text-14" fontWeight="700" />
      </View>
      <View className="w-1/5 px-8 py-6 border-r border-gray-beb">
        <FontText text="보유기간" className="text-14" fontWeight="700" />
      </View>
    </View>

    {/* Row 1 */}
    <View className="flex-row">
      <View className="flex-1 px-8 py-6 border-r border-gray-beb">
        <FontText text="계약 또는 청약철회 등에 관한 기록" />
      </View>
      <View className="flex-1 px-8 py-6 border-r border-gray-beb">
        <FontText text="전자상거래 등에서의 소비자보호에 관한 법률" />
      </View>
      <View className="w-1/5 px-8 py-6 border-r border-gray-beb">
        <FontText text="5년" />
      </View>
    </View>

    {/* Row 2 */}
    <View className="flex-row">
      <View className="flex-1 px-8 py-6 border-r border-gray-beb">
        <FontText text="대금결제 및 재화 등의 공급에 관한 기록" />
      </View>
      <View className="flex-1 px-8 py-6 border-r border-gray-beb">
        <FontText text="전자상거래 등에서의 소비자보호에 관한 법률" />
      </View>
      <View className="w-1/5 px-8 py-6 border-r border-gray-beb">
        <FontText text="5년" />
      </View>
    </View>

    {/* Row 3 */}
    <View className="flex-row">
      <View className="flex-1 px-8 py-6 border-r border-gray-beb">
        <FontText text="소비자의 불만 또는 분쟁처리 기록" />
      </View>
      <View className="flex-1 px-8 py-6 border-r border-gray-beb">
        <FontText text="전자상거래 등에서의 소비자보호에 관한 법률" />
      </View>
      <View className="w-1/5 px-8 py-6 border-r border-gray-beb">
        <FontText text="3년" />
      </View>
    </View>

    {/* Row 4 */}
    <View className="flex-row">
      <View className="flex-1 px-8 py-6 border-r border-gray-beb">
        <FontText text="서비스 방문(로그인) 기록" />
      </View>
      <View className="flex-1 px-8 py-6 border-r border-gray-beb">
        <FontText text="통신비밀보호법" />
      </View>
      <View className="w-1/5 px-8 py-6 border-r border-gray-beb">
        <FontText text="3개월" />
      </View>
    </View>
  </View>
);

const PersonalTermsScreen = () => {
  const myPageNavigation = useMyPageNavigation();
  const handleBack = () => myPageNavigation.goBack();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TouchableOpacity className="p-16" onPress={handleBack}>
        <IconChevronLeft />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ rowGap: 28, padding: 16 }}>
        <FontText
          text="가는길지금 개인정보 처리방침 ver.1"
          fontWeight="500"
          className="text-20 leading-[130%] tracking-normal"
        />
        <View className="h-1 bg-gray-beb" />
        {PERSONAL_TERMS_VER_1.map(({ title, body }, idx) => (
          <View key={idx} className="space-y-8">
            {title && <FontText text={title} fontWeight="600" />}
            <View className="space-y-8">
              {body.map((detail, idx) => {
                if (detail === 'table1') {
                  return table1;
                }
                if (detail === 'table2') {
                  return table2;
                }
                if (detail === 'table3') {
                  return table3;
                }
                return (
                  <FontText
                    key={idx}
                    text={detail}
                    className="font-light tracking-normal leading-25"
                  />
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PersonalTermsScreen;

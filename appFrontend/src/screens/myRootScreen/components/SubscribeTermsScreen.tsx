import { SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';
import { useMyPageNavigation } from '@/navigation/MyPageNavigation';
import IconChevronLeft from '@assets/icons/icon_chevron-left.svg';
import { FontText } from '@/global/ui';
import { SUBSCRIBE_TERMS_VER_1 } from '@/global/constants/terms';

const SubscribeTermsScreen = () => {
  const myPageNavigation = useMyPageNavigation();
  const handleBack=() => myPageNavigation.goBack()

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TouchableOpacity className='p-16' onPress={handleBack}>
          <IconChevronLeft />
      </TouchableOpacity>

      <ScrollView className='m-16 space-y-28'>
        <FontText text='가는길지금 이용약관 ver.1' fontWeight='500' className='text-20 leading-[130%] tracking-normal' />
        <View className="h-1 bg-gray-beb" />
        {SUBSCRIBE_TERMS_VER_1.map(({title, body}, idx)=>
          <View key={idx} className='space-y-8'>
            <FontText text={title} fontWeight='600'/>
            <View className='space-y-8'>
              {body.map((detail, idx)=>
                <FontText key={idx} text={detail} className="font-light tracking-normal leading-25"/>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SubscribeTermsScreen;

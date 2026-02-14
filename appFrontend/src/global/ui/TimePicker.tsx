import React, { useState } from 'react';
import { View } from 'react-native';
import DatePicker from 'react-native-date-picker';

interface Props {
  setSelectedTime: (time: string) => void;
}

const TimePicker = ({ setSelectedTime }: Props) => {
  const [date, setDate] = useState(new Date());

  setSelectedTime(`${date.getHours()}:${date.getMinutes()}`);

  return (
    <View className="border-b-1 border-gray-beb bg-gray-9f9">
      <DatePicker
        className="w-full my-5 h-144 rounded-8 bg-gray-9f9"
        date={date}
        onDateChange={setDate}
        locale="ko-KR"
        mode="time"
        minuteInterval={5}
        androidVariant="iosClone"
        theme="light"
        fadeToColor="#F9F9F9"
      />
    </View>
  );
};

export default TimePicker;

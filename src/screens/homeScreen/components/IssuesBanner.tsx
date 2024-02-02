import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, FontText } from '@/global/ui';
import { COLOR } from '@/global/constants';

const IssuesBanner = () => {
  return (
    <View style={styles.issuesBanner}>
      {/* <IconButton
        isFontIcon={false}
        imagePath="issue_rain_circle"
        iconWidth="23px"
        iconHeight="23px"
      /> */}
      <FontText
        style={styles.buttonIssues}
        value="폭우로 인한 4호선 운행정지"
        textSize="13px"
        textWeight="SemiBold"
        lineHeight="19px"
        textColor={COLOR.BASIC_BLACK}
      />
      <IconButton isFontIcon={false} imagePath="more_gray" iconWidth="4.5px" iconHeight="8px" />
    </View>
  );
};

const styles = StyleSheet.create({
  issuesBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EBEBEB',
    borderRadius: 40,
    marginTop: 25,
    marginBottom: 30,
    paddingHorizontal: 12.5,
    paddingVertical: 6,
  },
  buttonIssues: {
    flex: 1,
    marginLeft: 10,
  },
});

export default IssuesBanner;
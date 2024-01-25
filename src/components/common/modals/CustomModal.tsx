import React from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { FontText } from '@/components/common/atoms';
import { COLOR } from '@/constants';
import styled from '@emotion/native';

interface ModalProps {
    isVisible: boolean;
    onCancel: () => void;
    onConfirm?: () => void;
    title: string;
    confirmText?: string;
    cancelText: string;
    btnColor?: string;
}

const CustomModal = ({ isVisible, onCancel, onConfirm, title, confirmText, cancelText, btnColor }: ModalProps) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onCancel}
        >
            <ModalContainer>
                <PopupContainer>
                    <FontText
                        value={title}
                        textSize="20px"
                        textWeight="SemiBold"
                        lineHeight="30px"
                        textColor={COLOR.BASIC_BLACK}
                    />
                    <View style={styles.buttonContainer}>
                        <CancelButton onPress={onCancel} btnColor={btnColor}>
                            <FontText
                                value={cancelText}
                                textSize="16px"
                                textWeight="SemiBold"
                                lineHeight="30px"
                                textColor={COLOR.GRAY_999}
                            />
                        </CancelButton>
                        {onConfirm && (
                            <DeleteButton onPress={onConfirm}>
                                <FontText
                                    value={confirmText}
                                    textSize="16px"
                                    textWeight="Bold"
                                    lineHeight="30px"
                                    textColor={COLOR.WHITE}
                                />
                            </DeleteButton>
                        )}
                    </View>
                </PopupContainer>
            </ModalContainer>
        </Modal>
    );
};
const ModalContainer = styled.View`
  flex:1;
  justifyContent: center;
  alignItems: center;
  backgroundColor: rgba(0, 0, 0, 0.3);
`;
const PopupContainer = styled.View`
  width: 350px;
  height: 160px;
  padding: 30px;
  background-Color: #fff;
  border-radius: 10px;
  alignItems: center;
`;
const ButtonContainer = styled.View`
  flex-Direction: row,
  justify-Content: space-between,
  margin-Top: 40px,
`;

const CancelButton = styled.Pressable<{ btnColor?: string }>`
  flex: 1;
  margin-right: 5px;
  background-color: ${({ btnColor }) => (btnColor ? btnColor : COLOR.WHITE)};
  border-width: ${({ btnColor }) => (btnColor ? '0px' : '1px')};
  border-color: ${({ btnColor }) => (btnColor ? 'transparent' : 'gray')};
  border-radius: 5px;
  padding: 10px;
  align-items: center;
`;

const DeleteButton = styled.Pressable`
flex:1;
margin-Left: 5px;
backgroundColor: ${COLOR.BASIC_BLACK};
borderRadius: 5px;
padding: 10px;
alignItems: center;
`;

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
});

export default CustomModal;

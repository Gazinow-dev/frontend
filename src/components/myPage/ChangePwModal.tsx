import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { FontText } from '@/components/common/atoms';
import { COLOR } from '@/constants';

interface ModalProps {
    isVisible: boolean,
    onConfirm: undefined,
}
const ChangePwModal = ({ isVisible, onConfirm }: ModalProps) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onConfirm}
        >
            <View style={styles.modalContainer}>
                <View style={styles.popupContainer}>
                    <FontText
                        value="비밀번호가 변경되었습니다"
                        textSize="20px"
                        textWeight="SemiBold"
                        lineHeight="30px"
                        textColor={COLOR.BASIC_BLACK}
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={onConfirm}
                        >
                            <FontText
                                value="확인"
                                textSize="16px"
                                textWeight="Regular"
                                lineHeight="30px"
                                textColor={COLOR.BASIC_BLACK}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    popupContainer: {
        width: 350,
        height: 160,
        padding: 30,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    confirmButton: {
        flex: 1,
        marginRight: 5,
        backgroundColor: COLOR.LIGHT_GRAY,
        // borderWidth: 1,
        // borderColor: 'black',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
    },
});

export default ChangePwModal;
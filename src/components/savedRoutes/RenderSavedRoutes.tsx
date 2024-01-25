import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { FontText } from '@/components/common/atoms';
import { COLOR } from '@/constants';
import { SubwayRoute } from '@/components/savedRoutes';
import { TextButton } from '../common/molecules';
import { AddRouteTypes } from '@/types/apis';
import { useDeleteQuery, useGetSavedRoutesQuery } from '@/hooks';
import { CustomModal } from '@/components/common/modals';

interface RenderSavedRoutesProps {
    id: number;
    roadName: AddRouteTypes;
}

const RenderSavedRoutes = () => {
    const [popupVisible, setPopupVisible] = useState<boolean>(false);
    const [routeToDelete, setRouteToDelete] = useState<number | null>(null);

    const { data: savedRoutesData } = useGetSavedRoutesQuery();

    const renderSavedRoutes = () => (
        savedRoutesData?.map(({ id, roadName }: RenderSavedRoutesProps) => (
            <View key={id} style={styles.containerRoutes}>
                <View style={styles.containerRenderTitle}>
                    <FontText
                        value={roadName}
                        textSize="22px"
                        textWeight="Bold"
                        lineHeight="29px"
                        textColor={COLOR.BASIC_BLACK}
                    />
                    <TextButton
                        value="삭제"
                        textSize="16px"
                        textColor={COLOR.GRAY_999}
                        textWeight="Medium"
                        onPress={() => showDeletePopup(id)}
                        lineHeight="21px"
                    />
                </View>

                <View style={styles.containerSubwayRoute}>
                    <SubwayRoute />
                </View>

                <View style={styles.borderLine}></View>
            </View>
        ))
    );

    const showDeletePopup = (id: number) => {
        setRouteToDelete(id);
        setPopupVisible(true);
    };

    const hideModal = () => setPopupVisible(false);

    const handleConfirm = async () => {
        await useDeleteQuery(routeToDelete);
        hideModal();
    };

    return (
        <View>
            {renderSavedRoutes()}
            <CustomModal
                isVisible={popupVisible}
                onCancel={hideModal}
                onConfirm={handleConfirm}
                title="경로를 삭제하시겠습니까?"
                confirmText="삭제"
                cancelText="취소"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    containerRoutes: {
        paddingBottom: 20,
    },
    containerRenderTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    containerSubwayRoute: {
        marginTop: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    borderLine: {
        borderWidth: 1,
        borderColor: COLOR.LIGHT_GRAY,
        width: 999,
        marginStart: -99,
        marginTop: 30,
    },
});

export default RenderSavedRoutes;
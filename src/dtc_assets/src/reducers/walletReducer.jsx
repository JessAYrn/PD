import {WALLET_TABS} from '../Constants';

export const walletTypes={
    SET_ENTIRE_WALLET_REDUX_STATE: "SET_ENTIRE_WALLET_REDUX_STATE",
    SET_WALLET_TABS:'SET_WALLET_TABS',
    SET_WALLET_DATA: "SET_WALLET_DATA",
    SET_WALLET_QR_CODE_IMG_URL:"SET_WALLET_QR_CODE_IMG_URL",
    SET_WALLET_DATA_RELOAD_STATUS:'SET_WALLET_DATA_RELOAD_STATUS'
}


export const walletInitialState={
    walletPageTab:WALLET_TABS.icpTab,
    shouldReload: true,
    walletData: {
        balance:'',
        address:'',
        qrCodeImgUrl:'',
        txHistory: {
            isLoading: false,
            data: []
        }
    },


}

const changeValue = (state =walletInitialState, action) => {
    const {actionType, payload, index, fileIndex, blockReload } = action;
    


    switch(actionType){
        case walletTypes.SET_ENTIRE_WALLET_REDUX_STATE:
            state = payload;
            return {
                ...state
            }


        case walletTypes.SET_WALLET_DATA:
            state.walletData = {
                ...state.walletData,
                balance: payload.balance,
                address: payload.address
            }
            return {
                ...state
            }
            
        case walletTypes.SET_WALLET_TABS:
                        state.walletPageTab=payload;
                        return{
                            ...state
            }
        
        case walletTypes.SET_WALLET_QR_CODE_IMG_URL:
        state.walletData = {
            ...state.walletData,
            qrCodeImgUrl: payload
        };
        return{
            ...state
        }

        case walletTypes.SET_WALLET_DATA_RELOAD_STATUS:
        state.shouldReload=payload
        return {
            ...state
        }
        default:
            return {
                 ...state
         }
    }
}

export default changeValue;
import React , {useContext}from "react";
import { UI_CONTEXTS } from "../../Contexts";
import { AppContext as WalletContext } from "../../Wallet";
import { AppContext  as NftContext} from "../../NFTs";
import { AppContext as JournalContext } from "../../App";
import { AppContext as  AccountContext} from "../../Account";
import { AppContext as  HomePageContext} from "../../HomePage";
import { types } from "../../reducers/journalReducer";
import { MODALS_TYPES } from "../../Constants";
import "./DateOutOfRange.scss"

const DateOutOfRange = (props) => {
    const {
        context
    } = props;
    let AppContext;
    if(context === UI_CONTEXTS.JOURNAL){
        AppContext = JournalContext;
    }
    if(context === UI_CONTEXTS.NFT){
        AppContext = NftContext
    }
    if(context === UI_CONTEXTS.HOME_PAGE){
        AppContext = HomePageContext;
    }
    if(context === UI_CONTEXTS.WALLET){
        AppContext = WalletContext
    }
    if(context === UI_CONTEXTS.ACCOUNT_PAGE){
        AppContext = AccountContext;
    }
    const {journalState, dispatch} = useContext(AppContext);

    const onClick = () => {
        dispatch({
            actionType: types.SET_MODAL_STATUS,
            payload: {show: false, which: MODALS_TYPES.onSubmit}
    });
    }

    return(
        <div className="contentDiv__dateOutOfRange">

                <h3 className='h3Texts'>
                    { journalState.modalStatus.beyondMax ? 
                        'You may only select dates as late as the current date.' :
                        'The unlock date must be at least one month in the future.'
                    }
                </h3>
            <button className={'button'} onClick={onClick}> OK </button>
        </div>
    )
};
export default DateOutOfRange;
import React, { useContext, useEffect} from 'react';
import { getIntObserverFunc, visibilityFunctionDefault } from './animations/IntersectionObserverFunctions';
import { AppContext } from '../HomePage';
import { NavBar } from './navigation/NavBar';
import { UI_CONTEXTS } from '../Contexts';
import { Modal } from './Modal';
import "./Analytics.scss"
import DataField from './Fields/DataField';
import LoadScreen from './LoadScreen';
import { types } from '../reducers/journalReducer';
import { MODALS_TYPES } from '../Constants';
import Switch from './Fields/Switch';
import { CANISTER_DATA_FIELDS } from '../Constants';
import * as RiIcons from 'react-icons/ri';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import ButtonField from './Fields/Button';
import { IconContext } from 'react-icons/lib';
import { shortenHexString } from '../Utils';
import { copyWalletAddressHelper } from './walletFunctions/CopyWalletAddress';


const DataFieldArray = (props) => {
    const {
        journalState,
        dataField,
        dataSubField,
        label,
        isListOfRequests,
        isOwner,
        dispatch
    } = props;
    
    let array = journalState[dataField][dataSubField] || [];

    const handleAddPrincipal = async (principal) => {
        dispatch({
            actionType: types.SET_IS_LOADING,
            payload: true
        });
        let result_0 = await journalState.actor.removePrincipalFromRequestsArray(principal);
        let result_1 = await journalState.actor.addApprovedUser(principal);
        let success = false;
        if("ok" in result_1 && "ok" in result_0){
            success = true;
            result_0 = result_0.ok;
            result_1 = result_1.ok;
            dispatch({
                actionType: types.SET_CANISTER_DATA,
                payload: {...journalState.canisterData, requestsForApproval: result_0, users: result_1}
            });
        }
        dispatch({
            actionType: types.SET_MODAL_STATUS,
            payload: {show: true, which: MODALS_TYPES.onRegisterNewOwner, success: success}
        });
        dispatch({
            actionType: types.SET_IS_LOADING,
            payload: false
        });
    };

    const handleRemovePrincipal = async (principal, requestingApproval) => {
        dispatch({
            actionType: types.SET_IS_LOADING,
            payload: true
        });
        let apiFunctionToCall = requestingApproval ? journalState.actor.removePrincipalFromRequestsArray : journalState.actor.removeApprovedUser;
        let result = await apiFunctionToCall(principal);
        let success = false;
        if("ok" in result){
            success = true;
            result = result.ok;
            let payload = requestingApproval ? { ...journalState.canisterData, requestsForApproval: result } : { ...journalState.canisterData, users: result }
            dispatch({
                actionType: types.SET_CANISTER_DATA,
                payload: payload
            });
        }
        dispatch({
            actionType: types.SET_MODAL_STATUS,
            payload: {show: true, which: MODALS_TYPES.onRegisterNewOwner, success: success}
        });
        dispatch({
            actionType: types.SET_IS_LOADING,
            payload: false
        });
    } 

    const copyPrincipal = (principal) => copyWalletAddressHelper(principal);

    let requestingApproval = dataSubField === CANISTER_DATA_FIELDS.requestsForApproval;

    return(
        <div className={'canisterDataDiv'}>
            <div className={'section'}>
                <h5 className={'lebelH5'}>
                    {label} 
                </h5>
            </div>
            <div className={'section array'}>
                <>
                    {
                        array.map((obj, index) => {
                            let principal = !isListOfRequests ? obj[0] : obj;
                            let permissions = !isListOfRequests ? obj[1] : null;
                            return (
                                <div className={'dataFieldRow'}>
                                    <div className={'rowSection1'}>  
                                        {isOwner && (isListOfRequests || permissions.approved === false) &&
                                        <IconContext.Provider value={{ size: '25px'}}>
                                            <FaIcons.FaCheckSquare onClick={() => handleAddPrincipal(principal)}/>
                                        </IconContext.Provider>}
                                        <h5 className={'h5DataField'}>
                                            {shortenHexString(principal)}
                                            {<ButtonField
                                                Icon={FaIcons.FaCopy}
                                                iconSize={17.5}
                                                onClick={() => copyPrincipal(principal)}
                                                withBox={false}
                                            />}
                                        </h5>
                                        {isOwner && (isListOfRequests || permissions.approved === true) &&
                                        <IconContext.Provider value={{ size: '25px'}}>
                                            <RiIcons.RiDeleteBin2Line onClick={() => handleRemovePrincipal(principal, requestingApproval)}/>
                                        </IconContext.Provider>}
                                    </div>
                                    {!isListOfRequests && permissions.approved &&
                                    <div className={'rowSection2'}>
                                        <IconContext.Provider value={{ size: '15px'}}>
                                            <AiIcons.AiTwotoneLike/>
                                        </IconContext.Provider>
                                        <h6>approved to post content</h6>
                                    </div>
                                    }
                                    {!isListOfRequests && !permissions.approved &&
                                    <div className={'rowSection2'}>
                                        <IconContext.Provider value={{ size: '15px'}}>
                                            <AiIcons.AiTwotoneDislike/>
                                        </IconContext.Provider>
                                        <h6>not approved to post content</h6>
                                    </div>
                                    }
                                </div>
                            )
                        })
                    }
                </>
            </div>
        </div>
    )
};

const Analytics = () => {
    const { journalState, dispatch } = useContext(AppContext);

    const toggleAcceptRequest = async () => {
        dispatch({
            actionType: types.SET_IS_LOADING,
            payload: true
        });
        let success = false;
        let result = await journalState.actor.toggleAcceptRequest();
        if('ok' in result)  {
            success = true;
            dispatch({
                actionType: types.SET_CANISTER_DATA,
                payload: { ...journalState.canisterData, acceptingRequests: !journalState.canisterData.acceptingRequests }
            });
        }
        dispatch({
            actionType: types.SET_MODAL_STATUS,
            payload: {show: true, which: MODALS_TYPES.onRegisterNewOwner, success: success}
        });
        dispatch({
            actionType: types.SET_IS_LOADING,
            payload: false
        });
    };

    const toggleSupportMode = async () => {
        dispatch({
            actionType: types.SET_IS_LOADING,
            payload: true
        });
        let success = false;
        let result = await journalState.actor.toggleSupportMode();
        if('ok' in result)  {
            success = true;
            dispatch({
                actionType: types.SET_CANISTER_DATA,
                payload: { ...journalState.canisterData, supportMode: !journalState.canisterData.supportMode }
            });
        }
        dispatch({
            actionType: types.SET_MODAL_STATUS,
            payload: {show: true, which: MODALS_TYPES.onRegisterNewOwner, success: success}
        });

        dispatch({
            actionType: types.SET_IS_LOADING,
            payload: false
        });
    }

    const handleRegistration = async () => {
        dispatch({
            actionType: types.SET_IS_LOADING,
            payload: true
        });
        let success;
        let result = await journalState.actor.registerOwner();
        if('err' in result) success = false;
        else success = true;
        dispatch({
            actionType: types.SET_MODAL_STATUS,
            payload: {show: true, which: MODALS_TYPES.onRegisterNewOwner, success: success}
        })
        dispatch({
            actionType: types.SET_IS_LOADING,
            payload: false
        });
    };

    useEffect(() => {
        const containers = document.querySelectorAll(".contentContainer.animatedLeft");
        containers.forEach( (container, index) => {
            let props_ = {
                className: "animatedLeft",
                containerIndex: index,
                visibilityFunction: visibilityFunctionDefault
            };
            const observer = new IntersectionObserver(getIntObserverFunc(props_), {threshold: .05});
            observer.observe(container);
        });
    }, [journalState]);
    
    let animatedLeftElementIndex = 0;

    return(
            journalState.modalStatus.show ?
                <div className={"container"}>
                    <Modal 
                        context={UI_CONTEXTS.HOME_PAGE}
                    />
                </div> : 
                <div className="container">
                    <NavBar
                        walletLink={true}
                        journalLink={true}
                        nftLink={true}
                        accountLink={true}
                        dashboardLink={false}
                        notificationIcon={false}
                        context={UI_CONTEXTS.HOME_PAGE}
                    />
                    {journalState.isLoading ? 
                        <LoadScreen/> :
                        <div class={'scrollable'}>
                            <div className='container_homePage'>
                                <div className={'transparentDiv__homePage__dataFields  animatedLeft contentContainer '+` _${animatedLeftElementIndex++}`}>
                                    <div className={'AnalyticsDiv'}>
                                        <div className={'AnalyticsContentContainer'}>
                                            <DataField
                                                label={'Journals Created:'}
                                                text={journalState.canisterData[CANISTER_DATA_FIELDS.journalCount]}
                                                dispatch={dispatch}
                                            />
                                            <DataField
                                                label={'Frontend Canister Principal:'}
                                                text={journalState.canisterData[CANISTER_DATA_FIELDS.frontEndPrincipal]}
                                                dispatch={dispatch}
                                                isPrincipal={true}
                                            />
                                            <DataField
                                                label={'Backend Canister Principal:'}
                                                text={journalState.canisterData[CANISTER_DATA_FIELDS.backEndPrincipal]}
                                                dispatch={dispatch}
                                                isPrincipal={true}
                                            />
                                            <DataField
                                                label={'Cycles Burned Per Day:'}
                                                dispatch={dispatch}
                                                text={journalState.canisterData[CANISTER_DATA_FIELDS.backEndCyclesBurnRatePerDay]}
                                                isCycles={true}
                                            />
                                            <DataField
                                                label={'Frontend Cycles Balance:'}
                                                text={journalState.canisterData[CANISTER_DATA_FIELDS.currentCyclesBalance_frontend]}
                                                dispatch={dispatch}
                                                isCycles={true}
                                            />
                                            <DataField
                                                label={'Backend Cycles Balance:'}
                                                text={journalState.canisterData[CANISTER_DATA_FIELDS.currentCyclesBalance_backend]}
                                                dispatch={dispatch}
                                                isCycles={true}
                                            />
                                            <DataField
                                                label={'Canister Owner:'}
                                                text={journalState.canisterData[CANISTER_DATA_FIELDS.nftOwner]}
                                                dispatch={dispatch}
                                                isPrincipal={true}
                                            />
                                            <DataField
                                                label={'NFT ID:'}
                                                text={journalState.canisterData[CANISTER_DATA_FIELDS.nftId]}
                                                dispatch={dispatch}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {   journalState.canisterData.isOwner &&
                                    <div className={'transparentDiv__homePage__dataFields approvedPrincipals  animatedLeft contentContainer '+` _${animatedLeftElementIndex++}`}>
                                        <div className={'AnalyticsDiv'}>
                                            <div className={'AnalyticsContentContainer'}>
                                                <DataFieldArray
                                                    label={'Principals Requesting Approval:'}
                                                    dispatch={dispatch}
                                                    journalState={journalState}
                                                    dataField={'canisterData'}
                                                    dataSubField={CANISTER_DATA_FIELDS.requestsForApproval}
                                                    isListOfRequests={true}
                                                    isOwner={journalState.canisterData.isOwner}
                                                />
                                            </div>
                                        </div>
                                    </div> 
                                }
                                <div className={'transparentDiv__homePage__dataFields approvedPrincipals  animatedLeft contentContainer '+` _${animatedLeftElementIndex++}`}>
                                    <div className={'AnalyticsDiv'}>
                                        <div className={'AnalyticsContentContainer'}>
                                            <DataFieldArray
                                                label={'User Principals:'}
                                                dispatch={dispatch}
                                                isListOfRequests={false}
                                                journalState={journalState}
                                                dataField={'canisterData'}
                                                dataSubField={CANISTER_DATA_FIELDS.users}
                                                isOwner={journalState.canisterData.isOwner}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {journalState.canisterData.isOwner && 
                                <div className={'switchDiv animatedLeft contentContainer '+` _${animatedLeftElementIndex++}`}>
                                    <div className='section'>
                                        <h5 className={'lebelH5'}> 
                                            Activate Support Mode:  
                                        </h5>
                                    </div>
                                    <div className='section'>
                                        <Switch
                                            active={journalState.canisterData.supportMode}
                                            onClick={toggleSupportMode}
                                        />
                                    </div>
                                </div>}
                                {journalState.canisterData.isOwner && 
                                <div className={'switchDiv animatedLeft contentContainer '+` _${animatedLeftElementIndex++}`}>
                                    <div className='section'>
                                        <h5 className={'lebelH5'}> 
                                            Receive Requests:  
                                        </h5>
                                    </div>
                                    <div className='section'>
                                        <Switch
                                            active={journalState.canisterData.acceptingRequests}
                                            onClick={toggleAcceptRequest}
                                        />
                                    </div>
                                </div>}
                                <ButtonField
                                    text={' Register As New Owner '}
                                    className={'registryButtonDiv animatedLeft contentContainer '+` _${animatedLeftElementIndex++}`}
                                    onClick={handleRegistration}
                                    withBox={true}
                                />
                            </div>
                        </div>}
                </div>

        
    )

}

export default Analytics;
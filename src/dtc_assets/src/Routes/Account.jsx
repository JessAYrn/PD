import React, {useReducer, createContext, useEffect, useState, useMemo} from 'react';
import journalReducer, { types, initialState } from '../reducers/journalReducer';
import accountReducer , {accountTypes, accountInitialState} from '../reducers/accountReducer';
import AccountSection from './Pages/AccountPage';
import { useLocation } from 'react-router-dom';
import LoginPage from './Pages/authentication/LoginPage';
import { UI_CONTEXTS } from '../functionsAndConstants/Contexts';
import { recoverState, loadAllDataIntoReduxStores  } from '../functionsAndConstants/loadingFunctions';
import { useConnect } from '@connect2ic/react';
import { DEFAULT_APP_CONTEXTS } from '../functionsAndConstants/Constants';
import walletReducer,{ walletInitialState, walletTypes } from '../reducers/walletReducer';
import homePageReducer, { homePageInitialState, homePageTypes } from '../reducers/homePageReducer';
import actorReducer, { actorInitialState,actorTypes } from "../reducers/actorReducer";
import notificationsReducer, {notificationsInitialState, notificationsTypes} from "../reducers/notificationsReducer";
import ModalComponent from '../Components/modal/Modal';

export const AppContext = createContext(DEFAULT_APP_CONTEXTS);

const AccountPage = () => {

    const [journalState, journalDispatch] = useReducer(journalReducer, initialState);
    const [notificationsState, notificationsDispatch] = useReducer(notificationsReducer, notificationsInitialState);
    const [accountState, accountDispatch] = useReducer(accountReducer, accountInitialState);
    const [walletState, walletDispatch]=useReducer(walletReducer,walletInitialState);
    const [homePageState, homePageDispatch]=useReducer(homePageReducer,homePageInitialState);
    const [actorState, actorDispatch] = useReducer(actorReducer, actorInitialState);
    const [stateHasBeenRecovered, setStateHasBeenRecovered] = useState(false);

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isLoadingModal, setIsLoadingModal] = useState(false);
    const [modalProps, setModalProps] = useState({});

    //clears useLocation().state upon page refresh so that when the user refreshes the page,
    //changes made to this route aren't overrided by the useLocation().state of the previous route.
    window.onbeforeunload = window.history.replaceState(null, '');

    const connectionResult = useConnect({ onConnect: () => {}, onDisconnect: () => {} });

    const ReducerDispatches={
        walletDispatch,
        journalDispatch,
        accountDispatch,
        homePageDispatch,
        actorDispatch,
        notificationsDispatch
    }

    const ReducerTypes={
        journalTypes:types,
        walletTypes,
        accountTypes,
        homePageTypes,
        actorTypes,
        notificationsTypes
    }

    const ReducerStates = {
        journalState,
        walletState,
        accountState,
        homePageState,
        actorState,
        notificationsState
    };

    // gets state from previous route
    const location = useLocation();

    // dispatch state from previous route to redux store if that state exists
    recoverState( location, ReducerDispatches, ReducerTypes, connectionResult, setStateHasBeenRecovered );

    useEffect(async () => {
        if(!actorState.backendActor) return;
        setIsLoadingModal(true);
        setModalIsOpen(true);
        const response = await loadAllDataIntoReduxStores(ReducerStates, ReducerDispatches, ReducerTypes, stateHasBeenRecovered);
        setModalIsOpen(response?.openModal);
        setModalProps(response)
        setIsLoadingModal(false);
    },[actorState.backendActor]);

    const displayComponent = useMemo(() => {
        return journalState.isAuthenticated && accountState.dataHasBeenLoaded
    },[journalState.isAuthenticated, accountState.dataHasBeenLoaded])

    return (
        <AppContext.Provider 
            value={{
                journalState,
                journalDispatch,
                accountDispatch,
                accountState,
                walletDispatch,
                walletState,
                homePageState,
                homePageDispatch,
                actorState,
                actorDispatch,
                notificationsState,
                notificationsDispatch
            }}
        >
            {
                displayComponent ? 
                    <AccountSection/> : 
                    <LoginPage
                        context={UI_CONTEXTS.ACCOUNT_PAGE}
                    /> 
            }
            <ModalComponent 
                {...modalProps}
                open={modalIsOpen} 
                isLoading={isLoadingModal} 
            />        
        </AppContext.Provider>
    )

};

export default AccountPage;
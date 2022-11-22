import { dayInNanoSeconds, MODALS_TYPES } from "../Constants"

export const types = {
    SET_ENTIRE_REDUX_STATE: "SET_ENTIRE_REDUX_STATE",
    SET_ACTOR: "SET_ACTOR",
    SET_AUTH_CLIENT: "SET_AUTH_CLIENT",
    SET_STOIC_IDENTITY: "SET_STOIC_IDENTITY",
    SET_AUTHENTICATE_FUNCTION_CALL_COUNT: "SET_AUTHENTICATE_FUNCTION_CALL_COUNT",
    SET_CREATE_ACTOR_FUNCTION_CALL_COUNT: "SET_CREATE_ACTOR_FUNCTION_CALL_COUNT",
    SET_CANISTER_DATA: "SET_CANISTER_DATA",
    SET_IS_LOGGING_IN: "SET_IS_LOGGING_IN",
    SET_JOURNAL: "SET_JOURNAL",
    SET_JOURNAL_UNREAD_ENTRIES:"SET_JOURNAL_UNREAD_ENTRIES",
    SET_BIO: "SET_BIO",
    SET_METADATA: "SET_METADATA",
    SET_WALLET_DATA: "SET_WALLET_DATA",
    SET_WALLET_QR_CODE_IMG_URL:"SET_WALLET_QR_CODE_IMG_URL",
    SET_MODAL_STATUS: "SET_MODAL_STATUS",
    SET_NFT_DATA: "SET_NFT_DATA",
    SET_NFT_DATA_RELOAD_STATUS: "SET_NFT_DATA_RELOAD_STATUS",
    SET_WALLET_DATA_RELOAD_STATUS: "SET_WALLET_DATA_RELOAD_STATUS",
    SET_JOURNAL_DATA_RELOAD_STATUS: "SET_JOURNAL_DATA_RELOAD_STATUS",
    SET_CANISTER_DATA_RELOAD_STATUS: "SET_CANISTER_DATA_RELOAD_STATUS",
    SET_IS_AUTHENTICATED: "SET_IS_AUTHENTICATED",
    SET_IS_LOADING:"SET_IS_LOADING",
    SET_TX_HISTORY_DATA:"SET_TX_HISTORY_DATA",
    SET_IS_TX_HISTORY_LOADING: "SET_IS_TX_HISTORY_LOADING",
    CHANGE_DRAFT: "CHANGE_DRAFT",
    CHANGE_DATE: "CHANGE_DATE",
    CHANGE_LOCATION: "CHANGE_LOCATION",
    CHANGE_CAPSULED: "CHANGE_CAPSULED",
    CHANGE_ENTRY: "CHANGE_ENTRY",
    CHANGE_UNLOCK_TIME: "CHANGE_UNLOCK_TIME",
    ADD_JOURNAL_PAGE: "ADD_JOURNAL_PAGE",
    ADD_NFT_FILE: "ADD_NFT_FILE",
    ADD_JOURNAL_ENTRY_FILE: "ADD_JOURNAL_ENTRY_FILE",
    CHANGE_DOB: "CHANGE_DOB",
    CHANGE_POB: "CHANGE_POB",
    CHANGE_PREFACE: "CHANGE_PREFACE",
    CHANGE_DEDICATIONS: "CHANGE_DEDICATIONS",
    CHANGE_NAME: "CHANGE_NAME",
    CHANGE_ENTRY_TITLE: "CHANGE_ENTRY_TITLE",
    CHANGE_EMAIL: "CHANGE_EMAIL",
    CHANGE_USERNAME: "CHANGE_USERNAME",
    CHANGE_RECIPIENT_EMAIL_ONE: "CHANGE_RECIPIENT_EMAIL_ONE",
    CHANGE_RECIPIENT_EMAIL_TWO: "CHANGE_RECIPIENT_EMAIL_TWO",
    CHANGE_RECIPIENT_EMAIL_THREE: "CHANGE_RECIPIENT_EMAIL_THREE",
    CHANGE_PAGE_IS_DISABLED_STATUS: "CHANGE_PAGE_IS_DISABLED_STATUS",
    CHANGE_FILE_METADATA: "CHANGE_FILE_METADATA",
    CHANGE_FILE_ERROR_STATUS: "CHANGE_FILE_ERROR_STATUS",
    CHANGE_FILE_LOAD_STATUS: "CHANGE_FILE_LOAD_STATUS",
    CHANGE_PAGE_IS_OPEN: "CHANGE_PAGE_IS_OPEN",
    CHANGE_NFT_FILE_LOAD_STATUS: "CHANGE_NFT_FILE_LOAD_STATUS",
    REMOVE_UNSUBMITTED_PAGE: "REMOVE_UNSUBMITTED_PAGE",
    REMOVE_NFT_FILE:"REMOVE_NFT_FILE",
    REMOVE_JOURNAL_ENTRY_FILE: "REMOVE_JOURNAL_ENTRY_FILE",
    SET_HANDLE_PAGE_SUBMIT_FUNCTION: "SET_HANDLE_PAGE_SUBMIT_FUNCTION"

}

export const initialState = {
    actor: undefined,
    authClient: undefined,
    authenticateFunctionCallCount: 0,
    createActorFunctionCallCount: 0,
    stoicIdentity: undefined,
    journalCount: 0,
    canisterData: {
        users: [],
        journalCount: 0,
        backEndCyclesBurnRatePerDay: 1,
        backEndPrincipal: "Null",
        frontEndPrincipal: "Null",
        lastRecordedBackEndCyclesBalance: 1,
        currentCyclesBalance: 1,
        nftOwner: "Null",
        isOwner: false,
        nftId: "Null",
        supportMode: false,
        acceptingRequests: false,
        requestsForApproval: []
    },
    isLoggingIn: false,
    metaData: {
        email: [],
        userName: []
    },
    walletData: {
        balance:'',
        address:'',
        qrCodeImgUrl:'',
        txHistory: {
            isLoading: false,
            data: []
        }
    },
    nftData:[
        [ {nftCollectionKey: -1},
            {
                nftDataTrieSize: 0,
                id: undefined,
                fileType: 'null',
                numberOfCopiesOwned: 0
            }
        ]  
    ],
    bio: {
        name: '',
        dob: '',
        pob: '',
        dedications: '',
        preface:'',
        email: ''
    },
    journal: [],
    unreadEntries:[],
    reloadStatuses: {
        nftData: true,
        walletData: true,
        journalData: true,
        canisterData: true
    }, 
    isAuthenticated: false,
    isLoading: true,
    modalStatus: {
        show: false, 
        which: MODALS_TYPES.onSubmit
    },
    handlePageSubmitFunction: () => {}
};
const defaultFileMetaData = {
    fileName: "null",
    lastModified: 0,
    fileType: "null",
    isLoading: false,
    error: false
};

const freshPage = {
    date: '',
    title: '',
    location: '',
    entry: '',
    unlockTime: null,
    emailOne: '',
    emailTwo: '',
    emailThree: '', 
    draft: true,
    isDisabled: false,
    isOpen: true,
    capsuled: false,
    filesMetaData: []
}

const changeValue = (state = initialState, action) => {

    const {actionType, payload, index, fileIndex } = action;
    let updatedFileMetaData;
    let updatedJournalPage;
    let updatedNftFile;
    let updatedFilesMetaDataArry;

    switch (actionType){
        case types.SET_ENTIRE_REDUX_STATE:
            state = payload;
            return {
                ...state
            }
        case types.SET_ACTOR:
            state.actor = payload;
            return {
                ...state
            }
        case types.SET_AUTH_CLIENT:
        state.authClient = payload;
        return {
            ...state
        }
        case types.SET_STOIC_IDENTITY:
        state.stoicIdentity = payload;
        return {
            ...state
        }
        case types.SET_CANISTER_DATA:
        state.canisterData = payload;
        return {
            ...state
        }
        case types.SET_AUTHENTICATE_FUNCTION_CALL_COUNT:
        state.authenticateFunctionCallCount = payload;
        return {
            ...state
        }
        case types.SET_CREATE_ACTOR_FUNCTION_CALL_COUNT:
        state.createActorFunctionCallCount = payload;
        return {
            ...state
        }
        case types.SET_IS_LOGGING_IN:
        state.isLoggingIn = payload;
        return {
            ...state
        }
        case types.SET_MODAL_STATUS:
            state.modalStatus = payload;
            return {
                ...state
            }
        case types.SET_HANDLE_PAGE_SUBMIT_FUNCTION:
        state.handlePageSubmitFunction = payload;
        return {
            ...state
        }
        case types.SET_JOURNAL:
            state.journal = payload;
            return {
                ...state
            }
        case types.REMOVE_UNSUBMITTED_PAGE:
            state.journal.pop();
            return {
                ...state
            }
        case types.REMOVE_NFT_FILE:
            state.nftData = state.nftData.splice(index, 1);
            return {
                ...state
            }
        case types.SET_IS_AUTHENTICATED:
            state.isAuthenticated = payload;
            return {
                ...state
            }
        case types.SET_IS_LOADING:
            state.isLoading = payload;
            return {
                ...state
            }
        case types.SET_JOURNAL_UNREAD_ENTRIES:
        state.unreadEntries = payload;
        return {
            ...state
        }
        case types.SET_BIO:
            state.bio = payload;
            return {
                ...state
            }
        case types.SET_METADATA:
        state.metaData = payload;
        return {
            ...state
        }
        case types.SET_WALLET_DATA:
        state.walletData = {
            ...state.walletData,
            balance: payload.balance,
            address: payload.address
        }
        return {
            ...state
        }
        case types.SET_WALLET_QR_CODE_IMG_URL:
        state.walletData = {
            ...state.walletData,
            qrCodeImgUrl: payload
        };
        return {
            ...state
        }
        case types.SET_IS_TX_HISTORY_LOADING:
        state.walletData = {
            ...state.walletData,
            txHistory: {
                ...state.walletData.txHistory,
                isLoading: payload
            }
        };
        return {
            ...state
        }
        case types.SET_TX_HISTORY_DATA:
        state.walletData = {
            ...state.walletData,
            txHistory: {
                ...state.walletData.txHistory,
                data: payload
            }
        };
        return {
            ...state
        }
        case types.SET_NFT_DATA:
        state.nftData = payload;
        return {
            ...state
        }
        case types.SET_JOURNAL_DATA_RELOAD_STATUS:
        state.reloadStatuses = {
            ...state.reloadStatuses,
            journalData: payload
        };
        return {
            ...state
        }
        case types.SET_WALLET_DATA_RELOAD_STATUS:
        state.reloadStatuses = {
            ...state.reloadStatuses,
            walletData: payload
        };
        return {
            ...state
        }
        case types.SET_NFT_DATA_RELOAD_STATUS:
        state.reloadStatuses = {
            ...state.reloadStatuses,
            nftData: payload
        };
        return {
            ...state
        }
        case types.SET_CANISTER_DATA_RELOAD_STATUS:
        state.reloadStatuses = {
            ...state.reloadStatuses,
            canisterData: payload
        };
        return {
            ...state
        }
        case types.CHANGE_EMAIL:
            state.bio = {
                ...state.bio,
                email: payload
            }
            state.metaData = {
                ...state.metaData,
                email: [payload]
            }
            return{
                ...state
            }
        case types.CHANGE_USERNAME:
            state.metaData = {
                ...state.metaData,
                userName: [payload]
            }
            return{
                ...state
            }
        case types.CHANGE_DATE:
            updatedJournalPage = {
                ... state.journal[index],
                date: payload
            }
            state.journal[index] = updatedJournalPage;
            return {
                ...state
            }
        case types.CHANGE_PAGE_IS_DISABLED_STATUS:
        updatedJournalPage = {
            ... state.journal[index],
            isDisabled: payload
        }
        state.journal[index] = updatedJournalPage;
        return {
            ...state
        }
        case types.CHANGE_DRAFT:
        updatedJournalPage = {
            ... state.journal[index],
            draft: payload
        }
        state.journal[index] = updatedJournalPage;
        return {
            ...state
        }
        case types.CHANGE_ENTRY_TITLE:
            updatedJournalPage = {
                ... state.journal[index],
                title: payload
            }
            state.journal[index] = updatedJournalPage;
            return {
                ...state
            }
        case types.CHANGE_PAGE_IS_OPEN:
        updatedJournalPage = {
            ... state.journal[index],
            isOpen: payload
        }
        state.journal[index] = updatedJournalPage;
        return {
            ...state
        }
        case types.CHANGE_RECIPIENT_EMAIL_ONE:
            updatedJournalPage = {
                ... state.journal[index],
                emailOne: payload
            }
            state.journal[index] = updatedJournalPage;
            return {
                ...state
            }
        case types.CHANGE_RECIPIENT_EMAIL_TWO:
            updatedJournalPage = {
                ... state.journal[index],
                emailTwo: payload
            }
            state.journal[index] = updatedJournalPage;
            return {
                ...state
            }
        case types.CHANGE_RECIPIENT_EMAIL_THREE:
            updatedJournalPage = {
                ... state.journal[index],
                emailThree: payload
            }
            state.journal[index] = updatedJournalPage;
            return {
                ...state
            }
        case types.CHANGE_LOCATION:
            updatedJournalPage = {
                ... state.journal[index],
                location: payload
            }
            state.journal[index] = updatedJournalPage;
            return {
                ...state
            }
        case types.CHANGE_CAPSULED:
            updatedJournalPage = {
                ... state.journal[index],
                capsuled: payload
            }
            state.journal[index] = updatedJournalPage;
            return {
                ...state
            }
        case types.ADD_JOURNAL_ENTRY_FILE:
            updatedFilesMetaDataArry = [...state.journal[index].filesMetaData];
            updatedFilesMetaDataArry.push(defaultFileMetaData);
            state.journal[index].filesMetaData = updatedFilesMetaDataArry;
            return {
                ...state
            }
        case types.REMOVE_JOURNAL_ENTRY_FILE:
            updatedFilesMetaDataArry = [...state.journal[index].filesMetaData];
            updatedFilesMetaDataArry.pop();
            state.journal[index].filesMetaData = updatedFilesMetaDataArry;
            return {
                ...state
            }
        case types.CHANGE_FILE_METADATA:
            updatedFileMetaData = {
                ...state.journal[index].filesMetaData[fileIndex],
                fileName: payload.fileName,
                lastModified: payload.lastModified,
                fileType: payload.fileType
            };
            updatedFilesMetaDataArry = [...state.journal[index].filesMetaData];
            updatedFilesMetaDataArry[fileIndex] = updatedFileMetaData;
            state.journal[index].filesMetaData = updatedFilesMetaDataArry;
            return {
                ...state
            }
        case types.CHANGE_FILE_ERROR_STATUS:
            updatedFileMetaData = {
                ...state.journal[index].filesMetaData[fileIndex],
                error: payload,
            };
            updatedFilesMetaDataArry = [...state.journal[index].filesMetaData];
            updatedFilesMetaDataArry[fileIndex] = updatedFileMetaData;
            state.journal[index].filesMetaData = updatedFilesMetaDataArry;
            return {
                ...state
            }
        case types.CHANGE_FILE_LOAD_STATUS:
            updatedFileMetaData = {
                ...state.journal[index].filesMetaData[fileIndex],
                isLoading: payload,
            };
            updatedFilesMetaDataArry = [...state.journal[index].filesMetaData];
            updatedFilesMetaDataArry[fileIndex] = updatedFileMetaData;
            state.journal[index].filesMetaData = updatedFilesMetaDataArry;
            return {
                ...state
            }
        case types.CHANGE_NFT_FILE_LOAD_STATUS:
            updatedNftFile = {
                ... state.nftData[index],
                isLoading: payload
            }
            state.journal[index] = updatedNftFile;
            return {
                ...state
            }    
        case types.CHANGE_ENTRY:
            updatedJournalPage = {
                ... state.journal[index],
                entry: payload
            }
            state.journal[index] = updatedJournalPage;
            return {
                ...state
            }
        case types.CHANGE_UNLOCK_TIME:
            updatedJournalPage = {
                ... state.journal[index],
                unlockTime: payload
            }
            state.journal[index] = updatedJournalPage;
            return {
                ...state
            }
        case types.ADD_JOURNAL_PAGE:
            state.journal.push({
                ...freshPage,
                filesMetaData : []
            });
            return {
                ...state
            }
        case types.ADD_NFT_FILE:
        state.nftData.push(payload);
        return {
            ...state
        }
        case types.CHANGE_NAME:
            state.bio = {
                ...state.bio,
                name: payload
            }
            return {
                ...state
            }
        case types.CHANGE_DOB:
            state.bio = {
                ...state.bio,
                dob: payload
            }
            return {
                ...state
            }
        case types.CHANGE_POB:
            state.bio = {
                ...state.bio,
                pob: payload
            }
            return {
                ...state
            }
        case types.CHANGE_PREFACE:
            state.bio = {
                ...state.bio,
                preface: payload
            }
            return {
                ...state
            }
        case types.CHANGE_DEDICATIONS:
        state.bio = {
            ...state.bio,
            dedications: payload
        }
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
import React, {useState, useContext, useMemo, useCallback, useEffect} from "react";
import InputBox from "../../Components/Fields/InputBox";
import {types} from "../../reducers/journalReducer";
import  {AppContext} from "../App";
import "./JournalPage.scss";
import DatePicker from "../../Components/Fields/DatePicker";
import LoadScreen from "./LoadScreen";
import { MODALS_TYPES, monthInMilliSeconds, NULL_STRING_ALL_LOWERCASE} from "../../functionsAndConstants/Constants";
import { dateAisLaterThanOrSameAsDateB, getDateAsString, getDateInMilliseconds, milisecondsToNanoSeconds, scrollToBottom, scrollToTop } from "../../functionsAndConstants/Utils";
import { loadJournalData } from "../../functionsAndConstants/loadingFunctions";
import * as RiIcons from 'react-icons/ri';
import * as BiIcons from 'react-icons/bi';
import * as ImIcons from 'react-icons/im';
import ButtonField from "../../Components/Fields/Button";
import FileCarousel from "../../Components/Fields/fileManger/FileCarousel";
import { fileLoaderHelper } from "../../functionsAndConstants/loadingFunctions";

const JournalPage = (props) => {

    const [pageChangesMade, setPageChangesMade] = useState(false);  
    const [firstTimeOpeningPage, setFirstTimeOpeningPage] = useState(true);
    const [photosLoaded, setPhotosLoaded] = useState(false);
    
    const {
        index
    } = props;

    const { 
        journalState,
        journalDispatch,
        actorState,
        actorDispatch
    } = useContext(AppContext);

    let journalSize = journalState.journal.length;

    let todaysDate = new Date();
    let todaysDateInMilliseconds = todaysDate.getTime();
    let oneMonthLater = todaysDateInMilliseconds + monthInMilliSeconds;
    let minimumDate = getDateAsString(oneMonthLater);
    let thisDate = getDateAsString();

    const journalPageData = useMemo(() => {
        return journalState.journal[index];
    }, [journalState.journal[index]]);

    useEffect(async () => {
        if(photosLoaded) return;
        const promises = [];
        journalPageData.filesMetaData.forEach((fileData, fileIndex) => {
            if(fileData.fileName === NULL_STRING_ALL_LOWERCASE) return;
            if(fileData.file) return;
            promises.push(fileLoaderHelper(
                fileData, 
                fileIndex,
                index,
                actorState,
                journalDispatch,
                types.CHANGE_FILE_LOAD_STATUS,
                types.SET_FILE
            ));
        });
        if(promises.length) setPhotosLoaded(true);
        const result = await Promise.all(promises);
    },[journalPageData.filesMetaData]);

    useEffect(() => {
        scrollToBottom();
    }, [journalPageData.filesMetaData.length]);

    useEffect(() => {
        scrollToTop();
    },[firstTimeOpeningPage]);
    
    //marks this page as read so that it no longer shows in the notifications section
    if(journalPageData.entryKey) actorState.backendActor.readEntry({entryKey: journalPageData.entryKey});

    const toggleSwitch = () => {
        if(journalPageData.draft){
            let isCapsuled = !journalPageData.capsuled
            journalDispatch({
                actionType: types.CHANGE_CAPSULED,
                payload: isCapsuled,
                index: index
            });
            if(isCapsuled) {
                journalDispatch({
                    actionType: types.CHANGE_UNLOCK_TIME,
                    payload: minimumDate,
                    index: index
                });
            } else{
                journalDispatch({
                    actionType: types.CHANGE_UNLOCK_TIME,
                    payload: thisDate,
                    index: index
                });
            };
        };
    };

    const mapAndSendEntryToApi = async (entryKey, journalEntry, isDraft) => {
        let unlockTimeInNanoseconds;
        if(journalEntry.unlockTime) {
            let unlockTimeInMilliseconds = getDateInMilliseconds(journalEntry.unlockTime);
            unlockTimeInNanoseconds = milisecondsToNanoSeconds(unlockTimeInMilliseconds);
        } else unlockTimeInNanoseconds = milisecondsToNanoSeconds(parseInt(Date.now()));

        const entryAsApiObject = [{
            entryTitle: journalEntry.title,
            text: journalEntry.entry,
            location: journalEntry.location,
            date: journalEntry.date,
            unlockTime: unlockTimeInNanoseconds,
            emailOne: journalEntry.emailOne,
            emailTwo: journalEntry.emailTwo,
            emailThree: journalEntry.emailThree,
            filesMetaData: journalEntry.filesMetaData,
            draft: isDraft
        }];

        const entryKeyAsApiObject = (entryKey >= 0 && entryKey < journalSize - 1 ) ? [{entryKey: entryKey}] : [];
        let result = await actorState.backendActor.updateJournalEntry( entryKeyAsApiObject, entryAsApiObject );
        let userJournalData = result.ok;
        loadJournalData({userJournalData}, journalDispatch, types);
        return result;
    };

    const handleSubmit = useCallback(async () => {
        journalDispatch({
            actionType: types.SET_IS_LOADING,
            payload: true
        });
        
        let files = journalPageData.filesMetaData.filter(fileData => fileData.fileName !== 'null' && !fileData.error);
        journalPageData.filesMetaData = files;
        let filesSuccessfullyUploaded = true;
        let result = await actorState.backendActor.submitFiles();
        if('err' in result) filesSuccessfullyUploaded = false;
    
        let result_1 = await mapAndSendEntryToApi(index, journalPageData, !filesSuccessfullyUploaded);
        let entryDataSuccessfullyUploaded = true;
        if('err' in result_1) entryDataSuccessfullyUploaded = false;
        
        const successfulUpload = filesSuccessfullyUploaded && entryDataSuccessfullyUploaded;
        journalDispatch({
            actionType: types.SET_IS_LOADING,
            payload: false
        });
        if(successfulUpload){
            journalDispatch({
                payload: false,
                actionType: types.CHANGE_DRAFT,
                index: index
            });
        } 
        journalDispatch({
            actionType: types.SET_MODAL_STATUS,
            payload: {
                show: true, 
                which: MODALS_TYPES.onSubmit, 
                success: successfulUpload
            }
        });

    }, [journalPageData]);

    const handleClosePage = (e) => {
        // new pages don't have entryKey's until they've been submitted to the backend. 
        
        let isNewPage = !journalPageData.entryKey && journalPageData.entryKey !== 0;
        if(!isNewPage) {
            journalDispatch({
                actionType: types.CHANGE_PAGE_IS_OPEN,
                payload: false,
                index: index
            })
        } else {
            if(pageChangesMade){
                journalDispatch({
                    actionType: types.SET_MODAL_STATUS,
                    payload: {show: true, which: MODALS_TYPES.exitWithoutSubmit}
                });
            } else {
                journalDispatch({
                    actionType: types.REMOVE_UNSUBMITTED_PAGE
                });
            }
        }
    };


    const handleAddFile = async () => {
        journalDispatch({
            index: index,
            actionType: types.ADD_JOURNAL_ENTRY_FILE
        });
    };

    let filesAreLoading = useMemo(() => {
        let filesLoading = false;
        journalPageData.filesMetaData.forEach(file => {
            if(file.isLoading) filesLoading = file.isLoading;
        });
        return filesLoading;
    }, [journalPageData.filesMetaData]);

    return (
        journalState.isLoading ? 
            <LoadScreen/> : 
                <div className={"journalPageContainer"}>
                    <div className={"logoDiv journal"}>
                        <div className={'buttonContainer left'}>
                            <ButtonField
                                Icon={RiIcons.RiArrowGoBackLine}
                                iconSize={25}
                                className={'backButtonDiv'}
                                onClick={handleClosePage}
                                withBox={true}
                            />
                        </div>
                        <div className={'buttonContainer right'}>
                            {dateAisLaterThanOrSameAsDateB(thisDate, journalPageData.unlockTime) ?
                                <ButtonField
                                    Icon={ImIcons.ImUnlocked}
                                    iconSize={25}
                                    className={'lockButton'}
                                    onClick={toggleSwitch}
                                    withBox={true}
                                /> :
                                <ButtonField
                                    Icon={ImIcons.ImLock}
                                    iconSize={25}
                                    className={'lockButton'}
                                    onClick={toggleSwitch}
                                    withBox={true}
                                />
                            }
                        </div>
                    </div>
                    <div className={"journalText"} >
                        <DatePicker
                            id={'entryDate'}
                            label={"Date of Entry: "}
                            rows={"1"}
                            disabled={!journalPageData.draft}
                            setChangesWereMade={setPageChangesMade}
                            dispatch={journalDispatch}
                            dispatchAction={types.CHANGE_DATE}
                            index={index}
                            value={journalPageData.date}
                            max={thisDate}
                        />
                        {(!journalPageData.draft || journalPageData.capsuled) && 
                        <DatePicker
                            id={'lockDate'}
                            label={"Date to Unlock Entry: "}
                            rows={"1"}
                            disabled={!journalPageData.draft}
                            setChangesWereMade={setPageChangesMade}
                            dispatch={journalDispatch}
                            dispatchAction={types.CHANGE_UNLOCK_TIME}
                            index={index}
                            value={journalPageData.unlockTime}
                            min={minimumDate}
                        />}
                        <InputBox
                            label={"Location: "}
                            rows={"1"}
                            disabled={!journalPageData.draft}
                            setChangesWereMade={setPageChangesMade}
                            dispatch={journalDispatch}
                            dispatchAction={types.CHANGE_LOCATION}
                            index={index}
                            value={(journalPageData) ? journalPageData.location : ''}
                        />
                        <InputBox
                            divClassName={"entry"}
                            label={"Entry: "}
                            rows={"30"}
                            disabled={!journalPageData.draft}
                            setChangesWereMade={setPageChangesMade}
                            dispatch={journalDispatch}
                            dispatchAction={types.CHANGE_ENTRY}
                            index={index}
                            value={(journalPageData) ? journalPageData.entry : ''}
                        />
                    </div>
                    {journalState.journal[index].filesMetaData.length > 0 &&
                        <div className='photosSection'>
                            <FileCarousel
                                videoHeight = {'330'}
                                filesMetaDataArray={journalState.journal[index].filesMetaData}
                                journalState={journalState}
                                actorState={actorState}
                                actorDispatch={actorDispatch}
                                setChangesWereMade={setPageChangesMade}
                                editModeDefault={true}
                                disabled={!journalPageData.draft}
                                journalDispatch={journalDispatch}
                                index={index}
                                dispatchActionToAddFile={types.ADD_JOURNAL_ENTRY_FILE}
                                dispatchActionToDeleteFile={types.REMOVE_JOURNAL_ENTRY_FILE}
                                classNameMod={'coverPhoto'}
                                dispatchActionToChangeFileMetaData={types.CHANGE_FILE_METADATA}
                                dispatchActionToChangeFileLoadStatus={types.CHANGE_FILE_LOAD_STATUS}
                                withoutButtons={true}
                            />
                        </div>    
                    }
                    {
                        journalPageData.draft &&
                        <ButtonField
                            Icon={BiIcons.BiImageAdd}
                            iconSize={25}
                            className={'addFileDiv'}
                            onClick={handleAddFile}
                            withBox={true}
                        />
                    }
                    {
                        journalPageData.draft && !filesAreLoading && pageChangesMade &&
                        <ButtonField
                            text={'Submit'}
                            className={'submitButtonDiv'}
                            onClick={handleSubmit}
                            withBox={true}
                        />
                    }
                </div>
    )
};

export default JournalPage;

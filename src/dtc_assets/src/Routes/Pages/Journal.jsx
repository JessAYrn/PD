import JournalPage from "./JournalPage";
import React, { useContext, useEffect, useState } from "react";
import {types} from "../../reducers/journalReducer";
import "./Journal.scss";
import { AppContext } from "../App";
import InputBox from "../../Components/Fields/InputBox";
import SpeedDialField, { SpeedDialPositions } from '../../Components/Fields/SpeedDialField'
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import LoadScreen from "./LoadScreen";
import { Modal } from "./modalContent/Modal";
import { NavBar } from "../../Components/navigation/NavBar";
import { MODALS_TYPES, NULL_STRING_ALL_LOWERCASE } from "../../functionsAndConstants/Constants";
import { UI_CONTEXTS } from "../../functionsAndConstants/Contexts";
import { dateAisLaterThanOrSameAsDateB, delay, getDateAsString, getHighestEntryKey } from "../../functionsAndConstants/Utils";
import FileCarousel from "../../Components/Fields/fileManger/FileCarousel";
import { fileLoaderHelper } from "../../functionsAndConstants/loadingFunctions";
import DataTable from "../../Components/Fields/Table";
import "../../SCSS/scrollable.scss";
import "../../SCSS/contentContainer.scss";
import { journalPagesTableColumns, mapRequestsForAccessToTableRows } from "../../mappers/journalPageMappers";
import { mapApiObjectToFrontEndJournalEntriesObject } from "../../mappers/journalPageMappers";


const Journal = (props) => {

    const { journalState, journalDispatch, actorState, actorDispatch, modalState, modalDispatch} = useContext(AppContext);
    const [photosLoaded, setPhotosLoaded] = useState(false);
    const [counter, setCounter] = useState(1);
    
    useEffect(async () => {
        if(photosLoaded) return;
        const promises = [];

        journalState.bio.photos.forEach((fileData, fileIndex) => {
            if(fileData.fileName === NULL_STRING_ALL_LOWERCASE) return;
            if(fileData.file) return;
            promises.push(fileLoaderHelper(
                fileData, 
                fileIndex,
                null,
                actorState,
                journalDispatch,
                types.CHANGE_FILE_LOAD_STATUS_JOURNAL_COVER_PAGE,
                types.SET_FILE_JOURNAL_COVER_PAGE
            ));
        });
        if(promises.length) setPhotosLoaded(true);
        const result = await Promise.all(promises);
    },[journalState.bio.photos]);

    const sendData = async () => {
        journalDispatch({
            actionType: types.SET_IS_LOADING,
            payload: true
        })
        const result = await actorState.backendActor.updateBio({
            dob: journalState.bio.dob,
            pob: journalState.bio.pob,
            name: journalState.bio.name,
            dedications: journalState.bio.dedications,
            preface: journalState.bio.preface,
            photos: journalState.bio.photos
        });
        journalDispatch({
            actionType: types.SET_IS_LOADING,
            payload: false
        })
        setCounter(1);
    };

    useEffect(() => {if(counter % 30 === 0) sendData()},[counter]);


    const onTextBoxChange = () => setCounter(counter + 1);

    const openPage = async (props) => {
        const {entryKey, locked} = props;
        const index = journalState.journal.findIndex((page) => page.entryKey === entryKey);
        if(!locked){
            journalDispatch({
                actionType: types.CHANGE_PAGE_IS_OPEN,
                payload: true,
                index: index
            });
        }
    };

    const createJournalPage = async (e, key, locked) => {
        //Ensures that there are no unsubmitted entries left over from a previous post
        const result = await actorState.backendActor.createJournalEntry();
        
        let journalEntries = result.ok;
        journalEntries = mapApiObjectToFrontEndJournalEntriesObject(journalEntries);
        const entryKey = getHighestEntryKey(journalEntries);
        journalDispatch({ payload: journalEntries, actionType: types.SET_JOURNAL });
        openPage({entryKey: entryKey, locked: false});
    };

    const speedDialActions = [
        {name: "New Jorunal Entry", icon: NoteAddIcon , onClick: createJournalPage},
    ]

    const getIndexOfVisiblePage = () => {
        return journalState.journal.findIndex(page => page.isOpen === true);
    }

    return(
        modalState.modalStatus.show ?
        <Modal context={UI_CONTEXTS.JOURNAL} index={getIndexOfVisiblePage()}/> :
        modalState.isLoading ? 
        <LoadScreen/> : 
        <Grid 
            container 
            className={'container_journal'} 
            columns={12} 
            xs={12} 
            rowSpacing={8} 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            flexDirection={"column"}
        >
            <NavBar context={UI_CONTEXTS.JOURNAL} isLoading={journalState.isLoading}/>
            {(getIndexOfVisiblePage() >=0) ?
            <JournalPage index={getIndexOfVisiblePage()}/> :
            <>
                <Grid 
                    columns={12} 
                    xs={11} 
                    md={9} 
                    rowSpacing={0} 
                    display="flex" 
                    justifyContent="center" 
                    alignItems="center" 
                    flexDirection={"column"} 
                    marginTop={"20px"}
                >
                    <InputBox
                        label={"This Journal Belongs To: "}
                        rows={"1"}
                        editable={true}
                        dispatch={journalDispatch}
                        onChange={onTextBoxChange}
                        onBlur={sendData}
                        dispatchAction={types.CHANGE_NAME}
                        value={journalState.bio.name}
                    />
                    <InputBox
                        label={"Date of Birth: "}
                        rows={"1"}
                        editable={true}
                        onChange={onTextBoxChange}
                        onBlur={sendData}
                        dispatch={journalDispatch}
                        dispatchAction={types.CHANGE_DOB}
                        value={journalState.bio.dob}
                    />
                    <InputBox
                        label={"Place of Birth: "}
                        rows={"1"}
                        editable={true}
                        onChange={onTextBoxChange}
                        onBlur={sendData}
                        dispatch={journalDispatch}
                        dispatchAction={types.CHANGE_POB}
                        value={journalState.bio.pob}
                    />
                </Grid>
                <Grid 
                    columns={12} 
                    xs={12} 
                    md={9} 
                    rowSpacing={8} 
                    display="flex" 
                    justifyContent="center" 
                    alignItems="center" 
                    flexDirection={"column"}
                >
                <FileCarousel
                    videoHeight = {'330'}
                    filesMetaDataArray={journalState.bio.photos}
                    journalState={journalState}
                    actorState={actorState}
                    actorDispatch={actorDispatch}
                    journalDispatch={journalDispatch}
                    dispatchActionToAddFile={types.ADD_COVER_PHOTO}
                    dispatchActionToDeleteFile={types.REMOVE_COVER_PHOTO}
                    classNameMod={'coverPhoto'}
                    dispatchActionToChangeFileMetaData={types.CHANGE_FILE_METADATA_JOURNAL_COVER_PAGE}
                    dispatchActionToChangeFileLoadStatus={types.CHANGE_FILE_LOAD_STATUS_JOURNAL_COVER_PAGE}
                />
                </Grid>
                <Grid 
                    columns={12} 
                    xs={11} md={9} 
                    rowSpacing={8} 
                    display="flex" 
                    justifyContent="center" 
                    alignItems="center" 
                    flexDirection={"column"}
                >
                    <InputBox
                        label={"Dedications: "}
                        editable={true}
                        onChange={onTextBoxChange}
                        onBlur={sendData}
                        rows={"8"}
                        dispatch={journalDispatch}
                        dispatchAction={types.CHANGE_DEDICATIONS}
                        value={journalState.bio.dedications}
                    />
                    <InputBox
                        label={"Preface: "}
                        editable={true}
                        onChange={onTextBoxChange}
                        onBlur={sendData}
                        rows={"16"}
                        dispatch={journalDispatch}
                        dispatchAction={types.CHANGE_PREFACE}
                        value={journalState.bio.preface}
                    />
                </Grid>
                <Grid 
                    columns={12} 
                    xs={11} md={9} 
                    rowSpacing={8} 
                    display="flex" 
                    justifyContent="center" 
                    alignItems="center" 
                    flexDirection={"column"}
                >
                    <DataTable
                        onRowClick={openPage}
                        transparent={true}
                        columns={journalPagesTableColumns}
                        rows={mapRequestsForAccessToTableRows(journalState.journal)}
                    />
                </Grid>
                {/* {
                    pageChangesMade &&
                    <ButtonField
                        text={'Submit'}
                        className={'submitButtonDiv'}
                        onClick={handleSubmit}
                    />
                } */}
                <SpeedDialField
                    actions={speedDialActions}
                    position={SpeedDialPositions}
                />
                {/* <ButtonField
                    Icon={AiIcons.AiFillFileAdd}
                    iconSize={25}
                    className={'addPageDiv'}
                    onClick={addJournalPage}
                /> */}
            </>}  
        </Grid>
    );

}

export default Journal;
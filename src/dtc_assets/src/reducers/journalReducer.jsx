export const types ={
    CHANGE_FILE_1: "CHANGE_FILE_1",
    CHANGE_FILE_2: "CHANGE_FILE_2",
    CHANGE_FILE_3: "CHANGE_FILE_3",
    CHANGE_FILE_4: 'CHANGE_FILE_4',
    CHANGE_COVER_IMAGE: "CHANGE_COVER_IMAGE",
    CHANGE_DATE: "CHANGE_DATE",
    CHANGE_LOCATION: "CHANGE_LOCATION",
    CHANGE_ENTRY: "CHANGE_ENTRY",
}

export const initialState = {
    journal: [
        {
            coverImage: {},
            file1: {},
            file2: {},
            file3: {},
            file4: {},
            date: '',
            location: '',
            entry: ''
        }
    ]

}

const changeValue = (state = initialState, action) => {

    const {actionType, payload, index } = action;

    let updatedJournalPage;
    

    switch (actionType){
        case types.CHANGE_FILE_1:
            updatedJournalPage = {
                ... state.journal[index],
                file1: payload
            }
            state.journal[index] = updatedJournalPage;
            return {
                ...state
            }
        case types.CHANGE_FILE_2:
            updatedJournalPage = {
                ... state.journal[index],
                file2: payload
            }
            state.journal[index] = updatedJournalPage;
            return {
                ...state
            }
        case types.CHANGE_FILE_3:
            updatedJournalPage = {
                ... state.journal[index],
                file3: payload
            }
            state.journal[index] = updatedJournalPage;
            return {
                ...state
            }
        case types.CHANGE_FILE_4:
            updatedJournalPage = {
                ... state.journal[index],
                file4: payload
            }
            state.journal[index] = updatedJournalPage;
            return {
                ...state
            }
        case types.CHANGE_COVER_IMAGE:
            updatedJournalPage = {
                ... state.journal[index],
                coverImage: payload
            }
            state.journal[index] = updatedJournalPage;
            return {
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
        case types.CHANGE_LOCATION:
            updatedJournalPage = {
                ... state.journal[index],
                location: payload
            }
            state.journal[index] = updatedJournalPage;
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
        default:
            return {
                 ...state
            }

    }

}

export default changeValue;
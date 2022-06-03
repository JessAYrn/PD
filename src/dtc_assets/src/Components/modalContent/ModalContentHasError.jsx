import React from 'react';
import { MEGABYTES, MAX_NUMBER_OF_BYTES } from '../../Constants';
import { MODALS_TYPES } from '../../Constants';
import { round2Decimals } from '../../Utils';
import "./ModalContentHasError.scss";
const FileHasError = (props) => {

    const{
        setModalStatus,
        modalStatus
    } = props;

    const onClickOk = () => {
        setModalStatus({show: false, which: MODALS_TYPES.onSubmit});
    };

    return(
        <div className={'fileHasErrorCotentDiv'}>  
            <ul className={'list'}>
                <h1 className={'h1'}>
                    Error:
                </h1>
                
                <li>
                    <h6 className={'h6'}>
                        file must be less than or equal to { MAX_NUMBER_OF_BYTES / MEGABYTES} megabytes 
                        after compression and upload.
                    </h6>
                </li>
                <li>
                    <h6 className={'h6'}>
                        Your file is {round2Decimals(modalStatus.fileSize / MEGABYTES)} megabytes
                        after compression and upload.
                    </h6>
                </li>
                <li>
                    <h6 className={'h6'}>
                        Try trimming and re-uploading file.
                    </h6>
                </li> 
            </ul> 
            <div className={'buttonDiv__ok'}>
                <button className='button' onClick={onClickOk}> OK </button> 
            </div> 
        </div>

    )


};

export default FileHasError;
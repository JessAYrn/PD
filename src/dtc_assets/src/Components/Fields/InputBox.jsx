import React, {useState, useRef} from 'react';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useTheme, ThemeProvider } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import UploadIcon from '@mui/icons-material/Upload';
import ButtonField from './Button';
import "./InputBox.scss";


const InputBox = (props) => {
    const inputRef = useRef();
    const [editing, setEditing] = useState(false);

    const {
        label,
        maxLength,
        placeHolder,
        rows,
        disabled,
        editable,
        dispatchAction,
        dispatch,
        index,
        onBlur,
        onChange,
        value,
        hasError
    } = props;

    const onChange_editButton = () => {
        setEditing(!editing);
    };

    const onChange_ = () => {
        if(dispatch) dispatch({
            actionType: dispatchAction,
            payload: inputRef.current.value,
            index: index
        });
        if(onChange) onChange(inputRef.current.value);
    }
    const theme = useTheme();

    let EditIcon_;
    if(editing) EditIcon_ = UploadIcon;
    else if(!editing) EditIcon_ = EditIcon;

    return(
        <ThemeProvider theme={theme}>
            <Grid 
                columns={12} 
                xs={12} 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                flexDirection={"column"}
                className="textField"
                marginTop={"25px"}
                marginBottom={"25px"}
                paddingTop={0}
                paddingBottom={0}
                borderRadius={"60px"}
            >
                <Box
                    width={"100%"}
                    columns={12} 
                    xs={12} 
                    onBlur={onBlur}
                    component="form"
                    noValidate
                    autoComplete="on"
                >
                    {
                        editable && 
                        <ButtonField
                            className={"inputBox"}
                            transparentBackground={true}
                            elevation={0}
                            onClick={onChange_editButton}
                            Icon={EditIcon_}
                            iconSize={'small'}
                        />
                    }
                    <TextField
                        columns={12} 
                        xs={12} 
                        error={hasError}
                        width={"100%"}
                        inputRef={inputRef}
                        color='custom'
                        placeholder={placeHolder}
                        value={value}
                        disabled={(editable && !editing) || disabled}
                        onChange={onChange_}
                        id="filled-multiline-flexible"
                        label={label}
                        multiline
                        maxRows={rows ? rows : 100}
                        variant="filled"
                    />
                </Box>
            </Grid>
        </ThemeProvider>
    )
}; 

export default InputBox;
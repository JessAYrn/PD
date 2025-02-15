import React, {useState, useContext} from "react";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import InputBox from "../Fields/InputBox";
import ButtonField from "../Fields/Button";
import Typography from "@mui/material/Typography";
import { userNamePermitted } from "../../functionsAndConstants/Utils";
import { AppContext } from "../../Context";

const CreateAccount = (props) => {

    const { reloadDataIntoReduxStores} = props;

    const { actorState, setModalIsOpen, setModalIsLoading } = useContext(AppContext);

    const [username, setUsername] = useState("");
    const [hasError, setHasError] = useState(false);

    const [typography, setTypography] = useState("Enter Your Desired Username: ");

    const onSubmit = async () => {
        setModalIsLoading(true);
        const response = await actorState.backendActor.create(username);
        if(response.ok) {
            await reloadDataIntoReduxStores();
            setModalIsOpen(false);
        } else {
            setTypography (`${Object.keys(response.err)[0]}`);
            setUsername("");
            setHasError(true);
        }
        setModalIsLoading(false);
    };

    return(
        <>
        <Grid xs={12} display={"flex"} flexDirection={"column"} >
            <Typography flexWrap={"wrap"} width={"100%"} sx={{textAlign: 'center', marginBottom: '20px'}}>
                {typography}
            </Typography>
            <InputBox
                label="Enter Username"
                placeholder="Enter Username"
                onChange={(e) => {
                    setUsername(e);
                    setHasError(!userNamePermitted(e) || !e.length);
                }}
                hasError={hasError}
                value={username}
            />
            <ButtonField
                text="Create Account"
                onClick={onSubmit}
                disabled={hasError || username.length < 3}
            />
        </Grid>
        </>
    );
};

export default CreateAccount;
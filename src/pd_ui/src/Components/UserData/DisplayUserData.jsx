import React, {useContext} from 'react';
import { AppContext } from "../../Context";
import DataField from '../Fields/DataField';
import Grid from '@mui/material/Unstable_Grid2';
import { inTrillions, round2Decimals, shortenHexString } from '../../functionsAndConstants/Utils';
import { copyText } from '../../functionsAndConstants/walletFunctions/CopyWalletAddress';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DisplayQrCode from '../../Components/modal/DisplayQrCode';


const DisplayUserData = (props) => {

    const { journalState, walletState } = useContext(AppContext);
    const { userMetaData } = journalState;
    const { userPrincipal, cyclesBalance, rootCanisterPrincipal } = userMetaData;

    return (
        <Grid
        columns={12} 
        rowSpacing={8} 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        flexDirection={"column"}
        width={"300px"}
        >
            <Grid
            container 
            columns={12} 
            xs={11} 
            rowSpacing={8} 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            flexDirection={"column"}
            width={"100%"}
            >
                <DisplayQrCode/>
                <DataField
                    label={'User ID: '}
                    text={`${shortenHexString(userPrincipal)}`}
                    disabled={true} 
                    buttonColor="white"
                    labelColor="white"
                />
                <DataField
                    label={`Asset Canister ID (${round2Decimals(inTrillions(cyclesBalance))} T Cycles): `}
                    text={`${shortenHexString(rootCanisterPrincipal)}`}
                    buttonIcon={ContentCopyIcon}
                    buttonColor="white"
                    labelColor="white"
                    onClick={() => copyText(rootCanisterPrincipal)}
                />
            </Grid>
            <Grid width={"100%"} display={"flex"} justifyContent={"center"} alignItems={"center"} padding={"0"}>
                <DataField
                    label={'Wallet Address: '}
                    text={`${shortenHexString(walletState.walletData.address)}`}
                    isLoading={!walletState.dataHasBeenLoaded}
                    onClick={() => copyText( walletState.walletData.address )}
                    labelColor="white"
                    buttonColor="white"
                    buttonIcon={ContentCopyIcon}
                />
            </Grid>
        </Grid>
    )

};

export default DisplayUserData;
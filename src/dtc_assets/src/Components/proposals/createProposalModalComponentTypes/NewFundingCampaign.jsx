import React, {useContext, useState, useEffect} from 'react';
import InputBox from '../../Fields/InputBox';
import { Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { AppContext } from "../../../Context";
import MenuField from '../../Fields/MenuField';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { icpWalletAddressHasProperFormat, daysToNanoSeconds, getDateInNanoSeconds, toE8s } from '../../../functionsAndConstants/Utils';
import { e8sInOneICP, INPUT_BOX_FORMATS } from '../../../functionsAndConstants/Constants';
import DatePickerField from '../../Fields/DatePicker';
import ButtonField from '../../Fields/Button';
import DoneIcon from '@mui/icons-material/Done';
import { PROPOSAL_ACTIONS } from '../utils';
 

const NewFundingCampaign = (props) => {

    const { onSubmitProposal } = props;

    const { homePageState } = useContext(AppContext);

    const [recipientPrincipal, setRecipientPrincipal] = useState(null);
    const [recipientAccountId, setRecipientAccountId] = useState(null);
    const [percentageOfDaoRewardsAllocated, setPercentageOfDaoRewardsAllocated] = useState(null);
    const [description, setDescription] = useState(null);
    const [goal, setGoal] = useState(null);
    const [isALoan, setIsALoan] = useState(undefined);
    const [repaymentIntervalsInDays, setRepaymentIntervalsInDays] = useState(null);
    const [repaymentStartDate, setRepaymentStartDate] = useState(null);
    const [simpleInterestRate, setSimpleInterestRate] = useState(null);
    const [hasError_1, setHasError_1] = useState(false);
    const [hasError_2, setHasError_2] = useState(false);
    const [hasError_3, setHasError_3] = useState(false);
    const [hasError_4, setHasError_4] = useState(false);
    const [hasError_5, setHasError_5] = useState(false);
    const [hasError_6, setHasError_6] = useState(false);
    const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);

    const principalsMenuItemProps = homePageState?.canisterData?.profilesMetaData?.map(({userPrincipal}) => {
        return {
            text: userPrincipal,  
            onClick: () => setRecipientPrincipal(userPrincipal),
        }
    });

    const isALoanMenuItemProps = [
        { text: "Yes", onClick: () => setIsALoan(true)},
        { text: "No", onClick: () => setIsALoan(false)}
    ];

    useEffect(() => {
        const requiredFields = [recipientPrincipal, recipientAccountId, percentageOfDaoRewardsAllocated, description, goal, isALoan];
        if(isALoan) requiredFields.push(repaymentIntervalsInDays, repaymentStartDate, simpleInterestRate);
        if(requiredFields.includes(null)) setIsReadyToSubmit(false);
        else if(requiredFields.includes(undefined)) setIsReadyToSubmit(false);
        else if(hasError_1 || hasError_2 || hasError_3 || hasError_4 || hasError_5 || hasError_6) setIsReadyToSubmit(false);
        else setIsReadyToSubmit(true);
    },[recipientPrincipal, recipientAccountId, percentageOfDaoRewardsAllocated, description, goal, isALoan, repaymentIntervalsInDays, repaymentStartDate, simpleInterestRate]);

    const submitProposal = async () => {
        const payload = {
            goal: { icp: { e8s: toE8s(goal) } },
            recipient: { principalId: recipientPrincipal, accountId: recipientAccountId },
            percentageOfDaoRewardsAllocated: percentageOfDaoRewardsAllocated,
            description: description,
            repaymentIntervals: isALoan? [daysToNanoSeconds(repaymentIntervalsInDays )] : [],
            repaymentStartDate: isALoan? [getDateInNanoSeconds(repaymentStartDate)] : [],
            simpleInterestRate: isALoan? [simpleInterestRate] : []
        };
        await onSubmitProposal({[PROPOSAL_ACTIONS.CreateFundingCampaign]: {fundingCampaignInput :payload}});
    };

    return(
        <Grid xs={12} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
            <MenuField
                xs={8}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"left"}
                active={true}
                color={"custom"}
                label={"Recipient"}
                MenuIcon={KeyboardArrowDownIcon}
                menuItemProps={principalsMenuItemProps}
            />
            { recipientPrincipal && 
                <>
                    <Typography>{recipientPrincipal}</Typography> 
                    <InputBox
                        width={"100%"}
                        hasError={hasError_1}
                        label={"Percentage of DAO Rewards to Allocate"}
                        format={INPUT_BOX_FORMATS.numberFormat}
                        allowNegative={false}
                        maxDecimalPlaces={0}
                        maxValue={100}
                        omitMaxValueButton={true}
                        suffix={" %"}
                        value={percentageOfDaoRewardsAllocated}
                        onChange={(value) => {
                            setHasError_1(value > 100 || value === "NaN" || value === NaN || value === "" || value === 0);
                            setPercentageOfDaoRewardsAllocated(value);
                        }}
                    />
                </>
            }
            { percentageOfDaoRewardsAllocated && !hasError_1 &&
                <>
                    <InputBox
                        hasError={hasError_2}
                        width={"100%"}
                        label={"Goal"}
                        format={INPUT_BOX_FORMATS.numberFormat}
                        allowNegative={false}
                        suffix={" ICP"}
                        value={goal}
                        onChange={(value) => {
                            setHasError_2(value === "NaN" || value === NaN || value === "" || value === 0);
                            setGoal(value);
                        }}
                    />
                </>
            }
            { goal && 
                <InputBox
                    width={"100%"}
                    hasError={hasError_3}
                    label={"Account ID"}
                    format={INPUT_BOX_FORMATS.noFormat}
                    value={recipientAccountId}
                    onChange={(value) => {
                        setHasError_3(value === "" || !icpWalletAddressHasProperFormat(value));
                        setRecipientAccountId(value);
                    }}
                />
            }
            { recipientAccountId && !hasError_3 && 
                <InputBox
                    hasError={hasError_4}
                    width={"100%"}
                    label={"Description"}
                    format={INPUT_BOX_FORMATS.noFormat}
                    value={description}
                    rows={5}
                    onChange={(value) => {
                        setHasError_4(value === "");
                        setDescription(value);
                    }}
                />
            }
            { description &&
                <MenuField
                    xs={8}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"left"}
                    active={true}
                    color={"custom"}
                    label={"Is this a loan?"}
                    MenuIcon={KeyboardArrowDownIcon}
                    menuItemProps={isALoanMenuItemProps}
                />
            }
            { isALoan !== undefined && <Typography>This funding campaign {isALoan? "is a loan": "is NOT a loan"}</Typography> }
            {
                isALoan &&
                <>
                <InputBox
                    width={"100%"}
                    hasError={hasError_5}
                    label={"Repayment Intervals"}
                    format={INPUT_BOX_FORMATS.numberFormat}
                    allowNegative={false}
                    maxDecimalPlaces={0}
                    maxValue={30}
                    omitMaxValueButton={true}
                    suffix={" days"}
                    value={repaymentIntervalsInDays}
                    onChange={(value) => {
                        setHasError_5(value > 30 || value === "NaN" || value === NaN || value === "" || value === 0);
                        setRepaymentIntervalsInDays(value);
                    }}
                />
                { repaymentIntervalsInDays && !hasError_3 &&
                    <DatePickerField
                        width={"100% !important"}
                        value={repaymentStartDate}
                        label={"Repayment Start Date"}
                        disablePast={true}
                        onChange={(e) => {
                            const date = new Date(e);
                            console.log(date);
                            setRepaymentStartDate(date);
                        }}
                    />
                }
                { repaymentStartDate && 
                    <InputBox
                        hasError={hasError_6}
                        width={"100%"}
                        label={"Simple Interest Rate"}
                        format={INPUT_BOX_FORMATS.numberFormat}
                        allowNegative={false}
                        maxDecimalPlaces={0}
                        suffix={" %"}
                        onChange={(value) => {
                            setHasError_6(value === "NaN" || value === NaN || value === "" || value === 0);
                            setSimpleInterestRate(value);
                        }}
                    />
                }
                </>
            }
            { isReadyToSubmit && 
                <ButtonField
                    Icon={DoneIcon}
                    active={true}
                    text={'Submit proposal'}
                    onClick={submitProposal}
                /> 
            }
        </Grid>
    )
};

export default NewFundingCampaign;
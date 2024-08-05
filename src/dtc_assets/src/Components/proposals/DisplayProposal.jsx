import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import AccordionField from '../../Components/Fields/Accordion';
import Proposal from './Proposal';

const DisplayProposals = (props) => {
    let {proposals} = props;
    return (
        <>
            {
                proposals?.length > 0 && 
                <Grid xs={12} display="flex" justifyContent="center" alignItems="center" width={"100%"}>
                    <AccordionField>
                        {proposals?.map(([proposalId, proposal]) => {
                            let id = parseInt(proposalId);
                            let {action, finalized, proposer, executed, timeVotingPeriodEnds, timeInitiated, voteTally, votes} = proposal;
                            return (
                                <div 
                                    title={`Propsoal #${id}`}
                                    proposalId={id}
                                    proposer={proposer}
                                    action={action}
                                    timeInitiated={timeInitiated}
                                    timeVotingPeriodEnds={timeVotingPeriodEnds}
                                    finalized={finalized}
                                    executed={executed}
                                    votes={votes}
                                    voteTally={voteTally}
                                    CustomComponent={Proposal}
                                />
                            )
                        })}
                    </AccordionField>
                </Grid>
            }
        </>
    )

};

export default DisplayProposals;
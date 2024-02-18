import TreasuryTypes "../../Types/Treasury/types";
import MainTypes "../../Types/Main/types";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Float "mo:base/Float";
import Nat64 "mo:base/Nat64";
import Int64 "mo:base/Int64";
import NnsCyclesMinting "../../NNS/NnsCyclesMinting";
import Nat "mo:base/Nat";
import Hash "mo:base/Hash";


module{    


    private let nanosecondsInADay = 86_400_000_000_000;
    
    type XDRs = Float;

    public func tallyVotes({ treasuryUsersStakesArray : TreasuryTypes.UserStakesArray; proposal: MainTypes.Proposal;}):
    MainTypes.VotingResults {
        var yay: Nat64 = 0;
        var nay: Nat64 = 0;
        let proposalVotesHashMap = HashMap.fromIter<Text, MainTypes.Vote>(
            Iter.fromArray(proposal.votes), 
            Iter.size(Iter.fromArray(proposal.votes)), 
            Text.equal,
            Text.hash
        );
        let usersStakesIter = Iter.fromArray<(Principal, TreasuryTypes.UserStake)>(treasuryUsersStakesArray);
        for(userStakes in usersStakesIter){
            let (principal, {icp}) = userStakes;
            let icpNeuronsStakesIter = Iter.fromArray<(TreasuryTypes.NeuronIdAsNat, TreasuryTypes.NeuronStakeInfo)>(icp);
            for(icpNeuronStake in icpNeuronsStakesIter){
                let {voting_power} = icpNeuronStake.1;
                let vote = proposalVotesHashMap.get(Principal.toText(principal));
                switch(vote){
                    case null {};
                    case(? v){ let {adopt} = v; if(adopt) yay += voting_power else nay += voting_power; };
                };
            };
        };
        let total = yay + nay;
        return {yay; nay; total};
    };

    public func tallyAllProposalVotes({ treasuryUsersStakesArray : TreasuryTypes.UserStakesArray; proposals: MainTypes.ProposalsMap;}): 
    MainTypes.Proposals{

        Iter.iterate<(Nat,MainTypes.Proposal)>(
            proposals.entries(), 
            func((key, proposal) : (Nat,MainTypes.Proposal), _index) {
            let voteTally =  tallyVotes({treasuryUsersStakesArray; proposal});
            let updatedProposal = {proposal with voteTally = voteTally};
            proposals.put(key, updatedProposal);
        });
        return Iter.toArray(proposals.entries());
    };
}
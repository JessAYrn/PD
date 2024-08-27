import MainTypes "../../Types/Main/types";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Journal "../../Journal";
import Treasury "../../Treasury";

module{
    public func saveCurrentBalances(userProfilesMap: MainTypes.UserProfilesMap_V2, daoMetaData: MainTypes.DaoMetaData_V4): async (){
        let treasuryCanister : Treasury.Treasury = actor(daoMetaData.treasuryCanisterPrincipal);
        ignore treasuryCanister.saveCurrentBalances();
        let userProfilesArray = Iter.toArray(userProfilesMap.entries());
        var index = 0;
        while(index < userProfilesArray.size()){
            let (principal, profile) = userProfilesArray[index];
            let userTreasuryDeposits = await treasuryCanister.getUserTreasuryData(principal);
            let{canisterId} = profile;
            let userCansiter : Journal.Journal = actor(Principal.toText(canisterId));
            ignore userCansiter.saveCurrentBalances(userTreasuryDeposits.balances);
            index += 1;
        }
    };
}
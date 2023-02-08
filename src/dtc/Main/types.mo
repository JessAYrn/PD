import Journal "../Journal/Journal";
import Account "../Ledger/Account";
import NFT "../NFT/Dip-721-NFT-Container";
import Trie "mo:base/Trie";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";


module{

    public type Profile = {
        journal : Journal.Journal;
        email: ?Text;
        userName: ?Text;
        id: Principal;
        accountId: ?Account.AccountIdentifier;
        approved: ?Bool;
        treasuryMember: ?Bool;
        treasuryContribution: ?Nat64;
        monthsSpentAsTreasuryMember: ?Nat;
    };

    public type ProfileInput = {
        userName: ?Text;
        email: ?Text;
    };

    public type AmountAccepted = {
        accepted: Nat64
    };

    public type Nft = {
       nftCollection: NFT.Dip721NFT;
    };

    public type UserPermissions = {
        approved: Bool;
        treasuryMember: Bool;
        treasuryContribution: Nat64;
        monthsSpentAsTreasuryMember: Nat;
    };

    public type ProfilesApprovalStatuses = [(Text, Approved)];

    public type CanisterDataExport = {
        journalCount: Nat;
        managerCanisterPrincipal: Text;
        frontEndPrincipal: Text;
        backEndPrincipal: Text;
        lastRecordedBackEndCyclesBalance: Nat;
        backEndCyclesBurnRatePerDay: Nat;
        nftOwner: Text;
        nftId: Int;
        acceptingRequests: Bool;
        lastRecordedTime: Int;
        profilesMetaData: ProfilesApprovalStatuses;
        isOwner: Bool;
        currentCyclesBalance_backend: Nat;
        currentCyclesBalance_frontend: Nat;
        supportMode: Bool;
    };

    public type CanisterData = {
        managerCanisterPrincipal: Text;
        frontEndPrincipal: Text;
        backEndPrincipal: Text;
        lastRecordedBackEndCyclesBalance: Nat;
        backEndCyclesBurnRatePerDay: Nat;
        nftOwner: Text;
        nftId: Int;
        acceptingRequests: Bool;
        lastRecordedTime: Int;
    };

    public type Approved = Bool;

    public type RequestsForAccess = [(Text, Approved)];

    public type CanisterCyclesBalances = {
        backendCyclesBalance : Nat;
        frontendCyclesBalance: Nat
    };

    public type ProfilesTree = Trie.Trie<Principal, Profile>;

    public type ProfilesMap = HashMap.HashMap<Principal, Profile>;

    public type ProfilesArray = [(Principal, Profile)];

    public type NftCollectionsTree = Trie.Trie<Nat, Nft>;

}
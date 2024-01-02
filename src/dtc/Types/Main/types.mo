import Account "../../NNS/Account";
import Trie "mo:base/Trie";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import JournalTypes "../Journal/types";
import TreasuryTypes "../Treasury/types";
import NotificationTypes "../Notifications/types";
import IC "../IC/types";
import Ledger "../../NNS/Ledger";


module{

    public let self : IC.Self = actor "aaaaa-aa";

    public let ledger  : Ledger.Interface  = actor(Ledger.CANISTER_ID);

    public let heartBeatInterval : Nat64 = 100;

    public let heartBeatInterval_refill : Nat64 = 25000;

    public let oneICP : Nat64 = 100_000_000;

    public let nanosecondsInADay = 86400000000000;

    public let daysInAMonth = 30;

    public type JournalData = {
        userJournalData : ([JournalTypes.JournalEntryExportKeyValuePair], JournalTypes.Bio,); 
        email: ?Text; 
        userName: ?Text;
        principal: Text;
    };

    public type Error = {
        #NotAuthorizedToCreateProposals;
        #NotAuthorizedToVoteOnThisProposal;
        #VoteHasAlreadyBeenSubmitted;
        #NotAuthorized;
        #PorposalHasExpired;
        #NotAuthorizedToAccessData;
        #NoProfileFound;
        #InsufficientFunds;
    };

    public type UserProfile = {
        canisterId : Principal;
        email: ? Text;
        userName : ? Text;
        userPrincipal: Principal;
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

    public type UserPermissions = {
        approved: Bool;
        treasuryMember: Bool;
        treasuryContribution: Nat64;
        monthsSpentAsTreasuryMember: Nat;
    };
    

    public type ProfileMetaData = {userPrincipal : Text; canisterId : Text; approvalStatus: Bool;};

    public type ProfilesMetaData = [ProfileMetaData];

    public type AdminData = {percentage : Nat};

    public type CanisterDataExport = {
        journalCount: Nat;
        treasuryCanisterPrincipal: Text;
        managerCanisterPrincipal: Text;
        frontEndPrincipal: Text;
        backEndPrincipal: Text;
        lastRecordedBackEndCyclesBalance: Nat;
        backEndCyclesBurnRatePerDay: Nat;
        admin: [(Text, AdminData)];
        proposals: Proposals;
        acceptingRequests: Bool;
        lastRecordedTime: Int;
        profilesMetaData: ProfilesMetaData;
        isAdmin: Bool;
        supportMode: Bool;
        releaseVersion: Nat;
        requestsForAccess: RequestsForAccess;
    };

    public type DaoMetaData = {
        managerCanisterPrincipal: Text; 
        treasuryCanisterPrincipal: Text;
        frontEndPrincipal: Text;
        backEndPrincipal: Text;
        lastRecordedBackEndCyclesBalance: Nat;
        backEndCyclesBurnRatePerDay: Nat;
        nftOwner: Text;
        nftId: Int;
        acceptingRequests: Bool;
        lastRecordedTime: Int;
        supportMode: Bool;
        requestsForAccess: RequestsForAccess;
        defaultControllers: [Principal];
    };

    public type DaoMetaData_V2 = {
        managerCanisterPrincipal: Text; 
        treasuryCanisterPrincipal: Text;
        frontEndPrincipal: Text;
        backEndPrincipal: Text;
        lastRecordedBackEndCyclesBalance: Nat;
        backEndCyclesBurnRatePerDay: Nat;
        admin: [(Text, AdminData)];
        acceptingRequests: Bool;
        lastRecordedTime: Int;
        supportMode: Bool;
        requestsForAccess: RequestsForAccess;
        defaultControllers: [Principal];
    };

    public type Approved = Bool;

    public type RequestsForAccess = [(Text, Approved)];

    public type CanisterCyclesBalances = {
        currentCyclesBalance_backend: Nat;
        currentCyclesBalance_frontend: Nat;
        currentCyclesBalance_manager: Nat;
    };


    public type UserProfilesMap = HashMap.HashMap<Principal, UserProfile>;

    public type UserProfilesArray = [(Principal, UserProfile)];

    public type Proposals = [(Nat,Proposal)];

    public type ProposalsMap = HashMap.HashMap<Nat, Proposal>;

    public type ProposalPayload = {
        principal : ?Text;
        amount : ?Nat64; 
    };
    
    public type VotingResults = {
        yay: Nat64;
        nay: Nat64;
        total: Nat64;
    };

    public type Proposal = {
        votes: [(Text, Vote)];
        voteTally: VotingResults;
        action: ProposalActions;
        payload: ProposalPayload;
        proposer: Text;
        timeInitiated: Int;
        timeExecuted: ?Int;
    };

    public type ProposalActions = {
        #AddAdmin;
        #RemoveAdmin;
        #UpgradeApp;
        #DissolveIcpNeuron;
        #FollowIcpNeuron;
        #SpawnIcpNeuron;
        #DispurseIcpNeuron;
        #PurchaseCycles;
    };

    public type Vote = { adopt: Bool };


    public let DEFAULT_DAO_METADATA_V2: DaoMetaData_V2 = {
        managerCanisterPrincipal = "Null";
        treasuryCanisterPrincipal = "Null";
        frontEndPrincipal = "Null";
        backEndPrincipal = "Null";
        lastRecordedBackEndCyclesBalance = 0;
        backEndCyclesBurnRatePerDay = 0;
        admin = [];
        acceptingRequests = true;
        lastRecordedTime = 0;
        supportMode = false;
        requestsForAccess = [];
        defaultControllers = [];
    };

    public type Interface = actor {
        scheduleCanistersToBeUpdatedExceptBackend: () -> async ();
    };

}
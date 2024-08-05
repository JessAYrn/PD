export const requestsForAccessTableColumns = [
    { 
        field: 'id', 
        headerName: '#', 
        width: 90 
    },
    {
      field: 'userPrincipal',
      headerName: 'User Principal',
      width: 200,
      editable: false,
    },
    {
        field: 'approvalStatus',
        headerName: 'Approved',
        width: 200,
        type: 'boolean'
    }
];

export const usersTableColumns = [
    { 
        field: 'id', 
        headerName: '#', 
        width: 90 
    },
    {
      field: 'userPrincipal',
      headerName: 'User Identity',
      width: 200,
      editable: false,
    },
    {
        field: 'canisterId',
        headerName: 'Root Canister',
        width: 200,
        editable: false,
    },
    {
        field: 'userName',
        headerName: 'User Name',
        width: 200,
        editable: false,
    },
    {
        field: 'approvalStatus',
        headerName: 'Subsidized',
        width: 200,
        type: 'boolean'
    }
];

export const mapRequestsForAccessToTableRows = (requestsForAccess) => {
    const requestsForAccess_ = requestsForAccess.map(([userPrincipal, approvalStatus], index) => {
        return {
            id: index,
            userPrincipal: userPrincipal,
            approvalStatus: approvalStatus
        }
    });
    return requestsForAccess_;
}

export const mapUsersProfileDataToTableRows = (usersProfileData) => {
    const profileMetaData = usersProfileData.map((metaData, index) => {
        return {
            id: index,
            ...metaData
        }
    });
    return profileMetaData;
};


export const mapBackendCanisterDataToFrontEndObj = (props) => {
    const {
        profilesMetaData,
        backEndCyclesBurnRatePerDay,
        backEndPrincipal,
        frontEndPrincipal,
        lastRecordedBackEndCyclesBalance,
        isAdmin,
        proposals,
        supportMode,
        acceptingRequests,
        journalCount,
        requestsForAccess,
        treasuryCanisterPrincipal,
        releaseVersionLoaded,
        releaseVersionInstalled,
        nftId,
        founder,
        managerCanisterPrincipal,
    } = props;

    const requestsForAccess_ = mapRequestsForAccessToTableRows(requestsForAccess);
    const profilesMetaData_ = mapUsersProfileDataToTableRows(profilesMetaData);
    const proposals_ = proposals.sort(([proposalId_a, {timeInitiated: timeInitiated_a}], [proposalId_b, {timeInitiated: timeInitiated_b}]) => {
        if(BigInt(timeInitiated_a) > BigInt(timeInitiated_b)) return -1
        else return 1
    });

    return {
        profilesMetaData: profilesMetaData_,
        backEndCyclesBurnRatePerDay: parseInt(backEndCyclesBurnRatePerDay),
        backEndPrincipal: backEndPrincipal,
        frontEndPrincipal: frontEndPrincipal,
        treasuryCanisterPrincipal: treasuryCanisterPrincipal,
        managerCanisterPrincipal: managerCanisterPrincipal,
        lastRecordedBackEndCyclesBalance: parseInt(lastRecordedBackEndCyclesBalance),
        isAdmin: isAdmin,
        proposals: proposals_,
        supportMode: supportMode,
        acceptingRequests: acceptingRequests,
        journalCount: parseInt(journalCount),
        requestsForAccess: requestsForAccess_,
        releaseVersionLoaded: parseInt(releaseVersionLoaded),
        releaseVersionInstalled: parseInt(releaseVersionInstalled),
        nftId: nftId[0] ? parseInt(nftId[0]) : null,
        founder
    }
}; 
import Governance "../../NNS/Governance";
import IC "../../Types/IC/types";
import EcdsaHelperMethods "../ECDSA/ECDSAHelperMethods";
import Account "../../Serializers/Account";
import Principal "mo:base/Principal";
import Blob "mo:base/Blob";
import Cycles "mo:base/ExperimentalCycles";
import Nat64 "mo:base/Nat64";
import Error "mo:base/Error";
import Hex "../../Serializers/Hex";
import Ledger "../../NNS/Ledger";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Result "mo:base/Result";
import Iter "mo:base/Iter";
import Buffer "mo:base/Buffer";
import Text "mo:base/Text";
import Debug "mo:base/Debug";
import Array "mo:base/Array";
import RepresentationIndependentHash "../../Hash/RepresentationIndependentHash";
import Value "../../Serializers/CBOR/Value";
import Errors "../../Serializers/CBOR/Errors";
import TreasuryTypes "../../Types/Treasury/types";
import Decoder "../../Serializers/CBOR/Decoder";

module {

    let EMPTY : Nat64 = 0;
    let FORK : Nat64 = 1;
    let LABELED : Nat64 = 2;
    let LEAF : Nat64 = 3;
    let PRUNED : Nat64 = 4;

    public type Path = [Blob];

    public type Tree = [Value.Value];

    let ledger : Ledger.Interface = actor (Ledger.CANISTER_ID);
    let txFee : Nat64 = 10_000;

    public type TransformFnSignature = query { response : IC.http_response; context: Blob } -> async IC.http_response;

    private func transferIcpToNeuron(amount: Nat64, memo: Nat64): 
    async {public_key: Blob; selfAuthPrincipal: Principal;} {
        let {public_key} = await EcdsaHelperMethods.getPublicKey(null);
        let {principalAsBlob} = Account.getSelfAuthenticatingPrincipal(public_key);
        let principal = Principal.fromBlob(principalAsBlob);
        let treasuryNeuronSubaccount = Account.neuronSubaccount(principal, memo);
        let treasuryNeuronAccountId = Account.accountIdentifier(Principal.fromText(Governance.CANISTER_ID), treasuryNeuronSubaccount);

        let res = await ledger.transfer({
          memo = memo;
          from_subaccount = null;
          to = treasuryNeuronAccountId;
          amount = { e8s = amount };
          fee = { e8s = txFee };
          created_at_time = ?{ timestamp_nanos = Nat64.fromNat(Int.abs(Time.now())) };
        });

        switch(res){
            case(#Ok(_)) { return {public_key; selfAuthPrincipal = principal}; };
            case(#Err(_)) { Debug.trap("Error in transferIcpToNeuron")};
        };
    };

    public func createOrIncreaseNeuron( amount: Nat64, memo: Nat64, transformFn: TransformFnSignature):
    async {response: IC.http_response; requestId: Blob; ingress_expiry: Nat64;}{
        let { public_key; selfAuthPrincipal; } = await transferIcpToNeuron(amount, memo);
        await manageNeuron(
            {
                id = null; 
                command = ?#ClaimOrRefresh( {by = ?#MemoAndController( {controller = ?selfAuthPrincipal; memo} )} );
                neuron_id_or_subaccount = null;
            }, 
            selfAuthPrincipal, 
            public_key, 
            transformFn
        );
    };

    public func manageNeuron( args: Governance.ManageNeuron, selfAuthPrincipal: Principal, public_key: Blob, transformFn: TransformFnSignature): 
    async {response: IC.http_response; requestId: Blob; ingress_expiry: Nat64;}{
    
        let sender = selfAuthPrincipal;
        let canister_id: Principal = Principal.fromText(Governance.CANISTER_ID);
        let method_name: Text = "manage_neuron";
        let request = EcdsaHelperMethods.prepareCanisterCallViaEcdsa({sender; public_key; canister_id; args = to_candid(args); method_name;});
        let {envelopeCborEncoded} = await EcdsaHelperMethods.getSignedEnvelope(request);
        let headers = [ {name = "content-type"; value= "application/cbor"}];
        let {request_url = url; envelope_content} = request;
        let body = ?Blob.fromArray(envelopeCborEncoded);
        let method = #post;
        let max_response_bytes: ?Nat64 = ?Nat64.fromNat(1024 * 1024);
        let transform = ?{ function = transformFn; context = Blob.fromArray([]); };
        let ic : IC.Self = actor("aaaaa-aa");
        let http_request = {body; url; headers; transform; method; max_response_bytes};
        Cycles.add(20_949_972_000);
        let {status; body = responseBody; headers = headers_;} : IC.http_response = await ic.http_request(http_request);
        let response = { status; body = responseBody; headers = headers_; };
        let envelopeContentInMajorType5Format = EcdsaHelperMethods.formatEnvelopeContentForRepIndHash(envelope_content);
        let {ingress_expiry} = envelope_content;
        let requestId: Blob = Blob.fromArray(RepresentationIndependentHash.hash_val(envelopeContentInMajorType5Format));
        return {response; requestId; ingress_expiry;};
    };

    public func getFullNeuron(args: TreasuryTypes.NeuronId, transformFn: TransformFnSignature):
    async {response: IC.http_response; requestId: Blob; ingress_expiry: Nat64;}{
        let {public_key} = await EcdsaHelperMethods.getPublicKey(null);
        let {principalAsBlob} = Account.getSelfAuthenticatingPrincipal(public_key);
        let sender = Principal.fromBlob(principalAsBlob);
        let canister_id: Principal = Principal.fromText(Governance.CANISTER_ID);
        let method_name: Text = "get_full_neuron";
        let request = EcdsaHelperMethods.prepareCanisterCallViaEcdsa({sender; public_key; canister_id; args = to_candid(args); method_name;});
        let {envelopeCborEncoded} = await EcdsaHelperMethods.getSignedEnvelope(request);
        let headers = [ {name = "content-type"; value= "application/cbor"}];    
        let {request_url = url; envelope_content} = request;
        let body = ?Blob.fromArray(envelopeCborEncoded);
        let method = #post;
        let max_response_bytes: ?Nat64 = ?Nat64.fromNat(1024 * 1024);
        let transform = ?{ function = transformFn; context = Blob.fromArray([]); };
        let ic : IC.Self = actor("aaaaa-aa");
        let http_request = {body; url; headers; transform; method; max_response_bytes};
        Cycles.add(20_949_972_000);
        let {status; body = responseBody; headers = headers_;} : IC.http_response = await ic.http_request(http_request);
        let response = { status; body = responseBody; headers = headers_; };
        let envelopeContentInMajorType5Format = EcdsaHelperMethods.formatEnvelopeContentForRepIndHash(envelope_content);
        let {ingress_expiry} = envelope_content;
        let requestId: Blob = Blob.fromArray(RepresentationIndependentHash.hash_val(envelopeContentInMajorType5Format));
        return {response; requestId; ingress_expiry;};
    };

    public func readRequestState(paths: [[Blob]], transformFn: TransformFnSignature): async IC.http_response {
        let {public_key} = await EcdsaHelperMethods.getPublicKey(null);
        let {principalAsBlob} =  Account.getSelfAuthenticatingPrincipal(public_key);
        let sender = Principal.fromBlob(principalAsBlob);
        let canister_id: Principal = Principal.fromText(Governance.CANISTER_ID);
        let request = EcdsaHelperMethods.prepareCanisterReadStateCallViaEcdsa({sender; canister_id; paths; public_key;});
        let {envelopeCborEncoded} = await EcdsaHelperMethods.getSignedEnvelopeReadState(request);
        let headers = [ {name = "content-type"; value= "application/cbor"}];
        let {request_url = url; envelope_content} = request;
        let body = ?Blob.fromArray(envelopeCborEncoded);
        let method = #post;
        let max_response_bytes: ?Nat64 = ?Nat64.fromNat(1024 * 1024);
        let transform_context = { function = transformFn; context = Blob.fromArray([]); };
        let transform = ?transform_context;
        let ic : IC.Self = actor("aaaaa-aa");
        let http_request = {body; url; headers; transform; method; max_response_bytes};
        Cycles.add(20_949_972_000);
        let {status; body = responseBody; headers = headers_;} : IC.http_response = await ic.http_request(http_request);
    };

    public func readRequestResponse(cachedRequestInfo: TreasuryTypes.CachedRequest, transformFn: TransformFnSignature): 
    async TreasuryTypes.RequestResponses {
        let {requestId; expiry; expectedResponseType} = cachedRequestInfo;
        if(Nat64.toNat(expiry) < Time.now()) { Debug.trap("Request expired") };
        let path = [Text.encodeUtf8("request_status"),requestId, Text.encodeUtf8("reply")];
        let {body} = await readRequestState([path], transformFn);
        switch(from_response_blob(body)){
            case (#err(e)) { return Debug.trap("Certificate retrieval unsuccessful") };
            case(#ok(cert)){
                switch(cert.lookup(path)){
                    case(null) { return Debug.trap("Request lookup unsuccessful") };
                    case(?replyEncoded) {
                        let reply_1: ?Governance.ManageNeuronResponse = from_candid(replyEncoded);
                        let reply_2: ?Governance.Result_2 = from_candid(replyEncoded);
                        switch(reply_1){
                            case(?reply_1_) { 
                                let ?command = reply_1_.command else { return Debug.trap("Response candid decoding took unexpected form") };
                                switch(expectedResponseType){
                                    case(#CreateOrIncreaseNeuronResponse){
                                        switch(command){
                                            case(#ClaimOrRefresh(response)) { return #CreateOrIncreaseNeuronResponse(response) };
                                            case(_) { return Debug.trap("Unexpected command type") };
                                        };
                                    };
                                    case(_){ return command};
                                };
                            };
                            case(null) {
                                switch(reply_2){
                                    case(?reply_2_) { return #GetFullNeuronResponse(reply_2_) };
                                    case(null) { return Debug.trap("Response candid decoding took unexpected form") };
                                };
                            };
                        };
                    };
                };
            };
        };
            
    };

    public func from_response_blob(response: Blob): Result.Result<Certificate, Text> {
        let ?content_map = get_content_map( response ) else { return #err("error in from_response_blob() at position: 0") };
        for ( field in content_map.vals() ){
            switch( field.0 ){
            case( #majorType3 name ) if ( name == "certificate" ){
                let #majorType2( arr ) = field.1 else { return #err("1") };
                let ?cert_map = get_content_map( Blob.fromArray( arr ) ) else { return #err("error in from_response_blob() at position: 2") };
                for ( entry in cert_map.vals() ) {
                switch( entry.0 ){
                    case( #majorType3 e_name ) if ( e_name == "tree" ){
                    let #majorType4( elems ) = entry.1 else { return #err("error in from_response_blob() at position: 3") };
                    return #ok(Certificate( elems ));
                    };
                    case _ ();
                };
                }
            };
            case _ ();
            }
        };
        #err("error in from_response_blob() at position: 4")
    };

    public func get_content_map(blob: Blob): ?[(Value.Value,Value.Value)] {
        let #ok( cbor ) = Decoder.decode( blob ) else { return null };
        let #majorType6( rec ) = cbor else { return null };
        if ( rec.tag != 55_799 ) return null;
        let #majorType5( map ) = rec.value else { return null };
        ?map
    };

    public class Certificate(tree: Tree) = {

        public func lookup(path: Path) : ?Blob = lookup_path(path, tree, 0, path.size());

        func lookup_path(path: Path, tree: Tree, offset: Nat, size: Nat): ?Blob {
            let #majorType0( tag ) = tree[0] else { Debug.trap("error in lookup_path() function at position: 0") };
            if ( size == 0 ){
                if ( tag == LEAF ){
                    let #majorType2( bytes ) = tree[1] else { Debug.trap("error in lookup_path() function at position: 1") };
                    return ?Blob.fromArray( bytes )
                } else Debug.trap("error in lookup_path() function at position: 2");
            };
            switch( find_label(path[offset], flatten_forks(tree)) ){
                case( ?t ) lookup_path(path, t, offset+1, size-1);
                case null Debug.trap("error in lookup_path() function at position: 3")
            }
        };

        func flatten_forks(t: Tree): [Tree] {
            let #majorType0( tag ) = t[0] else { return [] };
            if( tag == EMPTY ) []
            else if ( tag == FORK ){
                let #majorType4( l_val ) = t[1] else { return [] };
                let #majorType4( r_val ) = t[2] else { return [] };
                let buffer = Buffer.fromArray<Tree>( flatten_forks( l_val ) );
                buffer.append( Buffer.fromArray<Tree>( flatten_forks( r_val ) ) );
                Buffer.toArray( buffer )
            }
            else [t]
        };

        func find_label(key: Blob, trees: [Tree]): ?Tree {
            if ( trees.size() == 0 ) return null;
            for ( tree in trees.vals() ){
                let #majorType0( tag ) = tree[0] else { return null };
                if ( tag == LABELED ){
                    let #majorType2( bytes ) = tree[1] else { return null };
                    let label_ : Blob = Blob.fromArray( bytes );
                    if ( label_ == key ){
                        let #majorType4( labeled_tree ) = tree[2] else { return null };
                        return ?labeled_tree
                    }
                }
            };
            null
        };
    };
};
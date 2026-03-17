exports.GetCounsellorId = (request)=>{
    const {counsellorId} = request.params;

    if(!counsellorId){
        throw new Error("Counsellor Id not provided");
    }

    return counsellorId;
}
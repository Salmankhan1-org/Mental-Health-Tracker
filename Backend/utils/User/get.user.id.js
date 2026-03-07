exports.GetUserId = (request)=>{
    const userId = request?.user?._id;
    return userId;
    
}

exports.GetUserEmail= (request)=>{
    const email = request?.user?.email;
    return email;
    
}
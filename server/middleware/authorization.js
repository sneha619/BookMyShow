const authorizedRoles = (...allowedUsers) => (req, res, next) => {
    try{
        
        const role = req.user?.role;

        if(!allowedUsers.includes(role)){
            return res.status(403).send('Unauthorized access');
        }
        next();
    }catch(e){
        res.status(500).send(e);
    }
}

export default authorizedRoles;
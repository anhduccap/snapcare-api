const UserSchema = require('../../models/user/user');

exports.getUser = async function(userId) {
    return await getUserById(userId);
}
    
async function getUserById(userId) {
    let userList = await User.find({_id: userId})
        .catch(err => {throw err});
    return userList;
}
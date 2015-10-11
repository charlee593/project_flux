Groups = new Mongo.Collection('groups');

validateGroup = function (group) {
  var errors = {};

  if (!group.title)
    errors.title = "Please fill in a headline";

  return errors;
}

Meteor.methods({
  groupInsert: function(groupAttributes) {
    check(this.userId, String);
    check(groupAttributes, {
      title: String,
      description: String,
      _id: String
    });

    if(!groupAttributes._id){
      delete groupAttributes._id;
    }
    
    var errors = validatePost(groupAttributes);
    if (errors.title)
      throw new Meteor.Error('invalid-post', "You must set a title");

    var groupWithSameId = Groups.findOne(groupAttributes._id);
    if (groupWithSameId) {
      return {
        groupExists: true,
        _id: groupWithSameId._id
      }
    }
    
    var user = Meteor.user();
    var group = _.extend(groupAttributes, {
      userId: user._id, 
      author: user.username, 
      submitted: new Date()
    });
    
    var groupId = Groups.insert(group);
    
    return {
      _id: groupId
    };
  }
});

GroupPosts = new Mongo.Collection('GroupPosts');

Meteor.methods({
  groupPostsInsert: function(groupPostRelation) {
    check(this.userId, String);
    check(groupPostRelation, {
      postId: String,
      groupId: String
    });
    
    var relationWithSameGroup = GroupPosts.findOne({groupId: groupPostRelation.groupId});

    if (relationWithSameGroup) {
      GroupPosts.update({
        _id: relationWithSameGroup._id, 
        posts: {$ne: this.userId}
      }, {
        $addToSet: {posts: groupPostRelation.postId}
      });
      
      return relationWithSameGroup._id;
    }
    
    var user = Meteor.user();
    var relation = {
      groupId: groupPostRelation.groupId,
      userId: user._id, 
      author: user.username, 
      submitted: new Date(),
      posts: [groupPostRelation.postId]
    };
    
    var relationId = GroupPosts.insert(relation);
    
    return relationId;
  }
});

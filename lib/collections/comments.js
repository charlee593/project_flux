Comments = new Mongo.Collection('comments');

Meteor.methods({
  commentInsert: function(commentAttributes) {

    check(this.userId, String);
    check(commentAttributes, {
      postId: String,
      body: String
    });

    // console.log("hello");

    // Groups.insert("5WEghfw6wmSYxpK3i", {$set: {title: "PSGjj1"}});
    
    // var user = Meteor.user();
    // var post = Posts.findOne(commentAttributes.postId);

    // if (!post)
    //   throw new Meteor.Error('invalid-comment', 'You must comment on a post');
    
    // comment = _.extend(commentAttributes, {
    //   userId: user._id,
    //   author: user.username,
    //   submitted: new Date()
    // });
    
    // // update the post with the number of comments
    // Posts.update(comment.postId, {$inc: {commentsCount: 1}});
    
    // // create the comment, save the id
    // comment._id = Comments.insert(comment);
    
    // // now create a notification, informing the user that there's been a comment
    // createCommentNotification(comment);
    
    // return comment._id;
  }
});

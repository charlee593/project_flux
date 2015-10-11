Meteor.publish('posts', function(options) {
  check(options, {
    sort: Object,
    limit: Number
  });
  return Posts.find({}, options);
});

Meteor.publish('groups', function() {
  return Groups.find({}); 
});

Meteor.publish('singlePost', function(id) {
  check(id, String);
  return Posts.find(id);
});

Meteor.publish('singleGroup', function(id) {
  check(id, String);
  return Groups.find(id);
});

Meteor.publish('comments', function(postId) {
  check(postId, String);
  return Comments.find({postId: postId});
});

Meteor.publish('myGroups', function() {
  var groups = Groups.find({userId: this.userId});
  return groups;
});

Meteor.publish('groupPosts', function(groupId) {
  check(groupId, String);
  var posts = GroupPosts.find({groupId: groupId}).fetch();
  if(_.isEmpty(posts) || _.isEmpty(posts[0].posts)){
    return this.ready();
  }
  return Posts.find({_id: {$in: posts[0].posts}});
});

Meteor.publish('subscribedGroups', function() {
  var subscriptions = Subscriptions.find({userId: this.userId});
  if(_.isEmpty(subscriptions.fetch())){
    return this.ready();
  }
  return Groups.find({_id: {$in: subscriptions.fetch()[0].groups}});
});

Meteor.publish('subscriptions', function() {
  return Subscriptions.find({userId: this.userId});
});

Meteor.publish('notifications', function() {
  return Notifications.find({userId: this.userId, read: false});
});

Subscriptions = new Mongo.Collection('subscriptions');

Subscriptions.allow({
  update: function(userId, subscription) { return ownsSubscription(userId, subscription); }
});

Meteor.methods({
  subscriptionInsert: function(groupId) {
    check(this.userId, String);
    check(groupId, String);

    var existingSubscription = Subscriptions.findOne({userId: this.userId});

    if (existingSubscription) {
      Subscriptions.update({
        _id: existingSubscription._id, 
        groups: {$ne: groupId}
      }, {
        $addToSet: {groups: groupId}
      });
      
      return existingSubscription._id;
    }
    
    var user = Meteor.user();
    var newSubscription = {
      userId: user._id, 
      author: user.username, 
      submitted: new Date(),
      groups: [groupId]
    };
    
    var newSubscription = Subscriptions.insert(newSubscription);
    
    return newSubscription;
  }
});

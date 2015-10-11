Template.groupItem.helpers({
  showRouteClass: function(/* route names */) {
    var args = Array.prototype.slice.call(arguments, 0);
    args.pop();
    
    var show = _.any(args, function(name) {
      return Router.current() && Router.current().route.getName() === name
    });
    
    return show && 'show';
  },
  subscriptionClass: function() {
    var subscriptions = Subscriptions.find();
    if(!_.isEmpty(subscriptions.fetch()) && _.include(subscriptions.fetch()[0].groups, this._id)){
    	return 'unsubscribe';
    }
    return 'subscribe';
  }
});

Template.groupItem.events({
  'click .subscribe': function(e) {
    e.preventDefault();
    Meteor.call('subscriptionInsert', this._id);
    $('#subcribeButton').text('Unsubscribe');
    $('#subcribeButton').addClass("btn-danger");
  },
  'click .unsubscribe': function(e) {
    e.preventDefault();
    var subscription = Subscriptions.find().fetch()[0];
    var removedCurrGroupArray = _.without(subscription.groups, _.findWhere(subscription.groups, this._id));
    var subscriptionProperties = {
      groups: removedCurrGroupArray
    }
    Subscriptions.update(subscription._id, {$set: subscriptionProperties});
    $('#subcribeButton').text('Subscribe');
    $('#subcribeButton').removeClass("btn-danger");
  }
});

Template.groupItem.rendered = function(){
  	var subscriptions = Subscriptions.find();
  	if(!_.isEmpty(subscriptions.fetch()) && _.include(subscriptions.fetch()[0].groups, this.data._id)){
    	$('#subcribeButton').text('Unsubscribe');
    	$('#subcribeButton').addClass("btn-danger");
    }
};
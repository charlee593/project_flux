Template.groupSubmit.onCreated(function() {
  Session.set('groupSubmitErrors', {});
});

Template.groupSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('groupSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('groupSubmitErrors')[field] ? 'has-error' : '';
  }
});

Template.groupSubmit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var group = {
      title: $(e.target).find('[name=title]').val(),
      description: $(e.target).find('[name=description]').val()
    };

    group._id  = "" || $(e.target).find('[name=groupId]').val();

    var errors = validatePost(group);
    if (errors.title)
      return Session.set('groupSubmitErrors', errors);
    
    Meteor.call('groupInsert', group, function(error, result) {
      // display the error to the user and abort
      if (error)
        return throwError(error.reason);
      
      // show this result but route anyway
      if (result.groupExists)
        throwError('This URL has already been posted');
      
      Router.go('groupPage', {_id: result._id});  
    });
  }
});
Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() { 
    return [Meteor.subscribe('notifications')]
  }
});

GroupListController = RouteController.extend({
  template: 'groupsList',
  subscriptions: function() {
    this.groupsSub = Meteor.subscribe('groups');
  },
  groups: function() {
    return Groups.find({});
  },
  data: function() {
    return {
      groups: this.groups(),
      ready: this.groupsSub.ready
    };
  }
});

SubscriptionController = RouteController.extend({
  template: 'groupsList',
  subscriptions: function() {
    this.subscribedGroups = Meteor.subscribe('subscribedGroups');
  },
  groups: function() {
    return Groups.find();
  },
  data: function() {
    return {
      groups: this.groups(),
      ready: this.subscribedGroups.ready
    };
  }
});

PostSubmitController = RouteController.extend({
  template: 'postSubmit',
  subscriptions: function() {
    this.myGroupsSub = Meteor.subscribe('myGroups');
  },
  myGroups: function() {
    if(_.isEmpty(Groups.find().fetch())){
      return [];
    }
    return Groups.find();
  },
  data: function() {
    return {
      groups: this.myGroups(),
      ready: this.myGroupsSub.ready
    };
  }
});

PostsListController = RouteController.extend({
  template: 'postsList',
  increment: 5, 
  postsLimit: function() { 
    return parseInt(this.params.postsLimit) || this.increment; 
  },
  findOptions: function() {
    return {sort: this.sort, limit: this.postsLimit()};
  },
  subscriptions: function() {
    this.postsSub = Meteor.subscribe('posts', this.findOptions());
  },
  posts: function() {
    return Posts.find({}, this.findOptions());
  },
  data: function() {
    var hasMore = this.posts().count() === this.postsLimit();
    return {
      posts: this.posts(),
      ready: this.postsSub.ready,
      nextPath: hasMore ? this.nextPath() : null
    };
  }
});

NewPostsController = PostsListController.extend({
  sort: {submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.newPosts.path({postsLimit: this.postsLimit() + this.increment})
  }
});

BestPostsController = PostsListController.extend({
  sort: {votes: -1, submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.bestPosts.path({postsLimit: this.postsLimit() + this.increment})
  }
});

Router.route('/', {
  name: 'home',
  controller: NewPostsController
});

Router.route('/new/:postsLimit?', {name: 'newPosts'});

Router.route('/best/:postsLimit?', {name: 'bestPosts'});

Router.route('/groups', {
  name: 'groupsList',
  controller: GroupListController
});

Router.route('/posts/:_id', {
  name: 'postPage',
  waitOn: function() {
    return [
      Meteor.subscribe('singlePost', this.params._id),
      Meteor.subscribe('comments', this.params._id)
    ];
  },
  data: function() { return Posts.findOne(this.params._id); }
});

Router.route('/subscriptions', {
  name: 'subcribedGroups',
  controller: SubscriptionController
});

Router.route('/groups/:_id', {
  name: 'groupPage',
  waitOn: function() {
    return [
      Meteor.subscribe('singleGroup', this.params._id),
      Meteor.subscribe('groupPosts', this.params._id),
      Meteor.subscribe('subscriptions')
    ];
  },
  data: function() { return Groups.findOne(this.params._id); }
});   

Router.route('/posts/:_id/edit', {
  name: 'postEdit',
  waitOn: function() { 
    return Meteor.subscribe('singlePost', this.params._id);
  },
  data: function() { return Posts.findOne(this.params._id); }
});

Router.route('/submit', {
  name: 'postSubmit',
  controller: PostSubmitController
});

Router.route('/group/submit', {name: 'groupSubmit'});

var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
}

Router.onBeforeAction('dataNotFound', {only: 'postPage'});
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});

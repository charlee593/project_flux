// check that the userId specified owns the documents
ownsDocument = function(userId, doc) {
  return doc && doc.userId === userId;
}

ownsSubscription = function(userId, subscription) {
  return subscription && subscription.userId === userId;
}
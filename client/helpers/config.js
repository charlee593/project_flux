Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY'
});

//searchbar
var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
var fields = ['title'];

GroupSearch = new SearchSource('groups', fields, options);

//FACEBOOK
//APP ID: 1684120708497309
//APP SECRET: aa02b4837b46904a16798d8ef0ae013e
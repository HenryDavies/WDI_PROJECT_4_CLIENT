angular
  .module('financeApp')
  .controller('UsersIndexCtrl', UsersIndexCtrl);

UsersIndexCtrl.$inject = ['User'];
function UsersIndexCtrl(User){
  const vm = this;
  vm.users = User.query();
}

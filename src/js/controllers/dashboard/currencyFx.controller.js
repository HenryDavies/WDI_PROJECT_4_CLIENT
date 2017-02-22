angular
.module('financeApp')
.controller('currencyFxCtrl', currencyFxCtrl)

currencyFxCtrl.$inject = ['$http','API']
function currencyFxCtrl ($http, API) {
  const vm = this;

  vm.currencies = ['EUR', 'GBP', 'AUD', 'CAD'];
  vm.currencyData = [];
  vm.populateCurrencies = function(callback) {
    for (const fx of vm.currencies) {
      $http
      .get(`https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22${fx}=X%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=`)
      .then(function(response) {
        const data = response.data.query.results.quote;
        data.LastTradePriceOnly = parseFloat(data.LastTradePriceOnly);
        data.ChangePips = (parseFloat(data.Change) * 10000).toFixed(0);
        data.ChangePips = data.ChangePips > 0? `+${data.ChangePips}` : data.ChangePips;
        vm.currencyData.push(data);
        if (vm.currencyData.length === vm.currencies.length) vm.fxFinished = true;
      })
      .then(function() {
        if (vm.fxFinished) callback();
      });
    }
  };

  function addCrossCurrencies() {
    for (const fx of vm.currencyData) {
      fx.crossCurrencies = [];
      fx.crossCurrencyChanges = [];
      for (let i = 0; i < vm.currencyData.length; i++) {
        const crossRate = (fx.LastTradePriceOnly / vm.currencyData[i].LastTradePriceOnly).toPrecision(4);
        fx.crossCurrencies.push(crossRate !== '1.000'? crossRate : '');
        const oldCrossRate = ((fx.LastTradePriceOnly - fx.Change) / (vm.currencyData[i].LastTradePriceOnly - vm.currencyData[i].Change));
        const crossRateChange = ((parseFloat(crossRate) - parseFloat(oldCrossRate))*10000).toFixed(0);
        fx.crossCurrencyChanges.push(crossRateChange == 0 ? '' : (crossRateChange > 0? `+${crossRateChange}` : crossRateChange ));
      }
    }
  }
  vm.populateCurrencies(addCrossCurrencies);
}
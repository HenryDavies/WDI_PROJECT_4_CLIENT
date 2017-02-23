angular
.module('financeApp')
.controller('CompanyChartCtrl', CompanyChartCtrl);

CompanyChartCtrl.$inject = ['$http','API'];
function CompanyChartCtrl($http, API){
  const vm = this;

  function getHistoricalPrices() {
    $http({
      method: 'POST',
      url: `${API}/historicalprices`,
      data: ['AAPL']
    }).then(function successCallback(response) {
      vm.priceHistory = response.data.priceHistory;
      // console.log(vm.priceHistory);
      createChart(vm.priceHistory);
    }, function errorCallback(error) {
      console.log(error);
    });
  }

  getHistoricalPrices();

  function createChart(priceHistory) {
    var date = priceHistory[0][0].Date.split('-').join(' ');
    var closeData = [];
    var dateData = [];
    for (var i = priceHistory[0].length-1; i > 0; i--) {
      closeData.push(priceHistory[0][i].Adj_Close);
      dateData.push(priceHistory[0][i].Date);
    }
    console.log(date);
    console.log(closeData);
    console.log(dateData);
    vm.labels = dateData;
    vm.series = ['Adjusted Close', 'Date'];
    vm.data = [
      closeData,
      dateData
    ];
    vm.onClick = function (points, evt) {
      console.log(points, evt);
    };
    vm.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
    vm.options = {
      scales: {
        yAxes: [
          {
            id: 'y-axis-1',
            type: 'linear',
            display: true,
            position: 'left'
          },
          {
            id: 'y-axis-2',
            type: 'linear',
            display: false,
            position: 'right'
          }
        ]
      }
    };
  }
}
angular.module('open311Client.requests_service', [
  'ui.router',
  'ui.bootstrap'
])
  
.config(
  [          '$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {
      $stateProvider
  // requests   
        .state('requests', {
          title: 'Recent Requests',
          // abstract - this state is activated by activating one of it's children.
          abstract: true,
          url: '/requests',
          templateUrl: 'app/templates/requests.html',

          // resolve requests before instantiating controller
          resolve: {
            recentRequests: ['requests_service',
              function(       requests_service){
                return requests_service.all();
              }]
          },

          controller: ['$scope', '$state', 'recentRequests',
            function (  $scope,   $state,   recentRequests) {
              $scope.recentRequests = recentRequests;
            }]
        })


  // request list
        .state('requests.list', {
          title: 'Recent Requests',
          url: '',
          templateUrl: 'app/templates/requests.list.html'
        })


  // request details
        .state('requests.detail', {
          title: 'Viewing Request',
          url: '/{requestId:[0-9]{1,4}}',
          views: {
            '': {
              templateUrl: 'app/templates/requests.detail.html',

              resolve: {
                request: ['requests_service', '$stateParams',
                  function( requests_service, $stateParams){
                    return requests_service.get($stateParams.requestId);
                  }]
              },

              controller: ['$scope', 'requests_service', 'request',
                function (  $scope,   requests_service, request) {
                  $scope.request = request;

                  $scope.update = function(request) {
                    var result = requests_service.post(request);
                    result.then(function(requestID) {
                      alert('Saved successfully!', requestID);
                    });
                  };
                }]
            },

            'hint@': {
              templateProvider: ['$stateParams',
                function (        $stateParams) {
                  return 'Your request has been submitted. You may fill out more details or you may now close your browser.';
                }]
            }
          }
        });
    }
  ]
);
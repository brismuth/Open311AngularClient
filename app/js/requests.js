angular.module('open311Client.requests', [
  'ui.router',
  'ui.bootstrap'
])
  
.config(
  [          '$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {
      $stateProvider
  // requests   
        .state('requests', {
          // abstract - this state is activated by activating one of it's children.
          abstract: true,
          url: '/requests',
          templateUrl: 'app/templates/requests.html',

          // resolve requests before instantiating controller
          resolve: {
            recentRequests: ['requests',
              function( requests){
                return requests.all();
              }]
          },

          controller: ['$scope', '$state', 'recentRequests',
            function (  $scope,   $state,   recentRequests) {
              $scope.recentRequests = recentRequests;
            }]
        })


  // request list
        .state('requests.list', {
          url: '',
          templateUrl: 'app/templates/requests.list.html'
        })


  // request details
        .state('requests.detail', {
          url: '/{requestId:[0-9]{1,4}}',
          views: {
            '': {
              templateUrl: 'app/templates/requests.detail.html',

              resolve: {
                request: ['requests', '$stateParams',
                  function( requests, $stateParams){
                    return requests.get($stateParams.requestId);
                  }]
              },

              controller: ['$scope', '$stateParams', 'request',
                function (  $scope,   $stateParams, request) {
                  $scope.request = request;
                }]
            },

            'hint@': {
              templateProvider: ['$stateParams',
                function (        $stateParams) {
                  return 'You are looking at the details for request ' + $stateParams.requestId;
                }]
            }
          }
        });
    }
  ]
);
angular.module('open311Client.requests_utils', [
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
            recentRequests: ['requests_utils',
              function(       requests_utils){
                return requests_utils.all();
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
                request: ['requests_utils', '$stateParams',
                  function( requests_utils, $stateParams){
                    return requests_utils.get($stateParams.requestId);
                  }],
                services: ['services_utils',
                  function( services_utils){
                    return services_utils.all();
                  }]
              },

              controller: ['$scope', 'requests_utils', 'request', 'services',
                function (  $scope,   requests_utils,   request,   services) {
                  for (var s = 0; s < services.length; s++) {
                    if (request.service_code == services[s].service_code) {
                      $scope.service_name = services[s].service_name;
                    }
                  }

                  $scope.request = request;

                  $scope.update = function(request) {
                    request.expected_datetime = new Date().toISOString();
                    var result = requests_utils.post(request);
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
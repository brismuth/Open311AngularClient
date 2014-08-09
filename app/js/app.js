// Make sure to include the `ui.router` module as a dependency
angular.module('open311Client', [
  'open311Client.requests_service',
  'open311Client.requests_service.service',
  'ui.router',
  'ui.bootstrap'
])
.run(
  [          '$rootScope', '$state', '$stateParams',
    function ($rootScope,   $state,   $stateParams) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
    }
  ]
)
.config(
  [          '$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {
      $urlRouterProvider
        // redirects
        .when('/c?id', '/requests/:id')
        .when('/user/:id', '/requests/:id')
        .otherwise('/');

      $stateProvider
        .state('home', {
          url: '/',
          views: {
            '': {
              templateUrl: 'app/templates/create.html',

              controller: ['$scope', '$state', '$stateParams', 'requests_service',
                function (  $scope,   $state,   $stateParams,   requests_service) {
                  $scope.create = function(request) {
                    var result = requests_service.post(request);
                    result.then(function(requestID) {
                      $stateParams.requestId = requestID;
                      $state.go('requests.detail', $stateParams);
                    });
                  };
                }]
            }
          }
        })

        .state('about', {
          url: '/about',
          template: '<p class="lead">Cedar Hills Issue Tracking</p>' +
                    '<p>You can use this web application to make service request to the city of Cedar Hills.</p>'
        });
    }
  ]
);

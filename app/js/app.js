// Make sure to include the `ui.router` module as a dependency
angular.module('open311Client', [
  'open311Client.requests_utils',
  'open311Client.requests_utils.service',
  'open311Client.services_utils.service',
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
          title: 'Home',
          url: '/',
          views: {
            '': {
              templateUrl: 'app/templates/create.html',

              // resolve requests before instantiating controller
              resolve: {
                services: ['services_utils',
                  function( services_utils){
                    return services_utils.all();
                  }]
              },

              controller: ['$scope', '$state', '$stateParams', 'requests_utils', 'services',
                function (  $scope,   $state,   $stateParams,   requests_utils,   services) {
                  $scope.services = services;

                  // initialize this so the drop down works okay.
                  $scope.request = {
                    service_code: '001'
                  }

                  $scope.create = function(request) {
                    request.requested_datetime = new Date().toISOString();
                    request.expected_datetime = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(); // respond in 24 hours
                    request.status = 'new';

                    var result = requests_utils.post(request);
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
          title: 'About',
          url: '/about',
          template: '<p class="lead">Cedar Hills Issue Tracking</p>' +
                    '<p>You can use this web application to make service request to the city of Cedar Hills.</p>'
        })

        .state('contact', {
          title: 'Contact Us',
          url: '/contact-us',
          templateUrl: 'app/templates/contact.html'
        });
    }
  ]
);

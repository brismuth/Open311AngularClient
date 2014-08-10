angular.module('open311Client.requests_utils', [
  'ui.router',
  'ui.bootstrap',
  'angularFileUpload'
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

              controller: ['$scope', '$stateParams', '$upload', 'requests_utils', 'request', 'services',
                function (  $scope,   $stateParams,   $upload,   requests_utils,   request,   services) {
                  for (var s = 0; s < services.length; s++) {
                    if (request.service_code == services[s].service_code) {
                      $scope.service_name = services[s].service_name;
                    }
                  }

                  $scope.statuses = requests_utils.statuses;

                  // we need to send it as the string, but they send it to us as the key for some reason.
                  request.status = $scope.statuses[request.status];
                  $scope.request = request;

                  // date pickers
                  $scope.open = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.opened = true;
                  };
                  // end date pickers

                  // image upload
                  $scope.onFileSelect = function($files) {
                    var file = $files[0];

                    $scope.upload = $upload.upload({
                      url: 'https://api.imgur.com/3/image',
                      method: 'POST',
                      headers: {
                        Authorization: 'Client-ID b66f80f35cf0e1f'
                      },
                      data: {
                        image: file, 
                      },
                    }).success(function(data, status, headers, config) {
                      request.media_url = data.data.link;
                    });
                  };
                  // end image upload

                  $scope.update = function(request, includeAdminSection) {
                    // we'll ignore these fields
                    if (!includeAdminSection) {
                      delete request.status;
                      delete request.expected_datetime;
                    }

                    // format it for the server
                    request.expected_datetime = new Date(request.expected_datetime).toISOString();

                    var result = requests_utils.post(request);
                    result.then(function(requestID) {
                      $scope.reset(); // now that the data is uploaded
                      $stateParams.hint = 'Saved successfully! ' + new Date();
                    });
                  };

                  $scope.reset = function() {
                    requests_utils.get($stateParams.requestId).then(function(updated_request){
                      updated_request.status = $scope.statuses[updated_request.status];
                      $scope.request = updated_request;
                    });
                  };
                }]
            }
          }
        });
    }
  ]
);
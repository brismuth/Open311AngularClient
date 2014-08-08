angular.module('open311Client.requests.service', [

])

// A RESTful factory for retreiving service requests 
.factory('requests', ['$http', function ($http) {

var baseUrl = 'http://311.zappala.org/requests';
  var requests = $http.get(baseUrl + '.xml').then(function (result) {
    var x2js = new X2JS();
    return x2js.xml_str2json( result.data ).service_requests.request;
  });

  var factory = {};
  factory.all = function () {
    return requests;
  };


  factory.get = function (service_request_id) {
    var request = $http.get(baseUrl + '/' + service_request_id + '.xml').then(function (result) {
      var x2js = new X2JS();
      return x2js.xml_str2json( result.data ).service_requests.request;
    });
    return request;
  };

  return factory;
}]);
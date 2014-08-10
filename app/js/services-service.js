angular.module('open311Client.services_utils.service', [

])

// A RESTful factory for retreiving service requests 
.factory('services_utils', ['$http', '$q', 
                   function ($http,   $q) {

  var baseUrl = 'http://311.zappala.org/services';

  var services = $http.get(baseUrl + '.xml').then(function (result) {
    var x2js = new X2JS();
    return x2js.xml_str2json( result.data ).services.service;
  });

  var factory = {};
  factory.all = function () {
    return services;
  };

  return factory;
}]);
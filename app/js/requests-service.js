angular.module('open311Client.requests_service.service', [

])

// A RESTful factory for retreiving service requests 
.factory('requests_service', ['$http', '$q', 
                     function ($http,   $q) {

  var baseUrl = 'http://311.zappala.org/';
  var api_key = '32jjrntg5kjnf429q8h9q328h429f';

  var requests = $http.get(baseUrl + 'requests.xml').then(function (result) {
    var x2js = new X2JS();
    return x2js.xml_str2json( result.data ).service_requests.request;
  });

  var factory = {};
  factory.all = function () {
    return requests;
  };

  factory.get = function (service_request_id) {
    var request = $http.get(baseUrl + 'requests/' + service_request_id + '.xml').then(function (result) {
      var x2js = new X2JS();
      return x2js.xml_str2json( result.data ).service_requests.request;
    });

    return request;
  };

  factory.post = function(request) {
    var params = {
      api_key: api_key,
      service_code: request.service_code,
      address_string: request.address
    };

    var url = baseUrl;

    if (request.service_request_id) {
      params.service_request_id = request.service_request_id;
      // this is a previously existing service request. Update it instead (TODO: this may not be the correct way of handling updates)
      url += 'servicerequestupdates.xml';
    } else {
      // this is a new service request
      url += 'requests.xml';
    }

    if (request.email) params.email = request.email;
    if (request.media_url) params.media_url = request.media_url;
    if (request.description) params.description = request.description;
    if (request.lat) params.lat = request.lat;
    if (request.long) params.long = request.long;
    if (request.zip_code) params.zip_code = request.zip_code;

    var result = $q.defer();

    $http({
      method: 'POST',
      url: url,
      data: $.param(params),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function (data) {
      var x2js = new X2JS();
      var ans = x2js.xml_str2json( data ).service_requests.request;
      console.log(ans);
      result.resolve(ans.service_request_id);
    });

    return result.promise;
  };

  return factory;
}]);
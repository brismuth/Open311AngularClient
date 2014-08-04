app.controller("existingRequests", function($scope, $http){
	$scope.requests = [];

	$http({
		method: 'GET',
		url: 'http://311.zappala.org/requests.xml'
	}).success(function (result) {
		var x2js = new X2JS();          
        var requests = x2js.xml_str2json( result );
		console.log(requests.service_requests.request);
		$scope.requests = requests.service_requests.request;
	});
});
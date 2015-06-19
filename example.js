angular.module('myProject.controllers')
    .controller('exampleLocationCtrl', ['$scope', 'locationService',
        function($scope, locationService) {

            locationService.getLocation(function(position) {
                console.info("You are here", position);
            }, function() {
                // No access to location. Do something
            });
        }
    ]);

angular.module('myProject.services')
    .service('locationService', function() {
        this.updatedAt = null;
        this.locationAccessDeined = null;

        this.getLocation = function(success_callback, error_callback) {
            console.info("getting location...");
            if (localStorage.getItem('lastLocation') && !_needsUpdate()) {
                console.info("got cached location", JSON.parse(localStorage.getItem('lastLocation')));
                success_callback && success_callback(JSON.parse(localStorage.getItem('lastLocation')));
            } else {
                _getCurrentLocation(function(position) {
                    var pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    };

                    _updateLastLocation(pos);

                    success_callback && success_callback(pos);
                }, function() {
                    error_callback && error_callback();
                });
            }
        }

        var _getCurrentLocation = function(success_callback, error_callback) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(success_callback, error);
                this.locationAccessDeined = false;
            } else {
                return handleNoGeolocation(false);
            }

            function error(msg) {
                return handleNoGeolocation(true);
            }

            function handleNoGeolocation(errorFlag) {
                this.locationAccessDeined = true;
                error_callback && error_callback();
                console.warn('Access to location has been denied!');
                if (errorFlag) {
                    console.error('The Geolocation service failed.');
                } else {
                    console.error('Your browser doesn\'t support geolocation.');
                }
            }
        };

        var _updateLastLocation = function(currentLocation) {
            console.info("updating cached location...");
            localStorage.setItem('lastLocation', JSON.stringify(currentLocation));
            localStorage.setItem('updatedAt', new Date().getTime());
        };

        var _needsUpdate = function() {
            console.info("checking if location needs update...");
            return new Date().getTime() - new Date(localStorage.getItem('updatedAt')).getTime() > 1 * 60 * 1000;
        };
    });

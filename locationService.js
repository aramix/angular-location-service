angular.module('myProject.services')
    .service('locationService', function() {
        this.updatedAt = null;
        this.updateInterval = 1 * 60 * 1000;
        this.locationAccessDeined = null;

        // set to true to show debugging info
        DEBUG = true;

        var debug = {
            log: function() {
                DEBUG&&console.log(arguments[0], arguments[1] || '');
            },
            info: function() {
                DEBUG&&console.info(arguments[0], arguments[1] || '');
            },
            warn: function() {
                DEBUG&&console.warn(arguments[0], arguments[1] || '');
            },
            error: function() {
                DEBUG&&console.error(arguments[0], arguments[1] || '');
            }
        }

        this.getLocation = function(success_callback, error_callback) {
            debug.info("getting location...");
            if (localStorage.getItem('lastLocation') && !_needsUpdate()) {
                debug.info("got cached location", JSON.parse(localStorage.getItem('lastLocation')));
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
                error_callback && error_callback();
                debug.warn('Access to location has been denied!');
                if (errorFlag) {
                    return 'The Geolocation service failed.';
                } else {
                    this.locationAccessDeined = true;
                    return 'Your browser doesn\'t support geolocation.';
                }
            }
        };

        var _updateLastLocation = function(currentLocation) {
            debug.info("updating cached location...", currentLocation);
            localStorage.setItem('lastLocation', JSON.stringify(currentLocation));
            localStorage.setItem('updatedAt', new Date().getTime());
        };

        var _needsUpdate = function() {
            debug.info("checking if location needs update...");
            return new Date().getTime() - new Date(Number(localStorage.getItem('updatedAt'))).getTime() > this.updateInterval;
        };
    });

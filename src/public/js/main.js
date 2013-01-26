var d3Application = {};
(function() {
    'use strict';

    require(['domReady'], function(domReady, map){
        domReady(function(){
            updateModuleProgress = function(domReady, map){
                console.log('loading ' + map.name + ' at ' + map.url);
            };
        });
    });

    require(['jquery'],
        function($){
            require(['clientApplication'], function(app){
                d3Application.app = app;
                app.initialize();
            });
        }
    );
    var updateModuleProgress = function(context, map, depMaps){
        console.log('loading: ' + map.name + ' at ' + map.url);
    };
    require.onResourceLoad = function(context, map, depMaps){
        updateModuleProgress(context, map, depMaps);
    };
}).call(this);

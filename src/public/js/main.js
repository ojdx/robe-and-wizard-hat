/*!
 * robe-and-wizard-hat
 * Copyright(c) 2012 Jeremy Williams
 * MIT Licensed
 */

/**
 * main application on dom ready load the application
 */

//global reference. attach globals to this, use sparingly like for the application event bus and that's it
var d3Application = {};
(function() {
    'use strict';

    require(['domReady'], function(domReady, map){
        domReady(function(){
            updateModuleProgress = function(domReady, map){
                //console.log('loading ' + map.name + ' at ' + map.url);   uncomment and see everything load
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
        //console.log('loading: ' + map.name + ' at ' + map.url);   uncomment and see everything load
    };
    require.onResourceLoad = function(context, map, depMaps){
        updateModuleProgress(context, map, depMaps);
    };
}).call(this);

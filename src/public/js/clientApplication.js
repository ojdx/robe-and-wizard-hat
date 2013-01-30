/*!
 * robe-and-wizard-hat
 * Copyright(c) 2012 Jeremy Williams
 * MIT Licensed
 */

/**
 * main client app, initialize the top level view set the el to body
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'ApplicationView'
], function($, _, Backbone, ApplicationView){
    var initialize = function(){
       new ApplicationView({el:$("body")});
    };
    return {
        initialize: initialize
    };
});
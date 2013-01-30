/*!
 * robe-and-wizard-hat
 * Copyright(c) 2012 Jeremy Williams
 * MIT Licensed
 */

/**
 * Main view contains all other views
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'socket.io'
], function($, _, Backbone, io){
    return Backbone.View.extend({
        initialize: function(){
            _.bindAll(this);
            //initialize the socket and
            this.socket = io.connect();
        }
    });
});
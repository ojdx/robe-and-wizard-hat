define([
    'jquery',
    'underscore',
    'backbone',
    'socket.io'
], function($, _, Backbone, io){
    return Backbone.View.extend({
        initialize: function(){
            _.bindAll(this);
            this.socket = io.connect();
        }
    });
});
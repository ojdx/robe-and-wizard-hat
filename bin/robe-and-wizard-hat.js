#!/usr/bin/env node
/*!
 * robe-and-wizard-hat
 * Copyright(c) 2012 Jeremy Williams
 * MIT Licensed
 */
/**
 * simple source copy to the created directory
 */
var fs = require('fs')
    , exec = require('child_process').exec

var methods = {
    create: function (path) {
        console.log('You put on your robe and wizard hat')
        fs.mkdirSync('./' + path)
        exec('cp -R ' + __dirname + '/../src/' + ' ' + path, function (err, out) {
            if (err) return console.log('error', err)
            console.log('You meditate to regain your mana')
        })
    }
}
!function (args) {
    var command = args.shift()
    methods[command] && methods[command].apply(methods, args)
}(process.argv.slice(2))
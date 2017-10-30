'use strict';
module.exports = angular.module("app.inner").controller("innerCtrl", function() {
    this.test = function() {
        alert(this.name);
    };
    console.log("897989");
}).name;
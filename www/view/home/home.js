'use strict';
module.exports = angular.module("app.home").controller("homeCtrl", function() {
    'ngInject';
    this.test = function() {
        alert(this.name);
    };
    this.num = "弹出输入框文本666";
    console.log("897989");
}).name;

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.schedule.onCreated(function scheduleOnCreated() {
  this.addClass = function(key) {
    if(this.orderedClasses.indexOf(key) < 0){
      this.orderedClasses.push(key);
    }
  }

  this.orderList = function(key) {
    if(!this.classTree[key].child || (this.orderedClasses.indexOf(this.classTree[key].child) > 0)){
      this.addClass(key);
      if('parent' in this.classTree[key]){
        return this.classTree[key].parent;
      }
      else {
        return 1;
      }
    }
    else if(this.classTree[key].visited) {
      return 0;
    }
    this.classTree[key].visited = true;
    this.classTree[this.classTree[key].child].parent = key;
    this.result = this.orderList(this.classTree[key].child);
    if(this.result == 0){
      return 0;
    }
    else if(this.result == 1) {
      return 1;
    }
    else{
      return this.addParent(this.result);
    }
  }
  this.addParent = function(key) {
    this.addClass(key);
    if('parent' in this.classTree[key]){
      return this.classTree[key].parent;
    }
    else {
      return 1;
    }
  }
  this.orderClassSchedule = function(list) {

    this.classTree = {};
    this.classAndPre = null;
    var classes = list;
    this.finalReturn = 0;
    this.result = 0;

    for (i = 0; i < classes.length; i++) {
      this.classAndPre = classes[i].split(':');
      this.classTree[this.classAndPre[0]] = {};
      this.classTree[this.classAndPre[0]].visited = false;
      if (this.classAndPre.length < 2 || this.classAndPre[1] == '') {
        this.classTree[this.classAndPre[0]].child = false;
      }
      else {
        this.classTree[this.classAndPre[0]].child = this.classAndPre[1].trim();
        if(!this.classTree[this.classTree[this.classAndPre[0]].child]){
          this.classTree[this.classTree[this.classAndPre[0]].child] = {};
          this.classTree[this.classTree[this.classAndPre[0]].child].visited = false;
          this.classTree[this.classTree[this.classAndPre[0]].child].child = false;
        }
      }
    }
    console.log(this.classTree)
    for(var key in this.classTree){
      if(this.orderedClasses.indexOf(key) < 0){
        this.finalReturn = this.orderList(key);
        if(this.finalReturn == 0){
          this.orderedClasses.push('error');
          break;
        }
      }
    }
  }
  this.counter = new ReactiveVar(0);
  this.classes = new ReactiveArray();
  this.orderedClasses = new ReactiveArray();
  this.classTree = {};
  this.classAndPre = null;
  this.finalReturn = 0;
  this.result = 0;
  this.test1 = new ReactiveArray(['Introduction to Paper Airplanes:','Advanced Throwing Techniques: Introduction to Paper Airplanes', 'History of Cubicle Siege Engines: Rubber Band Catapults 101', 'Advanced Office Warfare: History of Cubicle Siege Engines', 'Rubber Band Catapults 101:', 'Paper Jet Engines: Introduction to Paper Airplanes']);
  this.test2 = new ReactiveArray(['a:b', 'c:b', 'd:b']);
  this.test3 = new ReactiveArray(['a:b', 'c:a', 'b:c']);
});

Template.schedule.helpers({
  counter() {
    return Template.instance().counter.get();
  },
  classes() {
    return Template.instance().classes.list();
  },
  orderedClasses() {
    return Template.instance().orderedClasses.list();
  },
  test1() {
    return Template.instance().test1.list();
  },
  test2() {
    return Template.instance().test2.list();
  },
  test3() {
    return Template.instance().test3.list();
  },
});

Template.schedule.events({

  'click .add'(event, instance) {
    var value = $('.add-class-area').val();
  	if(value != '') {
      instance.classes.push($('.add-class-area').val());
    }
    $('.add-class-area').val('');
  },
  'click .order'(event, instance) {
    instance.orderedClasses.clear();
    instance.orderClassSchedule(instance.classes.list());
  },
  'click .clear'(event, instance) {
    instance.classes.clear();
  },
  'click .test-1'(event, instance) {
    instance.orderedClasses.clear();
    instance.orderClassSchedule(instance.test1.list());
  },
  'click .test-2'(event, instance) {
    instance.orderedClasses.clear();
    instance.orderClassSchedule(instance.test2.list());
  },
  'click .test-3'(event, instance) {
    instance.orderedClasses.clear();
    instance.orderClassSchedule(instance.test3.list());
  }
});

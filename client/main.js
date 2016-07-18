import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.schedule.onCreated(function scheduleOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
  this.classes = new ReactiveArray(['Introduction to Paper Airplanes:','Advanced Throwing Techniques: Introduction to Paper Airplanes', 'History of Cubicle Siege Engines: Rubber Band Catapults 101', 'Advanced Office Warfare: History of Cubicle Siege Engines', 'Rubber Band Catapults 101:', 'Paper Jet Engines: Introduction to Paper Airplanes']);
  this.orderedClasses = new ReactiveArray();
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
});

Template.schedule.events({
  'click .add'(event, instance) {
    var value = $('.class').val();
  	if(value != '') {
      instance.classes.push($('.add-class-area').val());
    }
  },
  'click .order'(event, instance) {

    var classTree = {};
    var group = null;
    var classes = instance.classes.list();
    var finalReturn = 0;
    var result = 0;

    function addClass(key) {
      if(instance.orderedClasses.indexOf(key) < 0){
        instance.orderedClasses.push(key);
      }
    }

    function orderList(key) {
      if(!classTree[key].child || classTree[classTree[key].child].visited){
        addClass(key);
        if('parent' in classTree[key]){
          return classTree[key].parent;
        }
        else {
          return 1;
        }
      }
      else if(classTree[key].visited) {
        return 0;
      }
      classTree[key].visited = true;
      classTree[classTree[key].child].parent = key;
      result = orderList(classTree[key].child);
      if(result == 0){
        return 0;
      }
      else if(result == 1) {
        return 1;
      }
      else{
        return addParent(result);
      }
    }
    function addParent(key) {
      addClass(key);
      if('parent' in classTree[key]){
        return classTree[key].parent;
      }
      else {
        return 1;
      }
    }

    for (i = 0; i < classes.length; i++) {
      group = classes[i].split(':');
      classTree[group[0]] = {};
      classTree[group[0]].visited = false;
      if (group.length < 2 || group[1] == '') {
        classTree[group[0]].child = false;
      }
      else {
        classTree[group[0]].child = group[1].trim();
        if(!classTree[classTree[group[0]].child]){
          classTree[classTree[group[0]].child] = {};
          classTree[classTree[group[0]].child].visited = false;
          classTree[classTree[group[0]].child].child = false;
        }
      }
    }
    for(var key in classTree){
      if(instance.orderedClasses.indexOf(key) < 0){
        finalReturn = orderList(key);
        if(finalReturn == 0){
          instance.orderedClasses.push('error');
          break;
        }
      }
   }
  },
});

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.schedule.onCreated(function scheduleOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
  this.classes = new ReactiveArray();
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
      instance.classes.push($('.class').val());
    }
  },
  'click .order'(event, instance) {
    var map = {};
    var group = null;
    var classes = instance.classes.list();
    for (i = 0; i < classes.length; i++) {
      group = classes[i].split(':');
      if (group.length < 2) {
        map[group[0]] = false;
      }
      else {
        map[group[0]] = group[1];
      }
    }
    for(var key in map){
      if(!map[key]){
        instance.orderedClasses.push(key);
      }
   }
  },
});

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

    function orderList(key) {
      console.log(map);
      if(!map[key].child){
        instance.orderedClasses.push(key);
        return;
      }
      else if(map[key].visited) {
        return 'cycle';
      }
      map[key].visited = true;
      orderList(map[key].child);
    }

    for (i = 0; i < classes.length; i++) {
      group = classes[i].split(':');
      map[group[0]] = {};
      if (group.length < 2) {
        map[group[0]].child = false;
      }
      else {
        map[group[0]].child = group[1].trim();
        if(!map[map[group[0]].child]){
          map[map[group[0]].child] = {};
        }
      }
    }
    for(var key in map){
      console.log('here');
      if(instance.orderedClasses.indexOf() < 0){
        orderList(key);
      }
   }
  },
});

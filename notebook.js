parent = new Mongo.Collection("parent");
child = new Mongo.Collection("child");
var currentparrentid;
var ref = false;

if (Meteor.isClient) {
  Template.body.helpers({
    showparrent: function () {
      return parent.find({});
    },

    clicked: function(){
      return Session.get("isSet")
    },

    refresh: function(){
      return !ref;
    },

    showchild: function(){
      return child.find({});
    },

    equals: function(a){
      return a=== currentparrentid;
    }
  });

   Template.body.events({
    "submit .new-task": function (event) {
      // Prevent default browser form submit
      event.preventDefault();
 
      // Get value from form element
      var text = event.target.text.value;
 
      // Insert a task into the collection
      parent.insert({
        content: text
      });
 
      // Clear form
      event.target.text.value = "";
    },

    "submit .new-note": function (event) {
      // Prevent default browser form submit
      event.preventDefault();
 
      // Get value from form element
      var text = event.target.text.value;
        
      // Insert a task into the collection
      child.insert({
        content: text,
        createdBy: currentparrentid
      });
 
      // Clear form
      event.target.text.value = "";
    },


  });

   Template.parenttask.events({

    "click .btnforparrent": function () {
      currentparrentid = this._id;
      Session.set("isSet", true);
      Session
    },

    "click .delete": function () {

      parent.remove(this._id);
    },

  });

   Template.childtask.events({
    "click .deletechild": function () {
      child.remove(this._id);
    } 

   });

   Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

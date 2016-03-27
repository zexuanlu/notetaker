parent = new Mongo.Collection("parent");
child = new Mongo.Collection("child");




if (Meteor.isClient) {

  Session.setDefault("currentparrentid", "");
  Session.setDefault("childupdateid", -1);
  Session.setDefault("childupdatevalue", "");
  Session.setDefault("childvisible", "hidden");
  Session.setDefault("childaddform", "hidden");


  Template.body.helpers({
    showparrent: function () {
      return parent.find({user: Meteor.userId()});
    },

    clicked: function(){
      return Session.get("isSet");
    },


    showchild: function(){
      return child.find({createdBy: Session.get("currentparrentid")});
    },

    getparentvalue: function(){
      return Session.get("parentupdatevalue");
    },

    getchildvalue: function(){
      return Session.get("childupdatevalue");
    },

    parentvisibility: function(){
      return Session.get("parentvisiable");
    },

    childvisibility: function(){
      return Session.get("childvisible");
    },

    checklogin: function(){
      if(Meteor.userId())
        return "visible";
      
      Session.set("currentparrentid", "");
      Session.set('childaddform', 'hidden');
      return "hidden";
    },

    childadd: function() {
      return Session.get("childaddform");
    }

  });

  Template.childtask.helpers({
    transform: function(){
      var text = this.content;
      var regExp = new RegExp(Session.get("searchtext"), "g");
      return Spacebars.SafeString(text.replace(regExp, '<span class="highlight">$&</span>'));
    }
  });

   Template.body.events({
    "click .new-task": function () {

      parent.insert({
        content: "",
        user: Meteor.userId(),
      });

    },

    "submit .new-note": function (event) {
      // Prevent default browser form submit
      event.preventDefault();
 
      // Get value from form element
      var text = event.target.text.value;
        
      // Insert a task into the collection
      child.insert({
        content: text,
        createdBy: Session.get("currentparrentid")
      });
      var id = Session.get("currentparrentid")
      var text = child.findOne({createdBy: id}).content;
       parent.update(id, {
        $set:{content: text}
      });
 
      // Clear form
      event.target.text.value = "";
    },

    

    "submit .new-cupdate": function (event) {
      event.preventDefault();
 
      // Get value from form element
      var text = event.target.text.value;

      child.update(Session.get("childupdateid"), {
        $set:{content: text}
      });

      event.target.text.value = "";
      
      Session.set("childvisible", "hidden");

      var id = Session.get("currentparrentid");
       var text = child.findOne({createdBy: id}).content;
       parent.update(id, {
        $set:{content: text}
      });


    },

    "submit .search": function(event) {
      event.preventDefault();
 
      // Get value from form element
      var text = event.target.text.value;
      Session.set("searchtext", text);
    }


  });

   Template.parenttask.events({

    "click .btnforparrent": function () {
      Session.set("currentparrentid", this._id);
      Session.set("isSet", true);
      Session.set('childaddform', 'visible');

    },

    "click .delete": function () {

      parent.remove(this._id);
     
    },


  });

   Template.childtask.events({
    "click .deletechild": function () {
      var id = Session.get("currentparrentid");
      child.remove(this._id);
      var text = "";
      if(child.find({createdBy: id}).count() > 0)
       text = child.findOne({createdBy: id}).content;

       parent.update(id, {
        $set:{content: text}
      });
    },

    "click .btnchildupdate": function (){
      Session.set("childupdateid", this._id);
      Session.set("childupdatevalue", this.content);
      Session.set("childvisible", "visible");
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

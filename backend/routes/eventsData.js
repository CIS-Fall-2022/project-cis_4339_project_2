const express = require("express");
const router = express.Router();

//importing data model schemas
let { eventdata } = require("../models/models"); 

//GET all entries
router.get("/", (req, res, next) => { 
    eventdata.find({organization: process.env.ORGANIZATION},
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    ).sort({ 'updatedAt': -1 }).limit(10);
});

//GET single entry by ID
router.get("/id/:id", (req, res, next) => { 
    eventdata.find({ _id: req.params.id }, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
});

//GET entries based on search query
//Ex: '...?eventName=Food&searchBy=name' 
router.get("/search/", (req, res, next) => { 
    let dbQuery = "";
    if (req.query["searchBy"] === 'name') {
        dbQuery = { eventName: { $regex: `^${req.query["eventName"]}`, $options: "i" } }
    } else if (req.query["searchBy"] === 'date') {
        dbQuery = {
            date:  req.query["eventDate"]
        }
    };
    eventdata.find( 
        dbQuery, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//GET events for which a client is signed up
router.get("/client/:id", (req, res, next) => { 
    eventdata.find( 
        { attendees: req.params.id }, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//POST
router.post("/", (req, res, next) => { 
    eventdata.create( 
        req.body, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//PUT
router.put("/:id", (req, res, next) => {
    eventdata.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});
//Delete functionality
router.delete('/:id', (req, res, next) => {
    
    eventdata.findOneAndRemove({ _id: req.params.id},
        req.body,
        (error, data) => {
        if (error) {
          return next(error);
        } else {
           res.status(200).json({
             msg: data
           });
          res.send('Event is deleted');
        }
      });
});

//Delete attendee 
router.put("/removeattendee/:id", (req, res, next) => {
    //using the same idea from PUT
    eventdata.find( 
        { _id: req.params.id, attendees: req.body.attendee }, //finds the attendee in specific event
        (error) => { 
            if (error) { //if no attendee found, error is returned
                return next(error);
            } else {
                    eventdata.updateOne( //use update instead of delete cause we are just updating the table, not deleting the attendee
                        { _id: req.params.id }, 
                        { $pull: {attendees: req.body.attendee }} , //use pull to remove the attendee from list
                        (error, data) => {
                            if (error) {
                                consol
                                return next(error);
                            }
                             else {
                                res.json(data);
                            }
                        }
                    );
                
            }
        
        });
});

//GET the total number of events for the graph
router.get('/total/clientnumber', (req, res, next) => {
    eventdata.aggregate([
        { $unwind: "$attendees" },
        { $group: { _id: {_id: "$_id", eventName: "$eventName", date: "$date"},  
                   count: {$sum: 1 }
                  }
        },
    ], (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data);
        }
    });
});

//PUT add attendee to event
router.put("/addAttendee/:id", (req, res, next) => {
    //only add attendee if not yet signed uo
    eventdata.find( 
        { _id: req.params.id, attendees: req.body.attendee }, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                if (data.length == 0) {
                    eventdata.updateOne(
                        { _id: req.params.id }, 
                        { $push: { attendees: req.body.attendee } },
                        (error, data) => {
                            if (error) {
                                consol
                                return next(error);
                            } else {
                                res.json(data);
                            }
                        }
                    );
                }
                
            }
        }
    );
    
});


module.exports = router;

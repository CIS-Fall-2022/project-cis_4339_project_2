const express = require("express"); 
const router = express.Router(); 

//importing data model schemas
let { orgData } = require("../models/models"); 
let { eventdata } = require("../models/models"); 
let { primarydata } = require("../models/models");

//GET all entries
router.get("/", (req, res, next) => { 
    orgData.find( 
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
//this is used for the name apperance on the frontend
router.get("/id/:id", (req, res, next) => {
    orgData.find( 
        { id: req.params.id }, 
        (error, data) => {
            if (req.params.id = orgID) { //to retrieve only the ones that matches the organization youre using
                    res.json(data);
                } else {
                    return next(error)
                }
        }
    );
});

//GET entries based on search query
router.get("/search/", (req, res, next) => { 
    let dbQuery = "";
    if (req.query["searchBy"] === 'name') {
        dbQuery = { orgname: { $regex: `^${req.query["orgname"]}`, $options: "i" } }
    } else if (req.query["searchBy"] === 'email') {
        dbQuery = {
            email:  req.query["orgEmail"]
        }
    };
    orgData.find( 
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

//GET events for a single org
router.get("/event/:orgName", (req, res, next) => { 
    eventdata.find( 
        { organization: req.params.orgName }, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//GET clients for a single org
router.get("/client/:orgName", (req, res, next) => { 
    primarydata.find( 
        { organization: req.params.orgName }, 
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
    orgData.create( 
        req.body,
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data); 
            }
        }
    );
    orgData.createdAt;
    orgData.updatedAt;
    orgData.createdAt instanceof Date;
});

//PUT update (make sure req body doesn't have the id)
router.put("/:id", (req, res, next) => { 
    orgData.findOneAndUpdate( 
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
    
    orgData.findOneAndRemove({ _id: req.params.id}, 
        req.body,
        (error, data) => {
        if (error) {
          return next(error);
        } else {
           res.status(200).json({
             msg: data
           });
        }
      });
});

module.exports = router;

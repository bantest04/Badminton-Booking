const express = require('express');
const router = express.Router();
const timeslotController = require('../controllers/timeslotController');

router.get('/available', timeslotController.getAvailableTimeslots); 

router.post('/', timeslotController.createTimeslot);


router.get('/', timeslotController.getTimeslots);


router.get('/:id', timeslotController.getTimeslotById);


router.put('/:id', timeslotController.updateTimeslot);


router.delete('/:id', timeslotController.deleteTimeslot);


module.exports = router;

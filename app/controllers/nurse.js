const { validationResult } = require('express-validator');

const NurseSchema = require('../models/nurse/nurse');
const HealthbookSaveNurseSchema = require('../models/healthbook/healthbook_save_nurse');
const DateSchema = require('../models/other/date');
const TimeSchema = require('../models/other/time');
const ShiftSchema = require('../models/other/shift');
const TimeSlotSchema = require('../models/other/time_slot');

const helper = require('../helper/index');

//use to import nurse
exports.createNurse = async function (req, res, next) {
    const departmentString = req.body.department;
    const department = departmentString.split(',');

    const skillSetString = req.body.skill_set;
    const skillSet = skillSetString.split(',');

    const langString = req.body.lang;
    const lang = langString.split(',');

    const college = {
        name: req.body.college_name,
        department: req.body.college_department,
        degree: req.body.college_degree,
    };

    const Nurse = new NurseSchema({
        fullname: req.body.fullname,
        introduction: req.body.introduction,
        gender: req.body.gender,
        department: department,
        skill_set: skillSet,
        college: college,
        lang: lang,
        fee_per_hour: req.body.fee_per_hour,
    });

    const nurse = await Nurse.save();

    if(nurse) {
        return res
            .status(200)
            .send(helper.responseSuccess(true, '200', 'OK'));
    }
    else{
        return res
            .status(403)
            .send(helper.responseFailure(false, '403', 'Error'));
    }
}

exports.getNurse = async function(req, res, next) {
    const savedList = await HealthbookSaveNurseSchema.find({healthbookId: req.healthbookId});

    NurseSchema.find({is_active: true})
        .exec()
        .then(nurseList => {
            let data = nurseList.map( nurse => {
                let isSave = savedList.some( element => element.nurseId.toString() === nurse._id.toString() );
                return {
                    avatar: nurse.avatar,
                    fullname: nurse.fullname,
                    department: nurse.department,
                    average_score: nurse.average_score,
                    is_save: isSave,
                };
            });
            return res
                .status(200)
                .send( helper.responseSuccess(true, '200', 'Successfully', data) );
        })
        .catch(errors => {
            return res
                .status(500)
                .send( helper.responseFailure(true, '500', 'Error', errors) );
        });
}

exports.getNurseById = async function(req, res, next) {
    const savedList = await HealthbookSaveNurseSchema.find({healthbookId: req.healthbookId});

    NurseSchema.findOne({is_active: true, _id: req.params.id})
        .exec()
        .then(nurse => {
            let isSave = savedList.some( element => element.nurseId.toString() === nurse._id.toString() );
            return res
                .status(200)
                .send( helper.responseSuccess(true, '200', 'Successfully', {
                    is_save: isSave,
                    nurse: nurse,
                }) );
        })
        .catch(errors => {
            return res
                .status(500)
                .send( helper.responseFailure(true, '500', 'Error', errors) );
        });
}

exports.createTimeSlot = async function(req, res, next) {
    let selectedDate = await DateSchema.findOne({
        year: req.body.year,
        month: req.body.month,
        day: req.body.day,
    });

    if(!selectedDate) {
        let newDate = new DateSchema({
            year: req.body.year,
            month: req.body.month,
            day: req.body.day,
        });
        newDate.save();
        selectedDate = newDate;

        let timeList = await TimeSchema.find({});

        timeList.forEach((time) => {
            let newShift = new ShiftSchema({
                date: selectedDate._id,
                time: time._id,
            });
            newShift.save();

            let newTimeSlot = new TimeSlotSchema({
                nurse: req.params.id,
                shift: newShift._id,
            });
            newTimeSlot.save();
        });

        return res.status(200)
            .send( helper.responseSuccess(true, '200', 'Create successful') );
    }
    else {
        return res.status(400)
            .send( helper.responseFailure(false, '400', 'This data was available') );
    }
}

exports.getAvailableTime = async function(req, res, next) {
    let selectedDate = await DateSchema.findOne({
        year: req.body.year,
        month: req.body.month,
        day: req.body.day,
    });
    let shiftList = await ShiftSchema.find({date: selectedDate}).populate('date').populate('time').exec();

    if(!selectedDate || !shiftList) {
        return res.status(400)
            .send( helper.responseFailure(false, '400', 'Create the date and shift before getting available time') )
    }

    await setTimeout(() => {
        return res.status(200)
            .send( helper.responseSuccess(true, '200', 'Successfully', availableTimeList) );
    },500);

    let availableTimeList = [];

    await shiftList.forEach(async (shift, index) => {
        let timeSlot = await TimeSlotSchema.findOne({shift: shift._id, nurse: req.params.id});
        let now = new Date();
        let limitTime = new Date(shift.date.year, shift.date.month-1, shift.date.day, shift.time.start_hour, shift.time.start_minute, shift.time.start_second);
        
        let is_available = true;
        if( limitTime.getTime() - now.getTime() <= 30*60*1000 ) is_available = false;
        
        availableTimeList[index] = {
            _id: timeSlot._id,
            date: `${shift.date.day}/${shift.date.month}/${shift.date.year}`,
            code: shift.time.name,
            time: {
                start: `${shift.time.start_hour}:${shift.time.start_minute}:${shift.time.start_second}`,
                end: `${shift.time.end_hour}:${shift.time.end_minute}:${shift.time.end_second}`,
            },
            is_booked: timeSlot.is_booked,
            is_available: is_available,
        };
    });
}

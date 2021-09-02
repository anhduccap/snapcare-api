const { validationResult } = require('express-validator');

const NurseSchema = require('../models/nurse/nurse');
const HealthbookSchema = require('../models/healthbook/healthbook');
const HealthbookSaveNurseSchema = require('../models/healthbook/healthbook_save_nurse');
const DateSchema = require('../models/other/date');
const TimeSchema = require('../models/other/time');
const ShiftSchema = require('../models/other/shift');
const TimeSlotSchema = require('../models/nurse/time_slot');

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
    let nurseList = await NurseSchema.find({is_active: true});
    req.query.average_score = Math.floor(req.query.average_score);
    if(req.query.average_score >= 0) {
        nurseList = nurseList.filter( nurse => nurse.average_score >= req.query.average_score);
    }
    let savedList = await HealthbookSaveNurseSchema.find({healthbookId: req.healthbookId});
    let timeList = await TimeSchema.find({});

    if(!nurseList || nurseList.length === 0) {
        return res.status(500)
            .send( helper.responseFailure(false, '500', 'No nurses are active'));
    }
    else {
        await Promise.all(
            nurseList.map( async (nurse) => {
                let timeSlotList = await TimeSlotSchema.find({nurse: nurse._id}).populate('shift').exec();
                
                if(!timeSlotList || timeSlotList.length === 0) {
                    let now = new Date().getTime();
                    let day = new Date(now).getDate();
                    let month = new Date(now).getMonth();
                    let year = new Date(now).getFullYear();
                    //Trường hợp nurse chưa được xem lịch bởi bất kỳ ai (chưa được tạo date, shift, time slot)
                    return Promise.all(
                        //Lấy thông tin ca có thời gian bắt đầu muộn nhất
                        //Nếu thời gian đặt vượt quá mốc này, coi như hôm đó không còn ca nào khả thi
                        timeList.reduce( (latestTime, time) => {
                            if(time.start_hour > latestTime[0]){
                                return [time.start_hour, time.start_minute, time.start_second];
                            }
                        }, [0,0,0]),
                    ).then( timeData => {
                        let latestTime = new Date(year, month, day, timeData[0], timeData[1], timeData[2]).getTime();
                        return latestTime;
                    }).then(latestTime => {
                        if(latestTime - now > 30*60*1000) {
                            return Promise.all(
                                timeList.map( time => {
                                    return new Date(year, month, day, time.start_hour, time.start_minute, time.start_second).getTime();
                                })
                            ).then( milSecs => {
                                milSecs = milSecs.filter(milSec => milSec - now > 30*60*1000)
                                let nextTime = Math.min(...milSecs);
                                let start_hour = new Date(nextTime).getHours();
                                let start_minute = new Date(nextTime).getMinutes();
                                let start_second = new Date(nextTime).getSeconds();
                                return helper.standardizeDate(start_hour, start_minute, start_second, day, month+1, year);
                            });
                        }
                        else {
                            let next = now + 24*60*60*1000;
                            let day = new Date(next).getDate();
                            let month = new Date(next).getMonth();
                            let year = new Date(next).getFullYear();
                            
                            let nextTime = timeList.find( time => time.code === 1);

                            return helper.standardizeDate(nextTime.start_hour, nextTime.start_minute, nextTime.start_second, day, month+1, year);
                        }
                    })
                }
                else {
                    let availableTimeSlot = null;
                    let now = new Date().getTime();
                    let pivotTime = now;
                    
                    do{
                        let day = new Date(pivotTime).getDate();
                        let month = new Date(pivotTime).getMonth();
                        let year = new Date(pivotTime).getFullYear();

                        let selectedDate = await DateSchema.findOne({
                            year: year,
                            month: month+1,
                            day: day,
                        });

                        if(!selectedDate) {
                            let nextTime = timeList.find( time => time.code === 1);

                            availableTimeSlot = helper.standardizeDate(nextTime.start_hour, nextTime.start_minute, nextTime.start_second, day, month+1, year);
                        }
                        else{
                            //Danh sách time slot hợp lệ trong selectedDate (is_booked = false)
                            await Promise.all(
                                timeSlotList.filter( slot => slot.shift.date.toString() === selectedDate._id.toString() && slot.is_booked === false)
                            ).then( validTimeSlotList => {
                                return Promise.all(
                                    validTimeSlotList.map( slot => slot.shift.time)
                                ).then( validTimeList => {
                                    return Promise.all(
                                        validTimeList.map( timeid => {
                                            let time = timeList.find( time => time._id.toString() === timeid.toString());
                                            return new Date(year, month, day, time.start_hour, time.start_minute, time.start_second).getTime();
                                        })
                                    ).then( milSecsList => {
                                        let validMilSecsList = milSecsList.filter( milSec => milSec>pivotTime+30*60*1000);
                                        if(validMilSecsList.length > 0) {
                                            let validMilSec = Math.min(...validMilSecsList);
                                            let validTime = new Date(validMilSec);
                                            let result = helper.standardizeDate(validTime.getHours(), validTime.getMinutes(), validTime.getSeconds(), day, month+1, year);
                                            return result;
                                        }
                                        else {
                                            return null;
                                        };
                                    })
                                })
                            }).then( data => {
                                availableTimeSlot = data;
                            });
                        }
                        let nextDate = now + 24*60*60*1000;
                        let nextDay = new Date(nextDate).getDate();
                        let nextMonth = new Date(nextDate).getMonth();
                        let nextYear = new Date(nextDate).getFullYear();
                        pivotTime = new Date(nextYear, nextMonth, nextDay, 0,0,1).getTime();
                    }
                    while(availableTimeSlot === null);

                    return availableTimeSlot;
                }
            })
        ).then( scheduleList => {
            Promise.all(
                nurseList.map( (nurse, index) => {
                    let isSave = savedList.some( element => element.nurseId.toString() === nurse._id.toString() );
                    return {
                        avatar: nurse.avatar,
                        fullname: nurse.fullname,
                        department: nurse.department,
                        average_score: nurse.average_score,
                        is_save: isSave,
                        closest_available_time: scheduleList[index],
                    };
                })
            ).then( nurseData => {
                if(!nurseData || nurseData.length === 0){
                    return res.status(500)
                        .send( helper.responseFailure(false, '500', 'Cannot access data'));
                }
                return res.status(200)
                    .send( helper.responseSuccess(true, '200', 'Successfully', nurseData));
            });
        });
    }
}

exports.getNurseById = async function(req, res, next) {
    let nurse = await NurseSchema.findOne({is_active: true, _id: req.params.id});
    if(!nurse) {
        return res.status(400)
            .send( helper.responseFailure(false, '400', 'This nurse does not exist'));
    }

    const savedList = await HealthbookSaveNurseSchema.find({healthbookId: req.healthbookId});
    let isSave = savedList.some( element => element.nurseId.toString() === nurse._id.toString() );

    TimeSlotSchema.find({nurse: nurse._id})
        .then( async (timeSlotList) => {
            timeSlotList = timeSlotList.filter(slot => {
                return slot.voting_data !== null;
            });
            Promise.all(
                timeSlotList = timeSlotList.map( async (slot) => {
                    let healthbook = await HealthbookSchema.findOne({_id: req.healthbookId});
                    let shift = await ShiftSchema.findOne({_id: slot.shift}).populate('date').exec();
                    let dateBooked = `${shift.date.day}/${shift.date.month}/${shift.date.year}`;
    
                    let data = {
                        avatar: healthbook.avatar,
                        user: healthbook.fullname,
                        comment: slot.voting_data.comment,
                        score: slot.voting_data.score,
                        date_booked: dateBooked,
                    };
                    
                    return data;
                })
            ).then( data => {
                return res.status(200)
                    .send( helper.responseSuccess(true, '200', 'Successfully', {
                        is_save: isSave,
                        nurse: nurse,
                        voting_data: data,
                    }));
            })
            .catch(err => {next(err);});
        })
        .catch( err => {
            return res.status(500)
                .send( helper.responseFailure(false, '500', 'Error', err));
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

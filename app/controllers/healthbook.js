const { validationResult } = require('express-validator');

const HealthbookSchema = require('../models/healthbook/healthbook');
const HealthbookSaveNurseSchema = require('../models/healthbook/healthbook_save_nurse');
const TimeSlotSchema = require('../models/nurse/time_slot');
const ShiftSchema = require('../models/other/shift');
const NurseSchema = require('../models/nurse/nurse');
const helper = require('../helper/index');

exports.createHealthbook = async function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .send( helper.responseFailure(false, '400', 'Invalid input', errors.array()) );
    }
    else {
        req.body.phone = helper.standardizePhoneNumber(req.body.phone);
        const checkExistHealthbook = await HealthbookSchema.findOne({phone: req.body.phone});
        if(checkExistHealthbook) {
            return res
                .status(400)
                .send( helper.responseFailure(false, '400', 'The healthbook is existed') );
        } else {
            let id = 0;
            if(parseInt(req.body.phone, 10)%2===0) {
                id = parseInt(req.body.phone, 10)/2 + parseInt(process.env.GEN_ID_SECRET_KEY, 10);
            } else {
                id = parseInt(req.body.phone, 10)/2 + 0.5 + parseInt(process.env.GEN_ID_SECRET_KEY, 10);
            }
            id = req.body.province_code + id.toString(10);

            let now = new Date();
            let dob = new Date(req.body.year, req.body.month-1, req.body.day);
            let age = now.getFullYear() - dob.getFullYear();
            dob = dob.getTime();

            let addressDetail = await helper.addressDetail(req.body.country_code, req.body.province_code, req.body.district_code, req.body.ward_code, req.body.address_detail);

            let address = {
                detail: addressDetail,
                country_code: req.body.country_code,
                province_code: req.body.province_code,
                district_code: req.body.district_code,
                ward_code: req.body.ward_code,
                lat: req.body.lat,
                lon: req.body.lon,
            };

            const Healthbook = new HealthbookSchema({
                id: id,
                userId: req.userId,
                type: req.body.type,
                fullname: req.body.fullname,
                phone: req.body.phone,
                gender: req.body.gender,
                dob: dob,
                age: age,
                address: address,
                height: req.body.height,
                weight: req.body.weight,
                symptom: req.body.symptom,
            });

            Healthbook.save();

            return res
                .status(200)
                .send( helper.responseSuccess(true, '200', 'Your healthbook has been created successfully!') );
        }
    }
}

exports.getHealthbook = async function (req, res, next) {
    const userId = req.userId;
    const healthbookList = await HealthbookSchema.find({userId: userId});

    let result = healthbookList.map(healthbook => {
        let gender = '';
        if(healthbook.gender === 1) gender = 'Male';
        else if(healthbook.gender === 2) gender = 'Female';
        else gender = 'Other';
        return {
            _id: healthbook._id,
            healthbook_id: healthbook.id,
            fullname: healthbook.fullname,
            avatar: healthbook.avatar,
            age: healthbook.age,
            gender: gender,
        };
    });

    return res
        .status(200)
        .send( helper.responseSuccess(true, '200', 'Successfully', result) );
}

exports.getHealthbookById = async function (req, res, next) {
    const healthbook = await HealthbookSchema.findOne({_id: req.params.id, userId: req.userId});
    if(!healthbook) {
        return res
            .status(400)
            .send( helper.responseFailure(false, '400', 'The health book with ID is not available') );
    }
    return res
        .status(200)
        .send( helper.responseSuccess(true, '200', 'Successfully', healthbook) );
}

exports.updateAvatar = async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .send( helper.responseFailure(false, '400', 'Invalid input', errors.array()) );
    }
    else {
        const healthbook = await HealthbookSchema.findOne({_id: req.params.id, userId: req.userId});
        if(!healthbook) {
            return res
                .status(400)
                .send( helper.responseFailure(false, '400', 'The health book with ID is not available') );
        }

        let avatar = {
            path: req.body.avatar,
        };

        const updateAvatar = await HealthbookSchema.findOneAndUpdate(
            {_id: req.params.id, userId: req.userId},
            {
                avatar: avatar,
                date_edited: Date.now(),
            }
        );

        if(!updateAvatar) {
            return res
                .status(400)
                .send( helper.responseFailure(false, '400', 'Update failed') );
        }

        return res
            .status(200)
            .send( helper.responseSuccess(true, '200', 'Update successful'));
    }
}

exports.updateFullname = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .send( helper.responseFailure(false, '400', 'Invalid input', errors.array()) );
    }
    else {
        const healthbook = await HealthbookSchema.findOne({_id: req.params.id, userId: req.userId});
        if(!healthbook) {
            return res
                .status(400)
                .send( helper.responseFailure(false, '400', 'The health book with ID is not available') );
        }
    
        const updateFullname = await HealthbookSchema.findOneAndUpdate(
            {_id: req.params.id, userId: req.userId},
            {
                fullname: req.body.fullname,
                date_edited: Date.now(),
            }
        );
    
        if(!updateFullname) {
            return res
                .status(400)
                .send( helper.responseFailure(false, '400', 'Update failed') );
        }
    
        return res
            .status(200)
            .send( helper.responseSuccess(true, '200', 'Update successful'));
    }
}

exports.updateDOB = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .send( helper.responseFailure(false, '400', 'Invalid input', errors.array()) );
    }
    else {
        const healthbook = await HealthbookSchema.findOne({_id: req.params.id, userId: req.userId});
        if(!healthbook) {
            return res
                .status(400)
                .send( helper.responseFailure(false, '400', 'The health book with ID is not available') );
        }
    
        let dob = new Date(req.body.year, req.body.month-1, req.body.day);
        let now = new Date();
    
        let age = now.getFullYear() - dob.getFullYear();
        dob = dob.getTime();
    
        const updateDOB = await HealthbookSchema.findOneAndUpdate(
            {_id: req.params.id, userId: req.userId},
            {
                dob: dob,
                age: age,
                date_edited: Date.now(),
            }
        );
    
        if(!updateDOB) {
            return res
                .status(400)
                .send( helper.responseFailure(false, '400', 'Update failed') );
        }
    
        return res
            .status(200)
            .send( helper.responseSuccess(true, '200', 'Update successful'));
    }
}

exports.updateGender = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .send( helper.responseFailure(false, '400', 'Invalid input', errors.array()) );
    }
    else {
        const healthbook = await HealthbookSchema.findOne({_id: req.params.id, userId: req.userId});
        if(!healthbook) {
            return res
                .status(400)
                .send( helper.responseFailure(false, '400', 'The health book with ID is not available') );
        }
    
        const updateGender = await HealthbookSchema.findOneAndUpdate(
            {_id: req.params.id, userId: req.userId},
            {
                gender: req.body.gender,
                date_edited: Date.now(),
            }
        )
    
        if(!updateGender) {
            return res
                .status(400)
                .send( helper.responseFailure(false, '400', 'Update failed') );
        }
    
        return res
            .status(200)
            .send( helper.responseSuccess(true, '200', 'Update successful'));
    }
}

exports.updatePhone = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .send( helper.responseFailure(false, '400', 'Invalid input', errors.array()) );
    }
    else {
        const healthbook = await HealthbookSchema.findOne({_id: req.params.id, userId: req.userId});
        if(!healthbook) {
            return res
                .status(400)
                .send( helper.responseFailure(false, '400', 'The healthbook with ID is not available') );
        }
    
        req.body.phone = helper.standardizePhoneNumber(req.body.phone);

        const validatePhone = await HealthbookSchema.findOne({ phone: req.body.phone });

        if(validatePhone) {
            return res
                .status(400)
                .send( helper.responseFailure(false, '400', 'This phone number is already in use for another account'));
        }
        else{
            const updatePhone = await HealthbookSchema.findOneAndUpdate(
                {_id: req.params.id, userId: req.userId},
                {
                    phone: req.body.phone,
                    date_edited: Date.now(),
                }
            )
        
            if(!updatePhone) {
                return res
                    .status(400)
                    .send( helper.responseFailure(false, '400', 'Update failed') );
            }
        
            return res
                .status(200)
                .send( helper.responseSuccess(true, '200', 'Update successful'));
        }
    }
}

exports.updateAddress = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .send( helper.responseFailure(false, '400', 'Invalid input', errors.array()) );
    }
    else {
        const healthbook = await HealthbookSchema.findOne({_id: req.params.id, userId: req.userId});
        if(!healthbook) {
            return res
                .status(400)
                .send( helper.responseFailure(false, '400', 'The health book with ID is not available') );
        }
    
        let addressDetail = await helper.addressDetail(req.body.country_code, req.body.province_code, req.body.district_code, req.body.ward_code, req.body.address_detail);
    
        let address = {
            detail: addressDetail,
            country_code: req.body.country_code,
            province_code: req.body.province_code,
            district_code: req.body.district_code,
            ward_code: req.body.ward_code,
            lat: req.body.lat,
            lon: req.body.lon,
        };
    
        const updateAddress = await HealthbookSchema.findOneAndUpdate(
            {_id: req.params.id, userId: req.userId},
            {
                address: address,
                date_edited: Date.now(),
            }
        );
    
        if(!updateAddress) {
            return res
                .status(400)
                .send( helper.responseFailure(false, '400', 'Update failed') );
        }
    
        return res
            .status(200)
            .send( helper.responseSuccess(true, '200', 'Update successful'));
    }
}

exports.updateHealthIndex = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .send( helper.responseFailure(false, '400', 'Invalid input', errors.array()) );
    }
    else {
        const healthbook = await HealthbookSchema.findOne({_id: req.params.id, userId: req.userId});
        if(!healthbook) {
            return res
                .status(400)
                .send( helper.responseFailure(false, '400', 'The health book with ID is not available') );
        }
    
        const update = await HealthbookSchema.findOneAndUpdate(
            {_id: req.params.id, userId: req.userId},
            {
                weight: req.body.weight,
                height: req.body.height,
                date_edited: Date.now(),
            }
        );
    
        if(!update) {
            return res
                .status(400)
                .send( helper.responseFailure(false, '400', 'Update failed') );
        }
    
        return res
            .status(200)
            .send( helper.responseSuccess(true, '200', 'Update successful'));
    }
}

exports.updateSymptom = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .send( helper.responseFailure(false, '400', 'Invalid input', errors.array()) );
    }
    else{
        const healthbook = await HealthbookSchema.findOne({_id: req.params.id, userId: req.userId});
        if(!healthbook) {
            return res
                .status(400)
                .send( helper.responseFailure(false, '400', 'The health book with ID is not available') );
        }
    
        const updateSymptom = await HealthbookSchema.findOneAndUpdate(
            {_id: req.params.id, userId: req.userId},
            {
                symptom: req.body.symptom,
                date_edited: Date.now(),
            }
        )
    
        if(!updateSymptom) {
            return res
                .status(400)
                .send( helper.responseFailure(false, '400', 'Update failed') );
        }
    
        return res
            .status(200)
            .send( helper.responseSuccess(true, '200', 'Update successful'));
    }
}

exports.saveNurse = async function (req, res, next) {
    const healthbookId = req.params.id;
    const nurseId = req.params.nurseId;

    const existSaveItem = await HealthbookSaveNurseSchema.findOne({
        healthbookId: healthbookId,
        nurseId: nurseId,
    });

    if(!existSaveItem) {
        const saveItem = new HealthbookSaveNurseSchema({
            healthbookId: healthbookId,
            nurseId: nurseId,
            status: true,
        });
    
        const saveResult = await saveItem.save();
    
        if(!saveResult) {
            return res
                .status(400)
                .send( helper.responseFailure(false, '400', 'Can not save'));
        } 
        else {
            return res
                .status(200)
                .send( helper.responseSuccess(false, '200', 'Successfully insert this nurse to the saving list.'));
        }
    }
    else {
        console.log(existSaveItem);
        let responseText = '';
        let status = false;
        if(existSaveItem.status) {
            status = false;
            responseText = 'Successfully remove this nurse from the saving list.';
        }
        else{
            status = true;
            responseText = 'Successfully insert this nurse to the saving list.';
        }

        const saveResult = await HealthbookSaveNurseSchema.findOneAndUpdate({
            healthbookId: healthbookId,
            nurseId: nurseId,
        }, {
            status: status,
            date_edited: Date.now(),
        } );

        if(!saveResult) {
            return res
                .status(400)
                .send( helper.responseFailure(false, '400', 'Can not save'));
        } 
        else {
            return res
            .status(200)
            .send( helper.responseSuccess(true, '200', responseText) );
        }
    }
}

exports.nurseBooking = async function (req, res, next) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res
            .status(400)
            .send( helper.responseFailure(false, '400', 'Invalid input', errors.array()) );
    }

    let timeSlot = await TimeSlotSchema.findOne({_id: req.body.time_slot});

    if(!timeSlot) {
        return res.status(400)
            .send( helper.responseFailure(false, '400', 'Invalid time slot'));
    }
    else{
        let now = new Date();
        let shift = await ShiftSchema.findOne({_id: timeSlot.shift}).populate('date').populate('time').exec();
        let limitTime = new Date(shift.date.year, shift.date.month-1, shift.date.day, shift.time.start_hour, shift.time.start_minute, shift.time.start_second);

        if(timeSlot.is_booked === true) {
            return res.status(400)
                .send( helper.responseFailure(false, '400', 'This time slot was booked by another user'));
        }
        else if(limitTime.getTime() - now.getTime() <= 30*60*1000) {
            return res.status(400)
                .send( helper.responseFailure(false, '400', 'Cannot book less than 30 minutes before start time'));
        }
        else{
            let healthbook = await HealthbookSchema.findOne({_id: req.params.id});
            let nurse = await NurseSchema.findOne({_id: req.params.nurseId});
    
            if(!healthbook || !nurse) {
                return res.status(400)
                    .send( helper.responseFailure(false, '400', 'Cannot find healthbook or nurse'));
            }
    
            if(timeSlot.healthbook === null) {
                let id = `${healthbook.address.province_code}ABCXYZ${shift.date.year}${shift.date.month}${shift.date.day}${shift.time.code}`;
                let start_time = helper.standardizeDate(shift.time.start_hour, shift.time.start_minute, shift.time.start_second, shift.date.day, shift.date.month, shift.date.year);
                let end_time = helper.standardizeDate(shift.time.end_hour, shift.time.end_minute, shift.time.end_second, shift.date.day, shift.date.month, shift.date.year);

                let bookingData = {
                    id: id,
                    request: req.body.request,
                    payment_method: req.body.payment_method,
                    coupon: req.body.coupon,
                    process: 1,
                    date_create: Date.now(),
                }
                
                const bookingResult = await TimeSlotSchema.findOneAndUpdate(
                    {_id: timeSlot._id},
                    {
                        healthbook: healthbook._id,
                        booking_data: bookingData,
                        is_booked: true,
                    }
                );
        
                if(!bookingResult) {
                    return res.status(500)
                        .send( helper.responseFailure(false, '500', 'Failed to book'));
                }
                else {
                    let data = {
                        id: id,
                        nurse_name: nurse.fullname,
                        start_time: start_time,
                        end_time: end_time,
                        address: healthbook.address.detail,
                        request: req.body.request,
                        payment_method: req.body.payment_method,
                    }
                    return res.status(200)
                        .send( helper.responseSuccess(true, '200', 'Successfully', data));
                }
            }
            else{
                return res.status(400)
                    .send( helper.responseFailure(false, '400', 'This booking was existed'));
            }
        }
    } 
}

exports.cancelBooking = async function (req, res, next) {
    const record = await TimeSlotSchema.findOne({_id: req.params.time_slot_id});

    if(!record) {
        return res.status(500)
            .send( helper.responseFailure(false, '400', 'The record was not booked'));
    }

    if(record.booking_data.process === 1) {
        TimeSlotSchema.findOneAndUpdate(
            {
                _id: req.params.time_slot_id,
                is_booked: true,
                healthbook: req.params.id,
            },
            {
                is_booked: false,
                healthbook: null,
                booking_data: null,
                voting_data: null,
            }
        ).then( response => {
            return res.status(200).send( helper.responseSuccess(true, '200', 'The record was canceled successfully', response._id));
        })
        .catch( error => {
            return res.status(500)
                .send( helper.responseFailure(false, '500', 'Failed to delete record', error));
        });
    }
    else {
        return res.status(500)
            .send( helper.responseFailure(false, '500', 'You cannot cancel this booking'));
    }
}

exports.nurseVoting = async function (req, res, next) {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400)
            .send( helper.responseFailure(false, '400', 'Invalid input', errors.array()) );
    }
    else {
        const record = await TimeSlotSchema.findOne({_id: req.params.time_slot_id});

        if(!record) {
            return res.status(500)
                .send( helper.responseFailure(false, '400', 'The record was not booked'));
        }

        req.body.score = parseInt(req.body.score, 10);

        let votingObject = {
            date_created: Date.now(),
            comment: req.body.comment,
            score: req.body.score,
        };

        let votingUpdate = await TimeSlotSchema.findOneAndUpdate(
            {
                _id: req.params.time_slot_id,
            },
            {
                voting_data: votingObject,
            }
        );
        
        //update nurse's average_score
        let recordList = await TimeSlotSchema.find({nurse: record.nurse});

        let sumScore = await recordList.reduce( (accumulator, record) => {
            if(record.voting_data !== null) {
                return accumulator + record.voting_data.score;
            }
            else{
                return accumulator;
            }
        }, 0);

        let recordListHasVote = await recordList.filter( record => record.voting_data !== null);
        let average_score = sumScore / (recordListHasVote.length);
        average_score = Math.round(average_score);

        let averageScoreUpdate = await NurseSchema.findOneAndUpdate({_id: record.nurse}, {average_score: average_score});

        if(!votingUpdate || !averageScoreUpdate) {
            return res.status(500)
                .send( helper.responseFailure(false, '500', 'Failed to comment'));
        }
        return res.status(200).send( helper.responseSuccess(true, '200', 'Comment successfully'));
    }
}

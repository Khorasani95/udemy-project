// const uuid = require('uuid');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place')
const User = require('../models/user')

const getPlacesById = async (req, res, next) => {
    console.log('Get Request in Places');
    const placeId = req.params.pid;

    let place;

    try {
        place = await Place.findById(placeId)

    } catch (err) {
        const error = new HttpError(
            'something went wrong while fetching place ',
            500
        );
        return next(error);
    }

    if (!place) {
        const error = new HttpError(
            'Could not find a place for the provided id.',
            404
        );
        return next(error);
    };

    res.json({ place: place.toObject({ getters: true }) });

}

const getPlaceByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    let userPlaces;

    try {
        userPlaces = await User.findById(userId).populate('places');
    } catch (err) {
        const error = new HttpError(
            'Fetching places failed, plz try agin later',
            500
        );
        return next(error);
    }
    if (!userPlaces) {
        const error = new HttpError(
            'Could not find a place for the provided user id.',
            404
        );
        return next(error);
    };

    res.json({ places: userPlaces.places.map(place => place.toObject({ getters: true })) })
};

const createPlace = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, plz check yuor data', 422));
    };

    const { title, description, address, creator } = req.body;

    let coordinates;
    try {
        coordinates = await getCoordsForAddress(address)
    } catch (error) {
        return next(error)
    }

    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image: 'https://picsum.photos/200/300',
        creator
    });


    let user;

    try {
        user = await User.findById(creator);
    } catch (err) {
        const error = new HttpError(
            'Creating place failed while finding a userID, plz try again,',
            500
        );
        return next(error);
    }

    if (!user) {
        const error = new HttpError('Could not find user for provided id,', 404)
        return next(error);
    };

    console.log(user);

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({ session: sess });
        user.places.push(createdPlace);
        await user.save({ session: sess });
        await sess.commitTransaction();

    } catch (err) {
        const error = new HttpError(
            'Creating place failed in transaction section, plz try again',
            500
        );
        return next(error);
    };

    res.status(201).json({ place: createdPlace })
}


const updatePlaces = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, plz check yuor data', 422)
        );
    };

    const { title, description } = req.body;
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId)
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update place.', 500
        );
        return next(error);
    }

    place.title = title;
    place.description = description;;
    sess

    try {
        await place.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong,, could not update place.', 500
        );
        return next(error);
    }

    res.status(200).json({ place: place.toObject({ getters: true }) })
}

const deletePlaces = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId).populate('creator');
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find place for deletion.', 500
        );
        return next(error);
    };

    if (!place) {
        const error = new HttpError(
            'could not find place for this id, in if(!place) section', 404);
        return next(error);
    }

    let sess;
    // try {
    //     sess = await mongoose.startSession();
    //     sess.startTransaction();

    //     // Deletrn Mongoose syntax)
    //     await Place.deleteOne({ _id: place._id }, { session: sess });

    //     place.creator.places.pull(place);
    //     await place.creator.save({ session: sess });

    //     await sess.commitTransaction();
    //     res.status(200).json({ message: 'Place deleted successfull'});

    //     // res.status(200).json({ message: 'Place deleted.' });
    // } catch (err) {
    //     // Rollback transaction if it was started
    //     if (sess && sess.inTransaction()) {
    //         ae the place (modewait sess.abortTransaction();
    //         sess.endSession();
    //     }

    //     console.error("Deletion error:", err); // Log actual error
    //     return next(
    //         new HttpError('Deleting place failed, please try again.', 500)
    //     );
    // }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        // await place.remove(); this is deprcated from mongoose and older syntax , will use deleteOne() and deleteMany()
        await place.deleteOne({ session: sess });
        place.creator.places.pull(place);
        // pull will remove the id so we don't have to explictly tell the mongoose to remove an id
        await place.creator.save({ session: sess });
        await sess.commitTransaction();
        console.log('place=>', place)
        console.log('place.creator.places=>', place.creator.places)

    } catch (err) {
        const error = new HttpError('Something went wrong while deleting a place, please try again later!', 500)
        return next(error);
    }
    
    res.status(200).json({ message: ' place Deleted.' });


};

exports.getPlacesById = getPlacesById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlaces = updatePlaces;
exports.deletePlaces = deletePlaces;
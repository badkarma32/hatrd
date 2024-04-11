const { model, Schema } = require('mongoose');

const schema = new Schema({
    guildId: String,
    userId: String,
    latestRep: {
        by: String,
        msg: String,
        rating: Number,
        time: Number,
    },
    averageRating: Number,
    totalReps: Number,
    reps: Array
})

module.exports = model('Reps_x', schema)
const mongoose = require('mongoose');


const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Tolong sertakan judul bootcamp'],
    maxlength: 100
  },
  text: {
    type: String,
    required: [true, 'Tolong sertakan nama Course']
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, 'Please add rating 1 - 10']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true
  },

});

// Make filter by one review per user
ReviewSchema.index({
  bootcamp: 1,
  user: 1
}, {
  unique: true
});

// Call static method to get avg cost
ReviewSchema.statics.getAverageRating = async function(bootcampId) {

  const arr_obj = await this.aggregate([{
      $match: {
        bootcamp: bootcampId
      },
    },
    {
      $group: {
        _id: '$bootcamp',
        averageRating: {
          $avg: '$rating'
        }
      }
    }

  ]);
  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageRating: arr_obj[0].averageRating
    })
  } catch (e) {
    console.error(e);
  }
}
// Call Get AverageCost After save
ReviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.bootcamp);
});
// Call Get AverageCost After remove
ReviewSchema.pre('remove', function() {
  this.constructor.getAverageRating(this.bootcamp);
})

module.exports = mongoose.model('Reviews', ReviewSchema);
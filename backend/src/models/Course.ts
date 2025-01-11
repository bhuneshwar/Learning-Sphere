import mongoose, { Document, Model } from 'mongoose';

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface ICourse extends Document {
  title: string;
  description: string;
  instructor: mongoose.Types.ObjectId;
  price: number;
  image: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  content: {
    title: string;
    description: string;
    videoUrl: string;
    duration: number;
    resources?: string[];
  }[];
  reviews: IReview[];
  rating: number;
  numReviews: number;
  enrolledStudents: mongoose.Types.ObjectId[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating between 1 and 5'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Please add a comment'],
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a course title'],
    unique: true,
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price must be at least 0']
  },
  image: {
    type: String,
    default: 'default-course.jpg'
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'Web Development',
      'Mobile Development',
      'Data Science',
      'Machine Learning',
      'DevOps',
      'Business',
      'Other'
    ]
  },
  level: {
    type: String,
    required: [true, 'Please add a difficulty level'],
    enum: ['beginner', 'intermediate', 'advanced']
  },
  content: [{
    title: {
      type: String,
      required: [true, 'Please add a content title']
    },
    description: {
      type: String,
      required: [true, 'Please add a content description']
    },
    videoUrl: {
      type: String,
      required: [true, 'Please add a video URL']
    },
    duration: {
      type: Number,
      required: [true, 'Please add video duration in minutes']
    },
    resources: [{
      type: String
    }]
  }],
  reviews: [ReviewSchema],
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating must not be more than 5'],
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Static method to calculate average rating
CourseSchema.statics.getAverageRating = async function(courseId: string) {
  const obj = await this.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(courseId) }
    },
    {
      $project: {
        averageRating: { $avg: '$reviews.rating' },
        numReviews: { $size: '$reviews' }
      }
    }
  ]);

  try {
    if (obj[0]) {
      await this.findByIdAndUpdate(courseId, {
        rating: Math.round(obj[0].averageRating * 10) / 10,
        numReviews: obj[0].numReviews
      });
    }
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
CourseSchema.post('save', function() {
  // @ts-ignore
  this.constructor.getAverageRating(this._id);
});

// Call getAverageRating before deleteOne
CourseSchema.pre('deleteOne', { document: true, query: false }, function() {
  // @ts-ignore
  this.constructor.getAverageRating(this._id);
});

export const Course: Model<ICourse> = mongoose.model<ICourse>('Course', CourseSchema);

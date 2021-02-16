import mongoose from 'mongoose';

const TournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for this tournament.'],
    maxlength: [140, 'Name cannot be longer than 140 characters']
  },
  category: {
    type: String,
    require: [true, 'Please provide a category for this tournament.'],
    maxlength: [50, 'Category cannot be longer than 50 characters']
  },
  contestants: {
    type: Array,
    default: []
  },
  bracket: {
    type: Array,
    default: []
  },
  started: {
    type: Boolean,
    default: false
  }
})

export default mongoose.models.Tournament || mongoose.model('Tournament', TournamentSchema);
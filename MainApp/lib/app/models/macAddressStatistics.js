import mongoose from 'mongoose';

const Schema = mongoose.Schema;


var macAddressStatistics=new Schema({
	mac: {// Hash of Mac address
		type: String,
		unique: true,
		required: true
	},
	count: { // Count of no of trials played from the mac address
		type: Number,
		required: true,
		
	},
	latestId: {// username of the latest trial played from the mac address
		type: String,
		required: true
	},
	allowMultipleTrials: {// flag to enable another trial from the same machine
		type: Boolean,
		required: true,
		
	}
});

export default mongoose.model('MacAddressStatistics', macAddressStatistics, 'macAddressStatistics');

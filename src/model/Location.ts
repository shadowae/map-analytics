import mongoose, { Document, Schema } from 'mongoose';

export interface ILocation extends Document {
	RecordId: string;
	InspectionType: 'FIR' | 'FQI' | 'RI';
	Estate: string;
	Block: string;
	Inspector: string;
	DateTime: Date;
	Coordinates: any[];
}

const LocationSchema: Schema = new Schema({
	RecordId: { type: String, required: true, unique: true },
	InspectionType: { type: String, enum: ['FIR', 'FQI', 'RI'], required: true },
	Estate: { type: String, required: true },
	Block: { type: String, required: true },
	Inspector: { type: String, required: true },
	DateTime: { type: Date, required: true },
	Coordinates: { type: Array, required: true }
});

LocationSchema.index({ InspectionType: 1, Estate: 1, Block: 1, Inspector: 1, DateTime: 1 });

export default mongoose.model<ILocation>('Location', LocationSchema);

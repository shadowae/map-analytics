import express, { Request, Response } from 'express';
import mongoose, {FilterQuery} from 'mongoose';
import cors from 'cors';
import Location, { ILocation } from './model/Location';

const app = express();
app.use(cors())
app.use(express.json());
const PORT = 3001;

const connectionString = 'mongodb+srv://satish:kroXSchtJuj7MiZ9@cluster0.f9eimcx.mongodb.net/?retryWrites=true&w=majority'

// Connect to MongoDB
mongoose.connect(connectionString)
.then(() => {
	console.log('Connected to MongoDB Atlas');
}).catch(err => {
	console.error('Error connecting to MongoDB Atlas', err);
});

app.get('/api/getRecords', async (req: Request, res: Response) => {
	try {
		const { InspectionType, Estate, Block, Inspector, DateTime } = req.query;
		
		// Construct MongoDB query based on filters
		const query: Partial<ILocation> = {};
		if (InspectionType) query.InspectionType = InspectionType as 'FIR' | 'FQI' | 'RI';
		if (Estate) query.Estate = Estate as string;
		if (Block) query.Block = Block as string;
		if (Inspector) query.Inspector = Inspector as string;
		if (DateTime) query.DateTime = new Date(DateTime as string);
		
		// Fetch matching location records
		const records = await Location.find(query as FilterQuery<ILocation>);
		
		res.status(200).json(records);
	} catch (error) {
		res.status(500).json({ message: 'An error occurred', error });
	}
});

app.put('/api/createRecord', async (req: Request, res: Response) => {
	try {
		const { RecordId, InspectionType, Estate, Block, Inspector, DateTime, Coordinates } = req.body;
		
		// Validate the incoming data (you can add more robust validation here)
		if (!RecordId || !InspectionType || !Estate || !Block || !Inspector || !DateTime || !Coordinates) {
			return res.status(400).json({ message: 'Missing required fields' });
		}
		
		// Create a new record
		const newRecord: ILocation = new Location({
			RecordId,
			InspectionType,
			Estate,
			Block,
			Inspector,
			DateTime: new Date(DateTime),
			Coordinates
		});
		
		// Save the record to MongoDB
		await newRecord.save();
		
		res.status(201).json({ message: 'Record created successfully', newRecord });
	} catch (error) {
		res.status(500).json({ message: 'An error occurred', error });
	}
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});

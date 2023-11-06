import Documents from "../models/Documents.js";
import User from "../models/User.js";

export const uploadDocumet = async (req, res) => {
    const userId = req.userId
    const path = req.file.path;

    const { documentName } = req.body

    console.log(documentName, path)

    try {
        if (!req.file) {
            return res.status(400).json({ error: true, message: "No file uploaded" });
        }

        const user = await User.findById(userId)

        if (!user) return res.json({ error: true, message: 'Unauthorized access' })

        res.status(201).json({ error: false, message: "Document uploaded successully", filePath: path });

    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ error: true, message: "internal server error" });
    }

}

export const submitDocument = async (req, res) => {
    const { aadharCardFront, aadharCardBack, drivingLicense } = req.body

    console.log('object')

    console.log(aadharCardFront, aadharCardBack, drivingLicense, req.body)
    const userId = req.userId

    try {
        if (!aadharCardFront.length) return res.status(404).json({ error: true, message: 'Aadhar Card Front is required' })
        if (!aadharCardBack?.length) return res.status(404).json({ error: true, message: 'Aadhar Card back is required' })
        if (!drivingLicense?.length) return res.status(404).json({ error: true, message: 'Driving License is required' })

        const user = await User.findById(userId)

        console.log(user)

        if (!user) return res.status(401).json({ error: true, message: 'Unautorized access' })

        const newDocument = new Documents({
            user: userId,
            aadharCardFront,
            aadharCardBack,
            drivingLicense
        })

        await newDocument.save()

        res.status(200).json({ error: false, message: 'Document submited successfully', document: newDocument })

    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ error: true, message: "internal server error" });
    }
}
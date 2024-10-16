import { MatchModel } from "../../../../DB/models/match.model.js";
import fs from "fs";
import path from "path";
export const addMatch = async (req, res, next) => {
    const { championship, round, TeamAName, TeamBName, date, time, streamUrl } = req.body;

    console.log(req.body);
    console.log(req.files);

    if (!req?.files?.image1 || !req?.files?.image2) {
        return next(new Error('Images is required', { cause: 409 }));
    }
    await MatchModel.create({
        championship,
        round,
        TeamA: {
            name: TeamAName,
            OpenImage: `${process.env.IMAGE_URI}${req?.files?.image1[0].finalDest}`,
            DeleteImage: req?.files?.image1[0].path
        },
        TeamB: {
            name: TeamBName,
            OpenImage: `${process.env.IMAGE_URI}${req?.files?.image2[0].finalDest}`,
            DeleteImage: req?.files?.image2[0].path
        },
        date,
        time,
        streamUrl
    })
    res.status(201).json({ status: "true", message: 'Match added successfully' })
}
export const updateMatch = async (req, res, next) => {
    const { _id } = req.params;
    const { championship, round, TeamAName, TeamBName, date, time, streamUrl } = req.body;
    const match = await MatchModel.findByIdAndUpdate(
        _id,
        {
            $set: {
                'TeamA.name': TeamAName,
                'TeamB.name': TeamBName,
                championship,
                round,
                date,
                time,
                streamUrl
            }
        }
    );
    if (!match) {
        return next(new Error('Match not found ', { cause: 404 }))
    }
    res.status(200).json({ status: "true", message: 'Match updated successfully' })
}
export const updateMatchImages = async (req, res, next) => {
    const { _id } = req.params;
    const match = await MatchModel.findById(_id);
    if (!match) {
        return next(new Error('Match not found ', { cause: 404 }))
    }
    if (match?.TeamA?.DeleteImage) {
        const imagePath = path.resolve(match?.TeamA.DeleteImage); // Remove leading slash
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error('Error deleting image file:', err);
                return res.status(500).json({ status: "false", message: 'Error deleting image file' });
            }
        });
    }
    if (match?.TeamB?.DeleteImage) {
        const imagePath = path.resolve(match?.TeamB.DeleteImage); // Remove leading slash
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error('Error deleting image file:', err);
                return res.status(500).json({ status: "false", message: 'Error deleting image file' });
            }
        });
    }

    await MatchModel.updateOne(
        { _id },
        {
            $set: {
                'TeamA.OpenImage': `${process.env.IMAGE_URI}${req?.files?.image1[0].finalDest}`,
                'TeamA.DeleteImage': req?.files?.image1[0].path,
                'TeamB.OpenImage': `${process.env.IMAGE_URI}${req?.files?.image2[0].finalDest}`,
                'TeamB.DeleteImage': req?.files?.image2[0].path,

            }
        }
    );



    res.status(200).json({ status: "true", message: 'Match updated successfully' })
}
export const deleteMatch = async (req, res, next) => {
    const { _id } = req.params;
    const match = await MatchModel.findByIdAndDelete(_id)
    if (!match) {
        return next(new Error('Match not found ', { cause: 404 }))
    }
    if (match?.TeamA?.DeleteImage) {
        const imagePath = path.resolve(match?.TeamA.DeleteImage); // Remove leading slash
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error('Error deleting image file:', err);
                return res.status(500).json({ status: "false", message: 'Error deleting image file' });
            }
        });
    }
    if (match?.TeamB?.DeleteImage) {
        const imagePath = path.resolve(match?.TeamB.DeleteImage); // Remove leading slash
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error('Error deleting image file:', err);
                return res.status(500).json({ status: "false", message: 'Error deleting image file' });
            }
        });
    }
    res.status(200).json({ status: "true", message: 'Match deleted successfully' })
}
export const getMatches = async (req, res, next) => {
    const Matches = await MatchModel.find({})
    res.status(200).json({ status: "true", data: Matches })
}
export const getOneMatch = async (req, res, next) => {
    const { _id } = req.body;
    const Match = await MatchModel.findById(_id)
    if (!Match) {
        return next(new Error('Match not found ', { cause: 404 }))
    }
    res.status(200).json({ status: "true", data: Match })
}

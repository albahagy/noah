import { connection } from "../DB/connection.js";
import { ChannelModel } from "../DB/models/chaneel.model.js";
import { MovieModel } from "../DB/models/movie.model.js";
import { NotificationModel } from "../DB/models/notification.model.js";
import { SeriesModel } from "../DB/models/series.model.js";
import { auth } from "./middelware/auth.js";
import { authRouter } from "./modules/auth/auth.router.js";
import { categoryRouter } from "./modules/category/category.router.js";
import { chaneelRouter } from "./modules/chaneel/chaneel.router.js";
import { matchRouter } from "./modules/match/match.router.js";
import { movieRouter } from "./modules/movie/movie.router.js";
import { seriesRouter } from "./modules/series/series.router.js";
import { catchErorr, globalErorr } from "./utils/handelError.js";
import path, { dirname } from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const bootstrap = (app, express, sendNotificationToAll) => {
    connection()
    app.use(express.json())
    app.use('/api/auth', authRouter)
    app.use('/api/category', categoryRouter)
    app.use('/api/movie', movieRouter)
    app.use('/api/chaneel', chaneelRouter)
    app.use('/api/match', matchRouter)
    app.use('/api/series', seriesRouter)
    
    app.post('/api/sendNoti', catchErorr(auth()), catchErorr(async (req, res, next) => {
        const { title, body, screen } = req.body
        await NotificationModel.create({ title, body, screen })
        sendNotificationToAll(title, body, screen)

        return res.status(201).json({ status: "true", message: 'Notification added successfully' });
    }))
    app.get('/api/getNotifications', catchErorr(auth()), catchErorr(async (req, res, next) => {
        const notis = await NotificationModel.find({})
        return res.status(201).json({ status: "true", data: notis });
    }))
    app.delete('/api/clearNoti', catchErorr(auth()), catchErorr(async (req, res, next) => {
        await NotificationModel.deleteMany({})
        return res.status(201).json({ status: "true", message: "Notifications deleted successfully" });
    }))

    app.get('/api/search/:searchKey', catchErorr(async (req, res, next) => {
        const { searchKey } = req.params
        const movies = await MovieModel.find({ title: searchKey })
        const series = await SeriesModel.find({ title: searchKey })
        const channels = await ChannelModel.find({ title: searchKey })
        return res.status(201).json({ status: "true", data: [...movies, ...series, ...channels] });
    }))
    app.use(express.static(path.join(__dirname, 'public')));
    app.get('/api/download-apk', async (req, res) => {

        const filePath = path.join(__dirname, 'public', 'app-armeabi-v7a-release.apk');
        res.setHeader('Content-Disposition', 'attachment; filename=your-app.apk');
        res.setHeader('Content-Type', 'application/vnd.android.package-archive');
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Error occurred while downloading APK:', err);
                res.status(500).send('Error occurred while downloading APK');
            }
        });
    });
    app.use(globalErorr)
}
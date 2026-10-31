import argon2 from 'argon2';
import mongoose from 'mongoose';
import { z } from 'zod';
const pageQuery = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    q: z.string().trim().optional(),
});
export function registerAdminRoutes(app, models, helpers) {
    const { User, Surprise, Wish, Report, MediaMeta, AppSettings, AdminNotification, Frame, Reaction, Person, Job, Session } = models;
    const { auth, body, serializeSurprise, serializeWish, contributeUrl, contributeToken, ensureContributeToken, shareToken, hashToken, notFound, unlinkSafe } = helpers;
    const requireAdmin = async (request) => {
        const payload = await auth(request);
        const user = await User.findById(payload.sub);
        if (!user || user.role !== 'admin') {
            throw Object.assign(new Error('Admin access required.'), { statusCode: 403 });
        }
        if (user.lifecycle === 'suspended') {
            throw Object.assign(new Error('Account suspended.'), { statusCode: 403 });
        }
        return { payload, user };
    };
    const serializeUser = (user) => ({
        id: String(user._id),
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role ?? 'user',
        lifecycle: user.lifecycle ?? 'active',
        birthday: user.birthday,
        createdAt: user.createdAt?.toISOString(),
    });
    const serializeReport = (item) => ({
        id: String(item._id),
        surpriseId: String(item.surpriseId),
        wishId: String(item.wishId),
        reason: item.reason,
        details: item.details,
        status: item.status ?? 'pending',
        reporterId: item.reporterId ? String(item.reporterId) : undefined,
        createdAt: item.createdAt?.toISOString(),
        resolvedAt: item.resolvedAt?.toISOString(),
    });
    const serializeFrame = (item) => ({
        id: String(item._id),
        key: item.key,
        title: item.title,
        imageUrl: item.imageUrl,
        active: item.active !== false,
        sortOrder: item.sortOrder ?? 0,
    });
    const getSettings = async () => {
        let settings = await AppSettings.findOne();
        if (!settings) {
            settings = await AppSettings.create({});
        }
        return settings;
    };
    const removeMedia = async (filter) => {
        const media = await MediaMeta.find(filter);
        media.forEach(item => item.filename && unlinkSafe(item.filename));
        await MediaMeta.deleteMany(filter);
    };
    const removeSurprise = async (id) => {
        const surprise = await Surprise.findById(id);
        if (!surprise)
            throw notFound('Surprise not found.');
        const wishes = await Wish.find({ surpriseId: surprise._id });
        await removeMedia({ $or: [{ surpriseId: surprise._id }, { uri: { $in: (surprise.media ?? []).map((item) => item.uri) } }, { uri: { $in: wishes.flatMap((wish) => (wish.media ?? []).map((item) => item.uri)) } }] });
        await Promise.all([Wish.deleteMany({ surpriseId: surprise._id }), Report.deleteMany({ surpriseId: surprise._id }), Reaction.deleteMany({ surpriseId: surprise._id }), Job.deleteMany({ surpriseId: surprise._id }), Surprise.deleteOne({ _id: surprise._id })]);
    };
    app.get('/v1/admin/me', async (request) => {
        const { user } = await requireAdmin(request);
        return { user: serializeUser(user) };
    });
    app.get('/v1/admin/frames', async (request) => {
        await requireAdmin(request);
        return { frames: (await Frame.find().sort({ sortOrder: 1, title: 1 })).map(serializeFrame) };
    });
    app.post('/v1/admin/frames', async (request) => {
        await requireAdmin(request);
        const input = body(z.object({
            key: z.string().trim().regex(/^[a-z0-9-]{2,40}$/),
            title: z.string().trim().min(2).max(60),
            imageUrl: z.string().url().max(2048),
            active: z.boolean().default(true),
            sortOrder: z.number().int().min(0).max(1000).default(0),
        }), request.body);
        const frame = await Frame.create(input);
        return { frame: serializeFrame(frame) };
    });
    app.patch('/v1/admin/frames/:id', async (request) => {
        await requireAdmin(request);
        const { id } = request.params;
        if (!mongoose.isValidObjectId(id))
            throw notFound('Frame not found.');
        const input = body(z.object({
            title: z.string().trim().min(2).max(60).optional(),
            imageUrl: z.string().url().max(2048).optional(),
            active: z.boolean().optional(),
            sortOrder: z.number().int().min(0).max(1000).optional(),
        }), request.body);
        const frame = await Frame.findByIdAndUpdate(id, input, { new: true });
        if (!frame)
            throw notFound('Frame not found.');
        return { frame: serializeFrame(frame) };
    });
    app.delete('/v1/admin/frames/:id', async (request) => {
        await requireAdmin(request);
        const { id } = request.params;
        if (!mongoose.isValidObjectId(id))
            throw notFound('Frame not found.');
        const frame = await Frame.findByIdAndDelete(id);
        if (!frame)
            throw notFound('Frame not found.');
        return { ok: true };
    });
    app.get('/v1/admin/stats', async (request) => {
        await requireAdmin(request);
        const [surprises, wishes, users, reportsPending, occasionAgg, wishDays] = await Promise.all([
            Surprise.countDocuments(),
            Wish.countDocuments({ moderation: { $ne: 'hidden' } }),
            User.countDocuments({ role: { $ne: 'admin' } }),
            Report.countDocuments({ status: 'pending' }),
            Surprise.aggregate([{ $group: { _id: '$occasion', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 8 }]),
            Wish.aggregate([
                { $match: { createdAt: { $gte: new Date(Date.now() - 14 * 86400000) } } },
                { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
                { $sort: { _id: 1 } },
            ]),
        ]);
        const recentSurprises = await Surprise.find().sort({ createdAt: -1 }).limit(5);
        const recentReports = await Report.find().sort({ createdAt: -1 }).limit(5);
        return {
            totals: { surprises, wishes, users, reports: reportsPending },
            occasions: occasionAgg.map((row) => ({ occasion: row._id || 'Other', count: row.count })),
            wishesTrend: wishDays.map((row) => ({ date: row._id, count: row.count })),
            recentSurprises: recentSurprises.map((item) => serializeSurprise(item)),
            recentReports: recentReports.map(serializeReport),
        };
    });
    app.get('/v1/admin/analytics', async (request) => {
        await requireAdmin(request);
        const [byStatus, byKind, wishesTrend, occasions] = await Promise.all([
            Surprise.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
            Wish.aggregate([
                { $unwind: { path: '$media', preserveNullAndEmptyArrays: true } },
                { $group: { _id: { $ifNull: ['$media.kind', 'text'] }, count: { $sum: 1 } } },
            ]),
            Wish.aggregate([
                { $match: { createdAt: { $gte: new Date(Date.now() - 30 * 86400000) } } },
                { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
                { $sort: { _id: 1 } },
            ]),
            Surprise.aggregate([{ $group: { _id: '$occasion', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
        ]);
        return {
            byStatus: byStatus.map((row) => ({ status: row._id, count: row.count })),
            byKind: byKind.map((row) => ({ kind: row._id, count: row.count })),
            wishesTrend: wishesTrend.map((row) => ({ date: row._id, count: row.count })),
            occasions: occasions.map((row) => ({ occasion: row._id || 'Other', count: row.count })),
        };
    });
    app.get('/v1/admin/surprises', async (request) => {
        await requireAdmin(request);
        const query = body(pageQuery.extend({
            status: z.enum(['draft', 'scheduled', 'live', 'expired']).optional(),
            occasion: z.string().optional(),
        }), request.query);
        const filter = {};
        if (query.status)
            filter.status = query.status;
        if (query.occasion)
            filter.occasion = query.occasion;
        if (query.q) {
            filter.$or = [
                { title: new RegExp(query.q, 'i') },
                { recipientName: new RegExp(query.q, 'i') },
            ];
        }
        const skip = (query.page - 1) * query.limit;
        const [items, total] = await Promise.all([
            Surprise.find(filter).sort({ createdAt: -1 }).skip(skip).limit(query.limit),
            Surprise.countDocuments(filter),
        ]);
        const wishCounts = await Wish.aggregate([
            { $match: { surpriseId: { $in: items.map(item => item._id) }, moderation: { $ne: 'hidden' } } },
            { $group: { _id: '$surpriseId', count: { $sum: 1 } } },
        ]);
        const countMap = new Map(wishCounts.map((row) => [String(row._id), row.count]));
        return {
            total,
            page: query.page,
            limit: query.limit,
            surprises: items.map((item) => ({
                ...serializeSurprise(item, item.shareTokenHash ? shareToken(String(item._id)) : undefined),
                creatorId: String(item.creatorId),
                wishCount: countMap.get(String(item._id)) ?? 0,
                createdAt: item.createdAt?.toISOString(),
            })),
        };
    });
    app.get('/v1/admin/surprises/:id', async (request) => {
        await requireAdmin(request);
        const { id } = request.params;
        if (!mongoose.isValidObjectId(id))
            throw notFound('Surprise not found.');
        const surprise = await Surprise.findById(id);
        if (!surprise)
            throw notFound('Surprise not found.');
        const creator = await User.findById(surprise.creatorId);
        const wishes = await Wish.find({ surpriseId: id }).sort({ createdAt: -1 }).limit(200);
        return {
            surprise: {
                ...serializeSurprise(surprise, surprise.shareTokenHash ? shareToken(String(surprise._id)) : undefined),
                creatorId: String(surprise.creatorId),
                creator: creator ? serializeUser(creator) : null,
                createdAt: surprise.createdAt?.toISOString(),
            },
            wishes: wishes.map(serializeWish),
        };
    });
    app.patch('/v1/admin/surprises/:id', async (request) => {
        await requireAdmin(request);
        const { id } = request.params;
        const input = body(z.object({
            title: z.string().trim().min(1).max(100).optional(),
            occasion: z.string().trim().min(1).max(40).optional(),
            recipientName: z.string().trim().min(1).max(80).optional(),
            message: z.string().trim().min(1).max(2000).optional(),
            status: z.enum(['draft', 'scheduled', 'live', 'expired']).optional(),
            allowWishes: z.boolean().optional(),
            keepSurprise: z.boolean().optional(),
            anonymous: z.boolean().optional(),
            contributeEnabled: z.boolean().optional(),
        }), request.body);
        if (!mongoose.isValidObjectId(id))
            throw notFound('Surprise not found.');
        const surprise = await Surprise.findByIdAndUpdate(id, input, { new: true });
        if (!surprise)
            throw notFound('Surprise not found.');
        return { surprise: serializeSurprise(surprise) };
    });
    app.post('/v1/admin/surprises/:id/invite/regenerate', async (request) => {
        await requireAdmin(request);
        const { id } = request.params;
        const surprise = await Surprise.findById(id);
        if (!surprise)
            throw notFound('Surprise not found.');
        const token = await ensureContributeToken(surprise, true);
        return { url: contributeUrl(token), invite: serializeSurprise(surprise).invite };
    });
    app.delete('/v1/admin/surprises/:id', async (request) => {
        await requireAdmin(request);
        const { id } = request.params;
        if (!mongoose.isValidObjectId(id))
            throw notFound('Surprise not found.');
        await removeSurprise(id);
        return { ok: true };
    });
    app.post('/v1/admin/surprises/:id/invite/disable', async (request) => {
        await requireAdmin(request);
        const { id } = request.params;
        const surprise = await Surprise.findByIdAndUpdate(id, { contributeEnabled: false }, { new: true });
        if (!surprise)
            throw notFound('Surprise not found.');
        return { invite: serializeSurprise(surprise).invite };
    });
    app.get('/v1/admin/wishes', async (request) => {
        await requireAdmin(request);
        const query = body(pageQuery.extend({ moderation: z.enum(['visible', 'hidden', 'reported']).optional() }), request.query);
        const filter = {};
        if (query.moderation)
            filter.moderation = query.moderation;
        if (query.q) {
            filter.$or = [{ authorName: new RegExp(query.q, 'i') }, { message: new RegExp(query.q, 'i') }];
        }
        const skip = (query.page - 1) * query.limit;
        const [items, total] = await Promise.all([
            Wish.find(filter).sort({ createdAt: -1 }).skip(skip).limit(query.limit),
            Wish.countDocuments(filter),
        ]);
        return {
            total,
            page: query.page,
            limit: query.limit,
            wishes: items.map((item) => ({
                ...serializeWish(item),
                surpriseId: String(item.surpriseId),
            })),
        };
    });
    app.get('/v1/admin/wishes/:id', async (request) => {
        await requireAdmin(request);
        const { id } = request.params;
        if (!mongoose.isValidObjectId(id))
            throw notFound('Wish not found.');
        const wish = await Wish.findById(id);
        if (!wish)
            throw notFound('Wish not found.');
        const surprise = await Surprise.findById(wish.surpriseId);
        return {
            wish: { ...serializeWish(wish), surpriseId: String(wish.surpriseId) },
            surprise: surprise ? serializeSurprise(surprise) : null,
        };
    });
    app.patch('/v1/admin/wishes/:id', async (request) => {
        await requireAdmin(request);
        const { id } = request.params;
        const input = body(z.object({ moderation: z.enum(['visible', 'hidden', 'reported']) }), request.body);
        if (!mongoose.isValidObjectId(id))
            throw notFound('Wish not found.');
        const wish = await Wish.findByIdAndUpdate(id, input, { new: true });
        if (!wish)
            throw notFound('Wish not found.');
        return { wish: serializeWish(wish) };
    });
    app.delete('/v1/admin/wishes/:id', async (request) => {
        await requireAdmin(request);
        const { id } = request.params;
        if (!mongoose.isValidObjectId(id))
            throw notFound('Wish not found.');
        const wish = await Wish.findByIdAndUpdate(id, { moderation: 'hidden' }, { new: true });
        if (!wish)
            throw notFound('Wish not found.');
        return { ok: true, wish: serializeWish(wish) };
    });
    app.get('/v1/admin/reports', async (request) => {
        await requireAdmin(request);
        const query = body(pageQuery.extend({ status: z.enum(['pending', 'resolved', 'dismissed']).optional() }), request.query);
        const filter = {};
        if (query.status)
            filter.status = query.status;
        const skip = (query.page - 1) * query.limit;
        const [items, total] = await Promise.all([
            Report.find(filter).sort({ createdAt: -1 }).skip(skip).limit(query.limit),
            Report.countDocuments(filter),
        ]);
        return { total, page: query.page, limit: query.limit, reports: items.map(serializeReport) };
    });
    app.get('/v1/admin/reports/:id', async (request) => {
        await requireAdmin(request);
        const { id } = request.params;
        if (!mongoose.isValidObjectId(id))
            throw notFound('Report not found.');
        const report = await Report.findById(id);
        if (!report)
            throw notFound('Report not found.');
        const wish = await Wish.findById(report.wishId);
        const surprise = await Surprise.findById(report.surpriseId);
        return {
            report: serializeReport(report),
            wish: wish ? serializeWish(wish) : null,
            surprise: surprise ? serializeSurprise(surprise) : null,
        };
    });
    app.patch('/v1/admin/reports/:id', async (request) => {
        await requireAdmin(request);
        const { id } = request.params;
        const input = body(z.object({ status: z.enum(['pending', 'resolved', 'dismissed']), hideWish: z.boolean().optional() }), request.body);
        if (!mongoose.isValidObjectId(id))
            throw notFound('Report not found.');
        const report = await Report.findById(id);
        if (!report)
            throw notFound('Report not found.');
        report.status = input.status;
        report.resolvedAt = input.status === 'pending' ? undefined : new Date();
        await report.save();
        if (input.hideWish || input.status === 'resolved') {
            await Wish.findByIdAndUpdate(report.wishId, { moderation: 'hidden' });
        }
        return { report: serializeReport(report) };
    });
    app.get('/v1/admin/users', async (request) => {
        await requireAdmin(request);
        const query = body(pageQuery.extend({ lifecycle: z.enum(['active', 'suspended']).optional() }), request.query);
        const filter = { role: { $ne: 'admin' } };
        if (query.lifecycle)
            filter.lifecycle = query.lifecycle;
        if (query.q) {
            filter.$or = [{ name: new RegExp(query.q, 'i') }, { email: new RegExp(query.q, 'i') }, { phoneNumber: new RegExp(query.q, 'i') }];
        }
        const skip = (query.page - 1) * query.limit;
        const [items, total] = await Promise.all([
            User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(query.limit),
            User.countDocuments(filter),
        ]);
        return { total, page: query.page, limit: query.limit, users: items.map(serializeUser) };
    });
    app.get('/v1/admin/users/:id', async (request) => {
        await requireAdmin(request);
        const { id } = request.params;
        if (!mongoose.isValidObjectId(id))
            throw notFound('User not found.');
        const user = await User.findById(id);
        if (!user)
            throw notFound('User not found.');
        const [surpriseCount, wishCount] = await Promise.all([
            Surprise.countDocuments({ creatorId: id }),
            Wish.countDocuments({ fingerprint: { $exists: true } }),
        ]);
        const surprises = await Surprise.find({ creatorId: id }).sort({ createdAt: -1 }).limit(20);
        return {
            user: serializeUser(user),
            stats: { surprises: surpriseCount, wishes: wishCount },
            surprises: surprises.map((item) => serializeSurprise(item)),
        };
    });
    app.patch('/v1/admin/users/:id', async (request) => {
        await requireAdmin(request);
        const { id } = request.params;
        const input = body(z.object({ lifecycle: z.enum(['active', 'suspended']).optional(), role: z.enum(['user', 'admin']).optional() }), request.body);
        if (!mongoose.isValidObjectId(id))
            throw notFound('User not found.');
        const user = await User.findByIdAndUpdate(id, input, { new: true });
        if (!user)
            throw notFound('User not found.');
        return { user: serializeUser(user) };
    });
    app.get('/v1/admin/media', async (request) => {
        await requireAdmin(request);
        const query = body(pageQuery.extend({ kind: z.enum(['image', 'audio', 'music', 'video']).optional() }), request.query);
        const filter = {};
        if (query.kind)
            filter.kind = query.kind;
        if (query.q)
            filter.name = new RegExp(query.q, 'i');
        const skip = (query.page - 1) * query.limit;
        const [items, total] = await Promise.all([
            MediaMeta.find(filter).sort({ createdAt: -1 }).skip(skip).limit(query.limit),
            MediaMeta.countDocuments(filter),
        ]);
        return {
            total,
            page: query.page,
            limit: query.limit,
            media: items.map((item) => ({
                id: String(item._id),
                kind: item.kind,
                uri: item.uri,
                name: item.name,
                filename: item.filename,
                ownerId: String(item.ownerId),
                surpriseId: item.surpriseId ? String(item.surpriseId) : undefined,
                createdAt: item.createdAt?.toISOString(),
            })),
        };
    });
    app.delete('/v1/admin/users/:id', async (request) => {
        const { payload } = await requireAdmin(request);
        const { id } = request.params;
        if (!mongoose.isValidObjectId(id))
            throw notFound('User not found.');
        if (id === payload.sub)
            throw Object.assign(new Error('You cannot delete the signed-in administrator.'), { statusCode: 400 });
        const user = await User.findById(id);
        if (!user)
            throw notFound('User not found.');
        if (user.role === 'admin')
            throw Object.assign(new Error('Admin accounts cannot be deleted here.'), { statusCode: 400 });
        const surprises = await Surprise.find({ creatorId: id }).select('_id');
        for (const surprise of surprises)
            await removeSurprise(String(surprise._id));
        await Promise.all([Person.deleteMany({ ownerId: id }), Session.deleteMany({ userId: id }), User.deleteOne({ _id: id })]);
        return { ok: true };
    });
    app.delete('/v1/admin/media/:id', async (request) => {
        await requireAdmin(request);
        const { id } = request.params;
        if (!mongoose.isValidObjectId(id))
            throw notFound('Media not found.');
        const item = await MediaMeta.findByIdAndDelete(id);
        if (!item)
            throw notFound('Media not found.');
        if (item.filename)
            unlinkSafe(item.filename);
        return { ok: true };
    });
    app.get('/v1/admin/invite-links', async (request) => {
        await requireAdmin(request);
        const query = body(pageQuery, request.query);
        const filter = { contributeTokenHash: { $exists: true, $ne: null }, allowWishes: { $ne: false } };
        const skip = (query.page - 1) * query.limit;
        const [items, total] = await Promise.all([
            Surprise.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(query.limit),
            Surprise.countDocuments(filter),
        ]);
        const creators = await User.find({ _id: { $in: items.map(item => item.creatorId) } });
        const creatorMap = new Map(creators.map(user => [String(user._id), user]));
        return {
            total,
            page: query.page,
            limit: query.limit,
            links: items.map((item) => {
                const salt = item.contributeTokenSalt || 'v1';
                const token = contributeToken(String(item._id), salt);
                const url = item.contributeTokenHash === hashToken(token) ? contributeUrl(token) : null;
                const creator = creatorMap.get(String(item.creatorId));
                return {
                    surpriseId: String(item._id),
                    title: item.title,
                    recipientName: item.recipientName,
                    url,
                    invite: serializeSurprise(item).invite,
                    creator: creator ? serializeUser(creator) : null,
                    updatedAt: item.updatedAt?.toISOString(),
                };
            }),
        };
    });
    app.get('/v1/admin/notifications', async (request) => {
        await requireAdmin(request);
        const query = body(pageQuery, request.query);
        const skip = (query.page - 1) * query.limit;
        const [items, total] = await Promise.all([
            AdminNotification.find().sort({ createdAt: -1 }).skip(skip).limit(query.limit),
            AdminNotification.countDocuments(),
        ]);
        return {
            total,
            page: query.page,
            limit: query.limit,
            notifications: items.map((item) => ({
                id: String(item._id),
                type: item.type,
                title: item.title,
                body: item.body,
                refId: item.refId,
                readAt: item.readAt?.toISOString(),
                createdAt: item.createdAt?.toISOString(),
            })),
        };
    });
    app.patch('/v1/admin/notifications/:id/read', async (request) => {
        await requireAdmin(request);
        const { id } = request.params;
        if (!mongoose.isValidObjectId(id))
            throw notFound('Notification not found.');
        const item = await AdminNotification.findByIdAndUpdate(id, { readAt: new Date() }, { new: true });
        if (!item)
            throw notFound('Notification not found.');
        return { ok: true };
    });
    app.get('/v1/admin/settings', async (request) => {
        await requireAdmin(request);
        const settings = await getSettings();
        return {
            settings: {
                appName: settings.appName,
                supportEmail: settings.supportEmail,
                allowRegistration: settings.allowRegistration !== false,
                enableAnonymousWishes: settings.enableAnonymousWishes !== false,
                maintenanceMode: Boolean(settings.maintenanceMode),
                defaultLinkExpiryDays: settings.defaultLinkExpiryDays ?? 7,
                maxMediaUploadMb: settings.maxMediaUploadMb ?? 80,
            },
        };
    });
    app.patch('/v1/admin/settings', async (request) => {
        await requireAdmin(request);
        const input = body(z.object({
            appName: z.string().trim().min(1).max(80).optional(),
            supportEmail: z.string().email().optional(),
            allowRegistration: z.boolean().optional(),
            enableAnonymousWishes: z.boolean().optional(),
            maintenanceMode: z.boolean().optional(),
            defaultLinkExpiryDays: z.number().int().min(1).max(365).optional(),
            maxMediaUploadMb: z.number().int().min(1).max(500).optional(),
        }), request.body);
        const settings = await AppSettings.findOneAndUpdate({}, input, { new: true, upsert: true });
        return {
            settings: {
                appName: settings.appName,
                supportEmail: settings.supportEmail,
                allowRegistration: settings.allowRegistration !== false,
                enableAnonymousWishes: settings.enableAnonymousWishes !== false,
                maintenanceMode: Boolean(settings.maintenanceMode),
                defaultLinkExpiryDays: settings.defaultLinkExpiryDays ?? 7,
                maxMediaUploadMb: settings.maxMediaUploadMb ?? 80,
            },
        };
    });
    app.post('/v1/admin/maintenance/clear', async (request) => {
        const { payload } = await requireAdmin(request);
        const input = body(z.object({ scope: z.enum(['content', 'all-data', 'sessions']), confirmation: z.literal('CLEAR') }), request.body);
        if (input.scope === 'sessions') {
            await Session.deleteMany({ userId: { $ne: payload.sub } });
            return { ok: true, scope: input.scope };
        }
        const surprises = await Surprise.find().select('_id');
        for (const surprise of surprises)
            await removeSurprise(String(surprise._id));
        await Promise.all([Person.deleteMany({}), AdminNotification.deleteMany({}), Report.deleteMany({}), Reaction.deleteMany({}), Job.deleteMany({})]);
        if (input.scope === 'all-data') {
            await Promise.all([User.deleteMany({ _id: { $ne: payload.sub } }), Session.deleteMany({ userId: { $ne: payload.sub } })]);
        }
        return { ok: true, scope: input.scope };
    });
}
export async function seedAdminUser(User, opts) {
    if (!opts.email || !opts.password)
        return;
    const email = opts.email.toLowerCase();
    const existing = await User.findOne({ email });
    if (existing) {
        if (existing.role !== 'admin') {
            existing.role = 'admin';
            await existing.save();
        }
        return;
    }
    await User.create({
        name: opts.name || 'Admin',
        email,
        passwordHash: await argon2.hash(opts.password, { type: argon2.argon2id }),
        role: 'admin',
        analyticsConsent: true,
    });
}
export async function notifyAdmin(AdminNotification, payload) {
    await AdminNotification.create(payload);
}

const Progress = require('../Model/progressModel');

const toResponse = (progress) => {
  const totalLessons = progress.totalLessons || 0;
  const completedLessons = progress.completedLessons || 0;
  const percentage = totalLessons > 0 ? Math.min(Math.round((completedLessons / totalLessons) * 100), 100) : 0;

  return {
    id: progress.id,
    userId: progress.userId,
    activeCourseId: progress.activeCourseId,
    activeCourseTitle: progress.activeCourseTitle,
    completedLessons,
    totalLessons,
    percentage,
    streak: progress.streak || 0,
    badges: progress.badges || [],
    nextLessonId: progress.nextLessonId,
    milestones: progress.milestones || [],
  };
};

const ensureBadge = (progress, badge) => {
  if (!progress.badges.find((item) => item.id === badge.id)) {
    progress.badges.push(badge);
  }
};

const get = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const progress = await Progress.findOne({ userId: req.user._id });
    if (!progress) {
      return res.json({
        id: null,
        userId: req.user._id,
        activeCourseId: null,
        activeCourseTitle: null,
        completedLessons: 0,
        totalLessons: 0,
        percentage: 0,
        streak: 0,
        badges: [],
        nextLessonId: null,
        milestones: [],
      });
    }
    return res.json(toResponse(progress));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const { courseId, courseTitle, completedLessons, totalLessons, nextLessonId } = req.body;
    if (!courseId) {
      return res.status(400).json({ message: 'courseId is required' });
    }

    const progress =
      (await Progress.findOne({ userId: req.user._id })) ||
      (await Progress.create({ userId: req.user._id }));

    progress.activeCourseId = courseId;
    if (courseTitle) {
      progress.activeCourseTitle = courseTitle;
    }
    if (typeof completedLessons === 'number') {
      progress.completedLessons = Math.max(0, completedLessons);
    }
    if (typeof totalLessons === 'number') {
      progress.totalLessons = Math.max(0, totalLessons);
    }
    if (nextLessonId) {
      progress.nextLessonId = nextLessonId;
    }

    if (progress.completedLessons >= 1) {
      ensureBadge(progress, {
        id: 'first-lesson',
        title: 'First lesson complete',
        description: 'You shipped your first DevKofi lesson.',
        icon: '🥇',
      });
    }

    if (progress.completedLessons >= 7) {
      ensureBadge(progress, {
        id: 'seven-day-streak',
        title: '7-day streak',
        description: 'Consistent progress over the past week.',
        icon: '🔥',
      });
    }

    await progress.save();

    return res.json(toResponse(progress));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  get,
  update,
};

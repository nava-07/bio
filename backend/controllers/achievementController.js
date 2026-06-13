import Achievement from '../models/Achievement.js';

// @desc    Get all achievements
// @route   GET /api/achievements
// @access  Public
export const getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find({}).sort({ date: -1 });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single achievement
// @route   GET /api/achievements/:id
// @access  Public
export const getAchievementById = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (achievement) {
      res.json(achievement);
    } else {
      res.status(404);
      throw new Error('Achievement not found');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an achievement
// @route   POST /api/achievements
// @access  Private/Admin
export const createAchievement = async (req, res) => {
  try {
    const { title, shortDescription, detailedDescription, certificateImage, images, date, featured } = req.body;

    const achievement = new Achievement({
      title,
      shortDescription,
      detailedDescription,
      certificateImage,
      images,
      date,
      featured
    });

    const createdAchievement = await achievement.save();
    res.status(201).json(createdAchievement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an achievement
// @route   PUT /api/achievements/:id
// @access  Private/Admin
export const updateAchievement = async (req, res) => {
  try {
    const { title, shortDescription, detailedDescription, certificateImage, images, date, featured } = req.body;

    const achievement = await Achievement.findById(req.params.id);

    if (achievement) {
      achievement.title = title || achievement.title;
      achievement.shortDescription = shortDescription || achievement.shortDescription;
      achievement.detailedDescription = detailedDescription || achievement.detailedDescription;
      achievement.certificateImage = certificateImage !== undefined ? certificateImage : achievement.certificateImage;
      achievement.images = images || achievement.images;
      achievement.date = date || achievement.date;
      achievement.featured = featured !== undefined ? featured : achievement.featured;

      const updatedAchievement = await achievement.save();
      res.json(updatedAchievement);
    } else {
      res.status(404);
      throw new Error('Achievement not found');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an achievement
// @route   DELETE /api/achievements/:id
// @access  Private/Admin
export const deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);

    if (achievement) {
      await achievement.deleteOne();
      res.json({ message: 'Achievement removed' });
    } else {
      res.status(404);
      throw new Error('Achievement not found');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

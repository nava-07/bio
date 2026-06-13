import Experience from '../models/Experience.js';

// @desc    Get all experiences
// @route   GET /api/experiences
// @access  Public
export const getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find({}).sort({ startDate: -1 });
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an experience
// @route   POST /api/experiences
// @access  Private/Admin
export const createExperience = async (req, res) => {
  try {
    const { title, company, startDate, endDate, description, type } = req.body;
    const experience = new Experience({ title, company, startDate, endDate, description, type });
    const createdExperience = await experience.save();
    res.status(201).json(createdExperience);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an experience
// @route   PUT /api/experiences/:id
// @access  Private/Admin
export const updateExperience = async (req, res) => {
  try {
    const { title, company, startDate, endDate, description, type } = req.body;
    const experience = await Experience.findById(req.params.id);

    if (experience) {
      experience.title = title || experience.title;
      experience.company = company || experience.company;
      experience.startDate = startDate || experience.startDate;
      experience.endDate = endDate !== undefined ? endDate : experience.endDate;
      experience.description = description || experience.description;
      experience.type = type || experience.type;

      const updatedExperience = await experience.save();
      res.json(updatedExperience);
    } else {
      res.status(404).json({ message: 'Experience not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an experience
// @route   DELETE /api/experiences/:id
// @access  Private/Admin
export const deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (experience) {
      await Experience.deleteOne({ _id: experience._id });
      res.json({ message: 'Experience removed' });
    } else {
      res.status(404).json({ message: 'Experience not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const Testimonial = require('../models/testimonial.model');

exports.getAll = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    if (testimonials.length === 0) {
      return res.status(404).json({ message: 'No testimonials found' });
    } else {
      res.json(testimonials);
    };
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.getRandom = async (req, res) => {
  try {
    const count = await Testimonial.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const testimonial = await Testimonial.findOne().skip(rand);
    if(!testimonial) res.status(404).json({ message: 'Not found testimonial' });
    else res.json(testimonial);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      res.status(404).json({ message: 'Testimonial not found' });
    } else {
      res.json(testimonial);
    };
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.post = async (req, res) => {
  const { author, text } = req.body;

  try {
    if (author && text) {
      const testimonial = new Testimonial({ author: author, text: text });
      await testimonial.save();
      res.json({ message: 'OK' });
    } else {
      res.status(400).json({ message: 'All fields are required' });
    };
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.put = async (req, res) => {
  const { author, text } = req.body;
  
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (testimonial) {
      if (author && text) {
        await Testimonial.updateOne({ _id: req.params.id }, 
          {$set: { author: author, text: text }});
        res.json(testimonial);
      } else {
        res.status(404).json({ message: 'All fields are required' });
      };
    } else {
      res.status(404).json({ message: 'Testimonial not found' });
    };
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.delete = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (testimonial) {
      await Testimonial.deleteOne(testimonial);
      res.json(testimonial);
    } else {
      res.status(404).json({ message: 'Testimonial not found' });
    };
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};
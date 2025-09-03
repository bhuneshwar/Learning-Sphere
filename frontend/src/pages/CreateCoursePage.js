import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createFormDataRequest } from '../services/apiConfig';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FileUpload from '../components/FileUpload';
import './CreateCoursePage.css';

const CreateCoursePage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'Beginner',
    price: '',
    duration: '',
    prerequisites: '',
    learningObjectives: [''],
    sections: [{ title: '', description: '', lessons: [{ title: '', content: '', duration: '', resources: [] }] }],
    thumbnail: null,
    thumbnailPreview: null,
    courseResources: []
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        thumbnail: file,
        thumbnailPreview: URL.createObjectURL(file)
      });
    }
  };

  const handleLearningObjectiveChange = (index, value) => {
    const updatedObjectives = [...formData.learningObjectives];
    updatedObjectives[index] = value;
    setFormData({ ...formData, learningObjectives: updatedObjectives });
  };

  const addLearningObjective = () => {
    setFormData({
      ...formData,
      learningObjectives: [...formData.learningObjectives, '']
    });
  };

  const removeLearningObjective = (index) => {
    const updatedObjectives = formData.learningObjectives.filter((_, i) => i !== index);
    setFormData({ ...formData, learningObjectives: updatedObjectives });
  };

  const handleSectionChange = (index, field, value) => {
    const updatedSections = [...formData.sections];
    updatedSections[index][field] = value;
    setFormData({ ...formData, sections: updatedSections });
  };

  const handleLessonChange = (sectionIndex, lessonIndex, field, value) => {
    const updatedSections = [...formData.sections];
    updatedSections[sectionIndex].lessons[lessonIndex][field] = value;
    setFormData({ ...formData, sections: updatedSections });
  };

  const addSection = () => {
    setFormData({
      ...formData,
      sections: [...formData.sections, { title: '', description: '', lessons: [{ title: '', content: '', duration: '', resources: [] }] }]
    });
  };

  const removeSection = (index) => {
    const updatedSections = formData.sections.filter((_, i) => i !== index);
    setFormData({ ...formData, sections: updatedSections });
  };

  const addLesson = (sectionIndex) => {
    const updatedSections = [...formData.sections];
    updatedSections[sectionIndex].lessons.push({ title: '', content: '', duration: '', resources: [] });
    setFormData({ ...formData, sections: updatedSections });
  };

  const removeLesson = (sectionIndex, lessonIndex) => {
    const updatedSections = [...formData.sections];
    updatedSections[sectionIndex].lessons = updatedSections[sectionIndex].lessons.filter((_, i) => i !== lessonIndex);
    setFormData({ ...formData, sections: updatedSections });
  };

  const nextStep = () => {
    setActiveStep(activeStep + 1);
  };

  const prevStep = () => {
    setActiveStep(activeStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      // Append basic course info
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('level', formData.level);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('duration', formData.duration);
      formDataToSend.append('prerequisites', formData.prerequisites);
      
      // Append learning objectives
      formDataToSend.append('learningObjectives', JSON.stringify(formData.learningObjectives.filter(obj => obj.trim() !== '')));
      
      // Append sections and lessons
      formDataToSend.append('sections', JSON.stringify(formData.sections));
      
      // Append thumbnail if exists
      if (formData.thumbnail) {
        formDataToSend.append('thumbnail', formData.thumbnail);
      }

      // Append course resource files and their metadata
      if (formData.courseResources && formData.courseResources.length > 0) {
        // Prepare resource metadata (without file objects)
        const resourcesInfo = formData.courseResources.map(resource => ({
          title: resource.title,
          description: resource.description,
          type: resource.type,
          tags: resource.tags || [],
          isPublic: resource.isPublic || false
        }));
        
        formDataToSend.append('courseResourcesInfo', JSON.stringify(resourcesInfo));
        
        // Append actual files
        formData.courseResources.forEach((resource) => {
          if (resource.file) {
            formDataToSend.append('courseResources', resource.file);
          }
        });
      }

      await createFormDataRequest('/courses', formDataToSend);
      setSuccess('Course created successfully!');
      // Show success message for 2 seconds, then navigate
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle course resources
  const handleCourseResourcesChange = (newResources) => {
    setFormData({ ...formData, courseResources: newResources });
  };

  // Handle lesson resources
  const handleLessonResourcesChange = (sectionIndex, lessonIndex, newResources) => {
    const updatedSections = [...formData.sections];
    updatedSections[sectionIndex].lessons[lessonIndex].resources = newResources;
    setFormData({ ...formData, sections: updatedSections });
  };

  // Render different steps based on activeStep
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return renderBasicInfo();
      case 1:
        return renderLearningObjectives();
      case 2:
        return renderCourseContent();
      case 3:
        return renderResourcesStep();
      case 4:
        return renderReview();
      default:
        return <div>Unknown step</div>;
    }
  };

  const renderBasicInfo = () => (
    <div className="form-step">
      <h3>Basic Information</h3>
      <div className="form-group">
        <label>Course Title*</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Enter a descriptive title"
          required
        />
      </div>
      <div className="form-group">
        <label>Course Description*</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Provide a detailed description of your course"
          rows="5"
          required
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Category*</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a category</option>
            <option value="Programming">Programming</option>
            <option value="Data Science">Data Science</option>
            <option value="Web Development">Web Development</option>
            <option value="Mobile Development">Mobile Development</option>
            <option value="DevOps">DevOps</option>
            <option value="Design">Design</option>
            <option value="Business">Business</option>
            <option value="Marketing">Marketing</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Difficulty Level*</label>
          <select
            name="level"
            value={formData.level}
            onChange={handleInputChange}
            required
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="All Levels">All Levels</option>
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Price (₹)*</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Enter price (0 for free)"
            min="0"
            required
          />
        </div>
        <div className="form-group">
          <label>Duration (hours)*</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            placeholder="Estimated course duration"
            min="1"
            required
          />
        </div>
      </div>
      <div className="form-group">
        <label>Prerequisites</label>
        <textarea
          name="prerequisites"
          value={formData.prerequisites}
          onChange={handleInputChange}
          placeholder="What should students know before taking this course?"
          rows="3"
        />
      </div>
      <div className="form-group">
        <label>Course Thumbnail</label>
        <div className="thumbnail-upload">
          <input
            type="file"
            id="thumbnail"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="file-input"
          />
          <label htmlFor="thumbnail" className="file-label">
            <i className="fas fa-cloud-upload-alt"></i> Choose Image
          </label>
          {formData.thumbnailPreview && (
            <div className="thumbnail-preview">
              <img src={formData.thumbnailPreview} alt="Course thumbnail preview" />
            </div>
          )}
        </div>
      </div>
      <div className="form-navigation">
        <button type="button" className="next-btn" onClick={nextStep}>Next: Learning Objectives</button>
      </div>
    </div>
  );

  const renderLearningObjectives = () => (
    <div className="form-step">
      <h3>Learning Objectives</h3>
      <p className="form-instruction">What will students learn in your course?</p>
      
      {formData.learningObjectives.map((objective, index) => (
        <div className="form-group objective-group" key={index}>
          <div className="objective-input">
            <input
              type="text"
              value={objective}
              onChange={(e) => handleLearningObjectiveChange(index, e.target.value)}
              placeholder={`Learning objective #${index + 1}`}
            />
          </div>
          <button 
            type="button" 
            className="remove-btn"
            onClick={() => removeLearningObjective(index)}
            disabled={formData.learningObjectives.length <= 1}
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      ))}
      
      <button type="button" className="add-btn" onClick={addLearningObjective}>
        <i className="fas fa-plus"></i> Add Learning Objective
      </button>
      
      <div className="form-navigation">
        <button type="button" className="back-btn" onClick={prevStep}>Back</button>
        <button type="button" className="next-btn" onClick={nextStep}>Next: Course Content</button>
      </div>
    </div>
  );

  const renderCourseContent = () => (
    <div className="form-step">
      <h3>Course Content</h3>
      <p className="form-instruction">Organize your course into sections and lessons</p>
      
      {formData.sections.map((section, sectionIndex) => (
        <div className="section-container" key={sectionIndex}>
          <div className="section-header">
            <h4>Section {sectionIndex + 1}</h4>
            <button 
              type="button" 
              className="remove-btn"
              onClick={() => removeSection(sectionIndex)}
              disabled={formData.sections.length <= 1}
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
          
          <div className="form-group">
            <label>Section Title*</label>
            <input
              type="text"
              value={section.title}
              onChange={(e) => handleSectionChange(sectionIndex, 'title', e.target.value)}
              placeholder="Enter section title"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Section Description</label>
            <textarea
              value={section.description}
              onChange={(e) => handleSectionChange(sectionIndex, 'description', e.target.value)}
              placeholder="Describe what this section covers"
              rows="2"
            />
          </div>
          
          <div className="lessons-container">
            <h5>Lessons</h5>
            
            {section.lessons.map((lesson, lessonIndex) => (
              <div className="lesson-item" key={lessonIndex}>
                <div className="lesson-header">
                  <h6>Lesson {lessonIndex + 1}</h6>
                  <button 
                    type="button" 
                    className="remove-btn small"
                    onClick={() => removeLesson(sectionIndex, lessonIndex)}
                    disabled={section.lessons.length <= 1}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
                
                <div className="form-row">
                  <div className="form-group lesson-title">
                    <label>Lesson Title*</label>
                    <input
                      type="text"
                      value={lesson.title}
                      onChange={(e) => handleLessonChange(sectionIndex, lessonIndex, 'title', e.target.value)}
                      placeholder="Enter lesson title"
                      required
                    />
                  </div>
                  
                  <div className="form-group lesson-duration">
                    <label>Duration (min)*</label>
                    <input
                      type="number"
                      value={lesson.duration}
                      onChange={(e) => handleLessonChange(sectionIndex, lessonIndex, 'duration', e.target.value)}
                      placeholder="Duration in minutes"
                      min="1"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Lesson Content*</label>
                  <textarea
                    value={lesson.content}
                    onChange={(e) => handleLessonChange(sectionIndex, lessonIndex, 'content', e.target.value)}
                    placeholder="Enter lesson content or instructions"
                    rows="4"
                    required
                  />
                </div>
              </div>
            ))}
            
            <button type="button" className="add-btn small" onClick={() => addLesson(sectionIndex)}>
              <i className="fas fa-plus"></i> Add Lesson
            </button>
          </div>
        </div>
      ))}
      
      <button type="button" className="add-btn" onClick={addSection}>
        <i className="fas fa-plus"></i> Add Section
      </button>
      
      <div className="form-navigation">
        <button type="button" className="back-btn" onClick={prevStep}>Back</button>
        <button type="button" className="next-btn" onClick={nextStep}>Next: Resources</button>
      </div>
    </div>
  );

  const renderResourcesStep = () => (
    <div className="form-step">
      <h3>Course Resources</h3>
      <p className="form-instruction">Upload supplementary materials, notes, and resources for your course</p>
      
      <FileUpload
        resources={formData.courseResources}
        onResourcesChange={handleCourseResourcesChange}
        title="Course Resources"
        description="Upload course-level resources like syllabus, reading materials, templates, etc. These will be accessible to all enrolled students."
      />
      
      <div className="form-navigation">
        <button type="button" className="back-btn" onClick={prevStep}>Back</button>
        <button type="button" className="next-btn" onClick={nextStep}>Next: Review</button>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="form-step">
      <h3>Review Your Course</h3>
      <p className="form-instruction">Please review your course details before submitting</p>
      
      <div className="review-section">
        <h4>Basic Information</h4>
        <div className="review-item">
          <span className="review-label">Title:</span>
          <span className="review-value">{formData.title}</span>
        </div>
        <div className="review-item">
          <span className="review-label">Description:</span>
          <span className="review-value">{formData.description}</span>
        </div>
        <div className="review-item">
          <span className="review-label">Category:</span>
          <span className="review-value">{formData.category}</span>
        </div>
        <div className="review-item">
          <span className="review-label">Level:</span>
          <span className="review-value">{formData.level}</span>
        </div>
        <div className="review-item">
          <span className="review-label">Price:</span>
          <span className="review-value">₹{formData.price}</span>
        </div>
        <div className="review-item">
          <span className="review-label">Duration:</span>
          <span className="review-value">{formData.duration} hours</span>
        </div>
        {formData.prerequisites && (
          <div className="review-item">
            <span className="review-label">Prerequisites:</span>
            <span className="review-value">{formData.prerequisites}</span>
          </div>
        )}
      </div>
      
      <div className="review-section">
        <h4>Learning Objectives</h4>
        <ul className="review-list">
          {formData.learningObjectives.filter(obj => obj.trim() !== '').map((objective, index) => (
            <li key={index}>{objective}</li>
          ))}
        </ul>
      </div>
      
      <div className="review-section">
        <h4>Course Content</h4>
        {formData.sections.map((section, sectionIndex) => (
          <div className="review-subsection" key={sectionIndex}>
            <h5>{section.title || `Section ${sectionIndex + 1}`}</h5>
            {section.description && <p>{section.description}</p>}
            <ul className="review-list">
              {section.lessons.map((lesson, lessonIndex) => (
                <li key={lessonIndex}>
                  <strong>{lesson.title || `Lesson ${lessonIndex + 1}`}</strong>
                  {lesson.duration && <span> ({lesson.duration} min)</span>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      {formData.courseResources.length > 0 && (
        <div className="review-section">
          <h4>Course Resources ({formData.courseResources.length})</h4>
          <ul className="review-list">
            {formData.courseResources.map((resource, index) => (
              <li key={index}>
                <strong>{resource.title}</strong>
                <span className="resource-type"> ({resource.type.toUpperCase()})</span>
                {resource.description && <span> - {resource.description}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {formData.thumbnailPreview && (
        <div className="review-section">
          <h4>Course Thumbnail</h4>
          <div className="thumbnail-preview review-thumbnail">
            <img src={formData.thumbnailPreview} alt="Course thumbnail" />
          </div>
        </div>
      )}
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <div className="form-navigation">
        <button type="button" className="back-btn" onClick={prevStep}>Back</button>
        <button 
          type="button" 
          className="submit-btn" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Course...' : 'Create Course'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="create-course-page">
      <Header />
      <div className="create-course-container">
        <h2>Create a New Course</h2>
        
        <div className="progress-bar">
          <div className="progress-step">
            <div className={`step-indicator ${activeStep >= 0 ? 'active' : ''}`}>1</div>
            <div className="step-label">Basic Info</div>
          </div>
          <div className="progress-step">
            <div className={`step-indicator ${activeStep >= 1 ? 'active' : ''}`}>2</div>
            <div className="step-label">Learning Objectives</div>
          </div>
          <div className="progress-step">
            <div className={`step-indicator ${activeStep >= 2 ? 'active' : ''}`}>3</div>
            <div className="step-label">Course Content</div>
          </div>
          <div className="progress-step">
            <div className={`step-indicator ${activeStep >= 3 ? 'active' : ''}`}>4</div>
            <div className="step-label">Resources</div>
          </div>
          <div className="progress-step">
            <div className={`step-indicator ${activeStep >= 4 ? 'active' : ''}`}>5</div>
            <div className="step-label">Review</div>
          </div>
        </div>
        
        <form className="course-form">
          {renderStepContent()}
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default CreateCoursePage;

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../services/apiConfig';
import { useToast } from '../components/Toast/ToastContainer';
import './CoursePlayer.css';

const CoursePlayer = () => {
    const { courseId, sectionIndex, lessonIndex } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const user = useSelector(state => state.auth?.user) || JSON.parse(localStorage.getItem('user'));
    
    // Core state
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentSection, setCurrentSection] = useState(parseInt(sectionIndex) || 0);
    const [currentLesson, setCurrentLesson] = useState(parseInt(lessonIndex) || 0);
    const [userProgress, setUserProgress] = useState([]);
    const [lessonComplete, setLessonComplete] = useState(false);
    
    // UI state
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activePanel, setActivePanel] = useState('content'); // content, notes, discussion, resources
    const [fullscreenMode, setFullscreenMode] = useState(false);
    const [theatreMode, setTheatreMode] = useState(false);
    
    // Video player state
    const videoRef = useRef(null);
    const [videoState, setVideoState] = useState({
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        playbackRate: 1,
        volume: 1,
        muted: false,
        buffered: 0
    });
    
    // Notes and bookmarks
    const [notes, setNotes] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [watchTime, setWatchTime] = useState(0);
    const [lessonStartTime] = useState(Date.now());
    
    // Interactive features
    const [showTranscript, setShowTranscript] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);
    const [videoQuality, setVideoQuality] = useState('auto');
    const [autoPlay, setAutoPlay] = useState(true);

    useEffect(() => {
        fetchCourseData();
    }, [courseId]);

    useEffect(() => {
        if (course && course.sections[currentSection]?.lessons[currentLesson]) {
            checkLessonCompletion();
        }
    }, [course, currentSection, currentLesson]);

    const fetchCourseData = async () => {
        try {
            setLoading(true);
            const [courseResponse, progressResponse] = await Promise.all([
                api.get(`/courses/${courseId}`),
                api.get(`/courses/${courseId}/progress`).catch(() => ({ data: { progress: [] } }))
            ]);
            
            setCourse(courseResponse.data);
            setUserProgress(progressResponse.data.progress || []);
        } catch (error) {
            console.error('Error fetching course data:', error);
            showToast('Error loading course', 'error');
            navigate('/my-learning');
        } finally {
            setLoading(false);
        }
    };

    const checkLessonCompletion = () => {
        const lessonId = course?.sections[currentSection]?.lessons[currentLesson]?._id;
        if (lessonId) {
            const completed = userProgress.some(p => 
                p.sectionIndex === currentSection && 
                p.lessonIndex === currentLesson && 
                p.completed
            );
            setLessonComplete(completed);
        }
    };

    // Video player methods
    const handleVideoTimeUpdate = () => {
        if (videoRef.current) {
            const currentTime = videoRef.current.currentTime;
            const duration = videoRef.current.duration;
            const buffered = videoRef.current.buffered.length > 0 ? 
                videoRef.current.buffered.end(0) : 0;
            
            setVideoState(prev => ({
                ...prev,
                currentTime,
                duration: duration || prev.duration,
                buffered
            }));
            
            setWatchTime(prev => prev + 1);
        }
    };

    const handleVideoPlay = () => {
        setVideoState(prev => ({ ...prev, isPlaying: true }));
    };

    const handleVideoPause = () => {
        setVideoState(prev => ({ ...prev, isPlaying: false }));
    };

    const handleVideoEnd = () => {
        setVideoState(prev => ({ ...prev, isPlaying: false }));
        
        // Auto-mark lesson as complete if video ends and lesson not already completed
        if (!lessonComplete && autoPlay) {
            setTimeout(() => {
                const proceed = window.confirm('Video finished! Would you like to mark this lesson as complete and proceed to the next lesson?');
                if (proceed) {
                    markLessonComplete();
                }
            }, 1000);
        }
    };

    const handlePlaybackRateChange = (rate) => {
        if (videoRef.current) {
            videoRef.current.playbackRate = rate;
            setVideoState(prev => ({ ...prev, playbackRate: rate }));
            setPlaybackSpeed(rate);
        }
    };

    const handleVolumeChange = (volume) => {
        if (videoRef.current) {
            videoRef.current.volume = volume;
            setVideoState(prev => ({ ...prev, volume, muted: volume === 0 }));
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            const muted = !videoState.muted;
            videoRef.current.muted = muted;
            setVideoState(prev => ({ ...prev, muted }));
        }
    };

    const seekVideo = (time) => {
        if (videoRef.current) {
            videoRef.current.currentTime = time;
        }
    };

    const skipVideo = (seconds) => {
        if (videoRef.current) {
            videoRef.current.currentTime += seconds;
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            videoRef.current?.requestFullscreen?.();
            setFullscreenMode(true);
        } else {
            document.exitFullscreen();
            setFullscreenMode(false);
        }
    };

    // Notes methods
    const loadNotes = useCallback(async () => {
        try {
            const response = await api.get(`/courses/${courseId}/lessons/${currentSection}/${currentLesson}/notes`);
            setNotes(response.data.notes || []);
        } catch (error) {
            console.error('Error loading notes:', error);
        }
    }, [courseId, currentSection, currentLesson]);

    const addNote = async () => {
        if (!newNote.trim()) return;
        
        const noteData = {
            content: newNote,
            timestamp: videoRef.current ? videoRef.current.currentTime : null,
            lessonId: course.sections[currentSection].lessons[currentLesson]._id,
            createdAt: new Date()
        };

        try {
            const response = await api.post(`/courses/${courseId}/lessons/${currentSection}/${currentLesson}/notes`, noteData);
            setNotes(prev => [...prev, response.data.note]);
            setNewNote('');
            setIsAddingNote(false);
            showToast('Note added successfully', 'success');
        } catch (error) {
            console.error('Error adding note:', error);
            // Add to local state as fallback
            setNotes(prev => [...prev, { ...noteData, _id: Date.now().toString() }]);
            setNewNote('');
            setIsAddingNote(false);
        }
    };

    const deleteNote = async (noteId) => {
        try {
            await api.delete(`/courses/${courseId}/lessons/${currentSection}/${currentLesson}/notes/${noteId}`);
            setNotes(prev => prev.filter(note => note._id !== noteId));
            showToast('Note deleted', 'success');
        } catch (error) {
            console.error('Error deleting note:', error);
            // Remove from local state as fallback
            setNotes(prev => prev.filter(note => note._id !== noteId));
        }
    };

    const jumpToTimestamp = (timestamp) => {
        if (videoRef.current && timestamp !== null) {
            videoRef.current.currentTime = timestamp;
            if (activePanel !== 'content') {
                setActivePanel('content');
            }
        }
    };

    // Bookmarks methods
    const loadBookmarks = useCallback(async () => {
        try {
            const response = await api.get(`/courses/${courseId}/bookmarks`);
            setBookmarks(response.data.bookmarks || []);
        } catch (error) {
            console.error('Error loading bookmarks:', error);
        }
    }, [courseId]);

    const addBookmark = async () => {
        const bookmarkData = {
            lessonId: course.sections[currentSection].lessons[currentLesson]._id,
            sectionIndex: currentSection,
            lessonIndex: currentLesson,
            timestamp: videoRef.current ? videoRef.current.currentTime : null,
            title: `${course.sections[currentSection].title} - ${course.sections[currentSection].lessons[currentLesson].title}`,
            createdAt: new Date()
        };

        try {
            const response = await api.post(`/courses/${courseId}/bookmarks`, bookmarkData);
            setBookmarks(prev => [...prev, response.data.bookmark]);
            showToast('Bookmark added', 'success');
        } catch (error) {
            console.error('Error adding bookmark:', error);
            // Add to local state as fallback
            setBookmarks(prev => [...prev, { ...bookmarkData, _id: Date.now().toString() }]);
        }
    };

    const removeBookmark = async (bookmarkId) => {
        try {
            await api.delete(`/courses/${courseId}/bookmarks/${bookmarkId}`);
            setBookmarks(prev => prev.filter(bookmark => bookmark._id !== bookmarkId));
            showToast('Bookmark removed', 'success');
        } catch (error) {
            console.error('Error removing bookmark:', error);
            // Remove from local state as fallback
            setBookmarks(prev => prev.filter(bookmark => bookmark._id !== bookmarkId));
        }
    };

    const jumpToBookmark = (bookmark) => {
        navigateToLesson(bookmark.sectionIndex, bookmark.lessonIndex);
        setTimeout(() => {
            if (bookmark.timestamp && videoRef.current) {
                videoRef.current.currentTime = bookmark.timestamp;
            }
        }, 500);
    };

    // Track watch time and auto-save progress
    useEffect(() => {
        const interval = setInterval(() => {
            if (videoRef.current && videoState.isPlaying) {
                const progress = {
                    lessonId: course?.sections[currentSection]?.lessons[currentLesson]?._id,
                    currentTime: videoRef.current.currentTime,
                    watchTime: Date.now() - lessonStartTime,
                    lastAccessed: new Date()
                };
                
                // Auto-save progress every 30 seconds
                if (watchTime % 30 === 0) {
                    api.post(`/courses/${courseId}/lessons/${currentSection}/${currentLesson}/progress`, progress)
                        .catch(error => console.error('Error saving progress:', error));
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [videoState.isPlaying, watchTime, course, courseId, currentSection, currentLesson, lessonStartTime]);

    // Load notes and bookmarks when lesson changes
    useEffect(() => {
        if (course && course.sections[currentSection]?.lessons[currentLesson]) {
            loadNotes();
            loadBookmarks();
        }
    }, [course, currentSection, currentLesson, loadNotes, loadBookmarks]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (!videoRef.current || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            switch (e.code) {
                case 'Space':
                    e.preventDefault();
                    videoState.isPlaying ? videoRef.current.pause() : videoRef.current.play();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    skipVideo(-10);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    skipVideo(10);
                    break;
                case 'KeyM':
                    e.preventDefault();
                    toggleMute();
                    break;
                case 'KeyF':
                    e.preventDefault();
                    toggleFullscreen();
                    break;
                case 'KeyN':
                    e.preventDefault();
                    setIsAddingNote(true);
                    setActivePanel('notes');
                    break;
                case 'KeyB':
                    e.preventDefault();
                    addBookmark();
                    break;
                default:
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [videoState.isPlaying, addBookmark]);

    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const markLessonComplete = async () => {
        try {
            await api.post(`/courses/${courseId}/lessons/${currentSection}/${currentLesson}/complete`);
            setLessonComplete(true);
            
            // Update local progress
            const newProgress = [...userProgress];
            const existingProgress = newProgress.find(p => 
                p.sectionIndex === currentSection && p.lessonIndex === currentLesson
            );
            
            if (existingProgress) {
                existingProgress.completed = true;
            } else {
                newProgress.push({
                    sectionIndex: currentSection,
                    lessonIndex: currentLesson,
                    completed: true,
                    completedAt: new Date()
                });
            }
            
            setUserProgress(newProgress);
            showToast('Lesson completed!', 'success');
            
            // Show auto-progression option if there's a next lesson
            const next = getNextLesson();
            if (next && autoPlay) {
                setTimeout(() => {
                    const proceed = window.confirm('Lesson completed! Would you like to proceed to the next lesson?');
                    if (proceed) {
                        navigateToLesson(next.sectionIdx, next.lessonIdx);
                    }
                }, 2000);
            }
        } catch (error) {
            console.error('Error marking lesson complete:', error);
            showToast('Error updating progress', 'error');
        }
    };

    const navigateToLesson = (sectionIdx, lessonIdx) => {
        setCurrentSection(sectionIdx);
        setCurrentLesson(lessonIdx);
        navigate(`/learn/${courseId}/${sectionIdx}/${lessonIdx}`);
    };

    const getNextLesson = () => {
        if (!course) return null;
        
        const currentSectionLessons = course.sections[currentSection]?.lessons || [];
        
        // Next lesson in current section
        if (currentLesson < currentSectionLessons.length - 1) {
            return { sectionIdx: currentSection, lessonIdx: currentLesson + 1 };
        }
        
        // First lesson of next section
        if (currentSection < course.sections.length - 1) {
            return { sectionIdx: currentSection + 1, lessonIdx: 0 };
        }
        
        return null;
    };

    const getPrevLesson = () => {
        // Previous lesson in current section
        if (currentLesson > 0) {
            return { sectionIdx: currentSection, lessonIdx: currentLesson - 1 };
        }
        
        // Last lesson of previous section
        if (currentSection > 0) {
            const prevSectionLessons = course.sections[currentSection - 1]?.lessons || [];
            return { sectionIdx: currentSection - 1, lessonIdx: prevSectionLessons.length - 1 };
        }
        
        return null;
    };

    const calculateOverallProgress = () => {
        if (!course || !userProgress.length) return 0;
        
        const totalLessons = course.sections.reduce((total, section) => 
            total + section.lessons.length, 0
        );
        const completedLessons = userProgress.filter(p => p.completed).length;
        
        return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    };

    if (loading) {
        return (
            <div className="course-player">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading course...</p>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="course-player">
                <div className="error-container">
                    <h2>Course not found</h2>
                    <button onClick={() => navigate('/my-learning')} className="btn btn-primary">
                        Back to My Learning
                    </button>
                </div>
            </div>
        );
    }

    const currentLessonData = course.sections[currentSection]?.lessons[currentLesson];
    const nextLesson = getNextLesson();
    const prevLesson = getPrevLesson();

    return (
        <div className="course-player">
            {/* Course Navigation Header */}
            <header className="player-header">
                <div className="header-left">
                    <button 
                        className="sidebar-toggle"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        ☰
                    </button>
                    <h1 className="course-title">{course.title}</h1>
                </div>
                
                <div className="header-center">
                    <div className="progress-info">
                        <span>Progress: {calculateOverallProgress()}%</span>
                        <div className="progress-bar-mini">
                            <div 
                                className="progress-fill" 
                                style={{ width: `${calculateOverallProgress()}%` }}
                            />
                        </div>
                    </div>
                </div>
                
                <div className="header-right">
                    <button 
                        onClick={() => navigate('/my-learning')} 
                        className="btn btn-outline btn-sm"
                    >
                        Exit Course
                    </button>
                </div>
            </header>

            <div className="player-container">
                {/* Course Sidebar */}
                <aside className={`course-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                    <div className="sidebar-content">
                        <h3>Course Content</h3>
                        
                        {course.sections.map((section, sectionIdx) => (
                            <div key={sectionIdx} className="section-group">
                                <div className="section-header">
                                    <h4>Section {sectionIdx + 1}: {section.title}</h4>
                                </div>
                                
                                <div className="lessons-list">
                                    {section.lessons.map((lesson, lessonIdx) => {
                                        const isActive = sectionIdx === currentSection && lessonIdx === currentLesson;
                                        const isCompleted = userProgress.some(p => 
                                            p.sectionIndex === sectionIdx && 
                                            p.lessonIndex === lessonIdx && 
                                            p.completed
                                        );
                                        
                                        return (
                                            <button
                                                key={lessonIdx}
                                                className={`lesson-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                                                onClick={() => navigateToLesson(sectionIdx, lessonIdx)}
                                            >
                                                <div className="lesson-status">
                                                    {isCompleted ? '✓' : lessonIdx + 1}
                                                </div>
                                                <div className="lesson-info">
                                                    <span className="lesson-title">{lesson.title}</span>
                                                    {lesson.duration && (
                                                        <span className="lesson-duration">{lesson.duration} min</span>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="lesson-content">
                    {currentLessonData ? (
                        <>
                            <div className="lesson-header">
                                <div className="lesson-breadcrumb">
                                    Section {currentSection + 1} • Lesson {currentLesson + 1}
                                </div>
                                <h2>{currentLessonData.title}</h2>
                                {currentLessonData.description && (
                                    <p className="lesson-description">{currentLessonData.description}</p>
                                )}
                            </div>

                            {/* Content Panels Toggle */}
                            <div className="content-panels-toggle">
                                <button 
                                    className={`panel-tab ${activePanel === 'content' ? 'active' : ''}`}
                                    onClick={() => setActivePanel('content')}
                                >
                                    📺 Lesson
                                </button>
                                <button 
                                    className={`panel-tab ${activePanel === 'notes' ? 'active' : ''}`}
                                    onClick={() => setActivePanel('notes')}
                                >
                                    📝 Notes ({notes.length})
                                </button>
                                <button 
                                    className={`panel-tab ${activePanel === 'bookmarks' ? 'active' : ''}`}
                                    onClick={() => setActivePanel('bookmarks')}
                                >
                                    🔖 Bookmarks ({bookmarks.length})
                                </button>
                                <button 
                                    className={`panel-tab ${activePanel === 'resources' ? 'active' : ''}`}
                                    onClick={() => setActivePanel('resources')}
                                >
                                    📚 Resources
                                </button>
                                <button 
                                    className={`panel-tab ${activePanel === 'discussion' ? 'active' : ''}`}
                                    onClick={() => setActivePanel('discussion')}
                                >
                                    💬 Discussion
                                </button>
                            </div>

                            <div className="lesson-body">
                                {activePanel === 'content' && (
                                    <>
                                        {currentLessonData.contentType === 'video' && currentLessonData.videoUrl ? (
                                            <div className={`enhanced-video-container ${theatreMode ? 'theatre-mode' : ''}`}>
                                                <div className="video-wrapper">
                                                    <video 
                                                        ref={videoRef}
                                                        width="100%"
                                                        key={`${currentSection}-${currentLesson}`}
                                                        onTimeUpdate={handleVideoTimeUpdate}
                                                        onPlay={handleVideoPlay}
                                                        onPause={handleVideoPause}
                                                        onEnded={handleVideoEnd}
                                                        onLoadedMetadata={() => {
                                                            if (videoRef.current) {
                                                                setVideoState(prev => ({
                                                                    ...prev,
                                                                    duration: videoRef.current.duration
                                                                }));
                                                            }
                                                        }}
                                                    >
                                                        <source src={currentLessonData.videoUrl} type="video/mp4" />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                    
                                                    {/* Custom Video Controls */}
                                                    <div className="video-controls-overlay">
                                                        <div className="video-progress-bar">
                                                            <div className="progress-track">
                                                                <div 
                                                                    className="progress-buffer" 
                                                                    style={{ width: `${(videoState.buffered / videoState.duration) * 100}%` }}
                                                                />
                                                                <div 
                                                                    className="progress-played" 
                                                                    style={{ width: `${(videoState.currentTime / videoState.duration) * 100}%` }}
                                                                />
                                                                <input
                                                                    type="range"
                                                                    min="0"
                                                                    max={videoState.duration || 0}
                                                                    value={videoState.currentTime}
                                                                    onChange={(e) => seekVideo(parseFloat(e.target.value))}
                                                                    className="progress-slider"
                                                                />
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="video-controls">
                                                            <div className="controls-left">
                                                                <button 
                                                                    onClick={() => skipVideo(-10)}
                                                                    className="control-btn"
                                                                    title="Rewind 10s"
                                                                >
                                                                    ⏪
                                                                </button>
                                                                <button 
                                                                    onClick={() => videoState.isPlaying ? videoRef.current?.pause() : videoRef.current?.play()}
                                                                    className="control-btn play-btn"
                                                                >
                                                                    {videoState.isPlaying ? '⏸️' : '▶️'}
                                                                </button>
                                                                <button 
                                                                    onClick={() => skipVideo(10)}
                                                                    className="control-btn"
                                                                    title="Forward 10s"
                                                                >
                                                                    ⏩
                                                                </button>
                                                                <div className="volume-control">
                                                                    <button 
                                                                        onClick={toggleMute}
                                                                        className="control-btn"
                                                                    >
                                                                        {videoState.muted ? '🔇' : '🔊'}
                                                                    </button>
                                                                    <input
                                                                        type="range"
                                                                        min="0"
                                                                        max="1"
                                                                        step="0.1"
                                                                        value={videoState.muted ? 0 : videoState.volume}
                                                                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                                                                        className="volume-slider"
                                                                    />
                                                                </div>
                                                                <span className="time-display">
                                                                    {formatTime(videoState.currentTime)} / {formatTime(videoState.duration)}
                                                                </span>
                                                            </div>
                                                            
                                                            <div className="controls-right">
                                                                <select 
                                                                    value={playbackSpeed}
                                                                    onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
                                                                    className="speed-selector"
                                                                >
                                                                    <option value={0.5}>0.5x</option>
                                                                    <option value={0.75}>0.75x</option>
                                                                    <option value={1}>1x</option>
                                                                    <option value={1.25}>1.25x</option>
                                                                    <option value={1.5}>1.5x</option>
                                                                    <option value={2}>2x</option>
                                                                </select>
                                                                <button 
                                                                    onClick={addBookmark}
                                                                    className="control-btn"
                                                                    title="Add Bookmark (B)"
                                                                >
                                                                    🔖
                                                                </button>
                                                                <button 
                                                                    onClick={() => {
                                                                        setIsAddingNote(true);
                                                                        setActivePanel('notes');
                                                                    }}
                                                                    className="control-btn"
                                                                    title="Add Note (N)"
                                                                >
                                                                    📝
                                                                </button>
                                                                <button 
                                                                    onClick={() => setTheatreMode(!theatreMode)}
                                                                    className="control-btn"
                                                                    title="Theatre Mode"
                                                                >
                                                                    🎭
                                                                </button>
                                                                <button 
                                                                    onClick={toggleFullscreen}
                                                                    className="control-btn"
                                                                    title="Fullscreen (F)"
                                                                >
                                                                    {fullscreenMode ? '🗗' : '⛶'}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Video transcript */}
                                                {showTranscript && currentLessonData.transcript && (
                                                    <div className="video-transcript">
                                                        <h4>Transcript</h4>
                                                        <div className="transcript-content">
                                                            {currentLessonData.transcript}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-content">
                                                <div 
                                                    dangerouslySetInnerHTML={{ 
                                                        __html: currentLessonData.content 
                                                    }} 
                                                />
                                            </div>
                                        )}
                                    </>
                                )}
                                
                                {activePanel === 'notes' && (
                                    <div className="notes-panel">
                                        <div className="panel-header">
                                            <h3>My Notes</h3>
                                            <button 
                                                onClick={() => setIsAddingNote(true)}
                                                className="btn btn-primary btn-sm"
                                            >
                                                ➕ Add Note
                                            </button>
                                        </div>
                                        
                                        {isAddingNote && (
                                            <div className="add-note-form">
                                                <textarea
                                                    value={newNote}
                                                    onChange={(e) => setNewNote(e.target.value)}
                                                    placeholder="Add your note here..."
                                                    className="note-textarea"
                                                    autoFocus
                                                />
                                                <div className="note-form-actions">
                                                    <span className="timestamp-info">
                                                        {videoRef.current && `At ${formatTime(videoRef.current.currentTime)}`}
                                                    </span>
                                                    <div className="note-buttons">
                                                        <button 
                                                            onClick={() => {
                                                                setIsAddingNote(false);
                                                                setNewNote('');
                                                            }}
                                                            className="btn btn-outline btn-sm"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button 
                                                            onClick={addNote}
                                                            className="btn btn-primary btn-sm"
                                                            disabled={!newNote.trim()}
                                                        >
                                                            Save Note
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div className="notes-list">
                                            {notes.length === 0 ? (
                                                <div className="empty-state">
                                                    <p>No notes yet. Start taking notes to remember key points!</p>
                                                </div>
                                            ) : (
                                                notes.map((note) => (
                                                    <div key={note._id} className="note-item">
                                                        <div className="note-header">
                                                            {note.timestamp && (
                                                                <button
                                                                    onClick={() => jumpToTimestamp(note.timestamp)}
                                                                    className="timestamp-link"
                                                                    title="Jump to this time"
                                                                >
                                                                    📍 {formatTime(note.timestamp)}
                                                                </button>
                                                            )}
                                                            <span className="note-date">
                                                                {new Date(note.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <div className="note-content">
                                                            {note.content}
                                                        </div>
                                                        <button
                                                            onClick={() => deleteNote(note._id)}
                                                            className="delete-note-btn"
                                                            title="Delete note"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                                
                                {activePanel === 'bookmarks' && (
                                    <div className="bookmarks-panel">
                                        <div className="panel-header">
                                            <h3>Bookmarks</h3>
                                            <button 
                                                onClick={addBookmark}
                                                className="btn btn-primary btn-sm"
                                            >
                                                🔖 Bookmark This Lesson
                                            </button>
                                        </div>
                                        
                                        <div className="bookmarks-list">
                                            {bookmarks.length === 0 ? (
                                                <div className="empty-state">
                                                    <p>No bookmarks yet. Bookmark lessons to easily return to them later!</p>
                                                </div>
                                            ) : (
                                                bookmarks.map((bookmark) => (
                                                    <div key={bookmark._id} className="bookmark-item">
                                                        <div className="bookmark-info">
                                                            <h4 className="bookmark-title">{bookmark.title}</h4>
                                                            {bookmark.timestamp && (
                                                                <span className="bookmark-time">
                                                                    📍 {formatTime(bookmark.timestamp)}
                                                                </span>
                                                            )}
                                                            <span className="bookmark-date">
                                                                {new Date(bookmark.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <div className="bookmark-actions">
                                                            <button
                                                                onClick={() => jumpToBookmark(bookmark)}
                                                                className="btn btn-outline btn-sm"
                                                            >
                                                                Jump to
                                                            </button>
                                                            <button
                                                                onClick={() => removeBookmark(bookmark._id)}
                                                                className="btn btn-outline btn-sm btn-danger"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                                
                                {activePanel === 'resources' && (
                                    <div className="resources-panel">
                                        <h3>Lesson Resources</h3>
                                        {currentLessonData.resources && currentLessonData.resources.length > 0 ? (
                                            <div className="resources-list">
                                                {currentLessonData.resources.map((resource, idx) => (
                                                    <div key={idx} className="resource-item">
                                                        <div className="resource-info">
                                                            <span className="resource-type-badge">
                                                                {resource.type}
                                                            </span>
                                                            <h4>{resource.title}</h4>
                                                            {resource.description && (
                                                                <p>{resource.description}</p>
                                                            )}
                                                        </div>
                                                        <a
                                                            href={resource.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-primary btn-sm"
                                                        >
                                                            Open Resource
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="empty-state">
                                                <p>No additional resources for this lesson.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                {activePanel === 'discussion' && (
                                    <div className="discussion-panel">
                                        <div className="panel-header">
                                            <h3>Lesson Discussion</h3>
                                            <div className="discussion-stats">
                                                <span>💬 Ask questions and share insights</span>
                                            </div>
                                        </div>
                                        
                                        <div className="discussion-content">
                                            <div className="discussion-form">
                                                <textarea
                                                    placeholder="Ask a question or share your thoughts about this lesson..."
                                                    className="discussion-textarea"
                                                    rows="3"
                                                />
                                                <div className="discussion-form-actions">
                                                    <button className="btn btn-primary btn-sm">
                                                        Post Discussion
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <div className="discussion-threads">
                                                <div className="empty-state">
                                                    <p>No discussions yet for this lesson.</p>
                                                    <p>Be the first to ask a question or share your insights!</p>
                                                </div>
                                                
                                                {/* Sample discussion thread - would be populated from API */}
                                                {false && (
                                                    <div className="discussion-thread">
                                                        <div className="thread-header">
                                                            <div className="author-info">
                                                                <div className="author-avatar">S</div>
                                                                <div className="author-details">
                                                                    <span className="author-name">Student Name</span>
                                                                    <span className="post-time">2 hours ago</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="thread-content">
                                                            <p>Great lesson! I have a question about the implementation...</p>
                                                        </div>
                                                        <div className="thread-actions">
                                                            <button className="thread-action-btn">
                                                                👍 Helpful (3)
                                                            </button>
                                                            <button className="thread-action-btn">
                                                                💬 Reply
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Lesson Navigation */}
                            <div className="lesson-navigation">
                                <div className="nav-left">
                                    {prevLesson && (
                                        <button
                                            onClick={() => navigateToLesson(prevLesson.sectionIdx, prevLesson.lessonIdx)}
                                            className="btn btn-outline"
                                        >
                                            ← Previous Lesson
                                        </button>
                                    )}
                                </div>

                                <div className="nav-center">
                                    {!lessonComplete && (
                                        <button
                                            onClick={markLessonComplete}
                                            className="btn btn-primary"
                                        >
                                            Mark as Complete
                                        </button>
                                    )}
                                </div>

                                <div className="nav-right">
                                    {nextLesson ? (
                                        <button
                                            onClick={() => navigateToLesson(nextLesson.sectionIdx, nextLesson.lessonIdx)}
                                            className="btn btn-primary"
                                        >
                                            Next Lesson →
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                showToast('Congratulations! Course completed!', 'success');
                                                navigate('/my-learning');
                                            }}
                                            className="btn btn-primary"
                                        >
                                            Complete Course 🎉
                                        </button>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="no-lesson">
                            <h3>Lesson not found</h3>
                            <p>The requested lesson could not be loaded.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default CoursePlayer;

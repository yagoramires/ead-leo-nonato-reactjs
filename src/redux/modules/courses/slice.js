import { createSlice } from '@reduxjs/toolkit';
import { fetchCourses, fetchVideos } from './actions';

const courseReducer = createSlice({
  name: 'courses',
  initialState: {},
  reducers: {
    addCourse: (state, action) => {
      const newCourse = action.payload;
      return {
        ...state,
        courses: [...state.courses, newCourse],
      };
    },
    editCourse: (state, action) => {
      const courses = JSON.parse(JSON.stringify([...state.courses]));

      const updateCourse = {
        ...action.payload,
      };

      const updatedCourseList = courses.map((course) => {
        if (course.id === action.payload.id) {
          return updateCourse;
        } else {
          return course;
        }
      });

      return {
        ...state,
        courses: updatedCourseList,
      };
    },
    delCourse: (state, action) => {
      const filterCourses = state.courses.filter(
        (course) => course.id !== action.payload,
      );

      return {
        ...state,
        courses: filterCourses,
      };
    },
    addVideo: (state, action) => {
      const newVideo = action.payload;
      const courses = JSON.parse(JSON.stringify([...state.courses]));

      const course = courses.find((course) => course.id === newVideo.courseRef);

      const section = course.videos.find(
        (section) => section.section === newVideo.section,
      );

      let videoList = [];
      if (section) {
        const removeOld = course.videos.filter(
          (section) => section.section !== newVideo.section,
        );
        const updated = [
          ...removeOld,
          { ...section, videos: [...section.videos, newVideo] },
        ];
        videoList = updated;
      } else {
        videoList = [
          ...course.videos,
          { section: newVideo.section, videos: [newVideo] },
        ];
      }

      const updateCourseVideos = {
        ...course,
        videos: videoList,
      };

      const updatedCourseList = courses.map((course) => {
        if (course.id === newVideo.courseRef) {
          return updateCourseVideos;
        } else {
          return course;
        }
      });

      return {
        ...state,
        courses: updatedCourseList,
      };
    },
    editVideo: (state, action) => {
      const courses = JSON.parse(JSON.stringify([...state.courses]));
      const updatedVideo = { ...action.payload };

      const course = courses.find(
        (course) => course.id === updatedVideo.courseRef,
      );

      const removeOldVideoData = course.videos.map((video) => {
        if (video.section === updatedVideo.section) {
          const update = {
            ...video,
            videos: video.videos.map((v) => {
              if (v.id === updatedVideo.id) {
                return updatedVideo;
              } else {
                return v;
              }
            }),
          };

          return update;
        }
        return video;
      });

      const updateCourseVideos = {
        ...course,
        videos: removeOldVideoData,
      };

      const updatedCourseList = courses.map((course) => {
        if (course.id === updatedVideo.courseRef) {
          return updateCourseVideos;
        } else {
          return course;
        }
      });

      return {
        ...state,
        courses: updatedCourseList,
      };
    },
    delVideo: (state, action) => {
      const removedVideo = action.payload;

      const courses = JSON.parse(JSON.stringify([...state.courses]));

      const course = courses.find(
        (course) => course.id === removedVideo.courseId,
      );

      const updatedVideoList = [];
      for (let section of course.videos) {
        const videos = section.videos.filter(
          (video) => video.id !== removedVideo.videoId,
        );
        updatedVideoList.push({ ...section, videos });
      }

      const updateCourseVideos = {
        ...course,
        videos: updatedVideoList,
      };

      const updatedCourseList = courses.map((course) => {
        if (course.id === removedVideo.courseId) {
          return updateCourseVideos;
        } else {
          return course;
        }
      });

      return {
        ...state,
        courses: updatedCourseList,
      };
    },
    selectLesson: (state, action) => {
      return { ...state, activeLesson: action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.fulfilled, (state, action) => {
        return { ...state, courses: action.payload };
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        const courses = JSON.parse(JSON.stringify([...state.courses]));

        const course = courses.find(
          (course) => course.id === action.payload.id,
        );

        const videos = action.payload.videos;

        const sections = videos.map((video) => video.section);

        const setSections = [...new Set(sections)];

        let sectionsArr = [];
        setSections.forEach((section) => {
          const newSection = { section, videos: [] };

          videos.forEach((video) => {
            if (video.section === section) {
              newSection.videos.push(video);
            }
          });
          sectionsArr.push(newSection);
        });

        const addVideosToCourse = {
          ...course,
          videos: sectionsArr,
        };

        const updatedCourseList = courses.map((course) => {
          if (course.id === action.payload.id) {
            return addVideosToCourse;
          } else {
            return course;
          }
        });

        let allVideos = [];

        if (state.videos) {
          allVideos = [...state.videos, action.payload.videos];
        } else {
          allVideos = [...action.payload.videos];
        }

        return {
          ...state,
          courses: updatedCourseList,
          videos: allVideos,
        };
      });
  },
});

export default courseReducer.reducer;

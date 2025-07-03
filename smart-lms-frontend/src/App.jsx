import { useState ,useEffect} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import { AuthProvider } from './context/AuthContext';
import CreateQuiz from './pages/InstructorPage/CreateQuiz';
import AssignQuiz from './pages/InstructorPage/AssignQuiz';
import TakeQuiz from './pages/TakeQuiz';
import api from "./utils/api";
import { ensureCSRF } from './utils/api';
import AddCourse from './pages/InstructorPage/AddCourse';
import MyQuizzes from './pages/InstructorPage/MyQuizzes';
import AddQuestion from './pages/InstructorPage/AddQuestion';
import QuizDetails from './pages/InstructorPage/QuizDetails';
import MyCourses from './pages/InstructorPage/MyCourses';
import CourseDetail from './pages/InstructorPage/CourseDetail';
import StudentAllCourses from './pages/StudentPage/StudentAllCourses'
import StudentCourses from './pages/StudentPage/StudentCourses';
import StudentCourseDetail from './pages/StudentPage/StudentCourseDetail';
import StartCourse from './pages/StudentPage/StartCourse';
import InstructorSubmissionsPage from './pages/InstructorPage/InstructorSubmissionsPage';
import SubmissionDetailPage from './pages/InstructorPage/SubmissionDetailPage';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AboutUs from './pages/About';
import Services from './pages/Services';
import StudentAIChat from './pages/StudentPage/StudentAIChat';
import { Navigate } from 'react-router-dom';



function App() {

useEffect(() => {
  ensureCSRF().catch(err => console.error("Failed to init CSRF:", err));
}, []);

  return (
    <BrowserRouter basename='/'>
    <AuthProvider>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/services" element={<Services/>}/>
        <Route path="/student/ai-launch" element={<StudentAIChat />} />
      
        <Route path="/student-dashboard" element={
            <PrivateRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </PrivateRoute>
          }
        />
         <Route path="/instructor-dashboard" element={
            <PrivateRoute allowedRoles={["instructor"]}>
              <InstructorDashboard />
            </PrivateRoute>
          } 
        />
        <Route
             path="/instructor/create-quiz"
             element={
             <PrivateRoute allowedRoles={["instructor"]}>
                 <CreateQuiz />
              </PrivateRoute>
           }
      />
      <Route
              path="/instructor/assign-quiz"
              element={
              <PrivateRoute allowedRoles={["instructor"]}>
                <AssignQuiz />
              </PrivateRoute>
           }
      />
       <Route
              path="/instructor/add-question"
              element={
              <PrivateRoute allowedRoles={["instructor"]}>
                <AddQuestion />
              </PrivateRoute>
           }
      />
       
      <Route
              path="/instructor/my-quizzes"
              element={
              <PrivateRoute allowedRoles={["instructor"]}>
                <MyQuizzes/>
              </PrivateRoute>
           }
      />
      <Route
                path="/take-quiz/:quizId"
                element={
              <PrivateRoute allowedRoles={["student"]}>
                <TakeQuiz />
              </PrivateRoute>
        }
      />
       <Route
              path="/quiz/:quizId/details"
              element={
              <PrivateRoute allowedRoles={["instructor"]}>
                <QuizDetails />
              </PrivateRoute>
           }
      />
       <Route
                path="/instructor/add-course"
                element={
              <PrivateRoute allowedRoles={["instructor"]}>
                <AddCourse/>
              </PrivateRoute>
        }
      />
          <Route
                path="/instructor/my-courses"
                element={
              <PrivateRoute allowedRoles={["instructor"]}>
                <MyCourses/>
              </PrivateRoute>
        }
      />
          <Route
                path="/instructor/courses/:id"
                element={
              <PrivateRoute allowedRoles={["instructor"]}>
                <CourseDetail/>
              </PrivateRoute>
        }
      />
        <Route
                path="/student/all-courses"
                element={
              <PrivateRoute allowedRoles={["student"]}>
                <StudentAllCourses/>
              </PrivateRoute>
        }
      />
       <Route
                path="/student/my-courses"
                element={
              <PrivateRoute allowedRoles={["student"]}>
                <StudentCourses/>
              </PrivateRoute>
        }
      />
      <Route
                path="/courses/:courseId/detail"
                element={
              <PrivateRoute allowedRoles={["student"]}>
                <StudentCourseDetail/>
              </PrivateRoute>
        }
      />
       <Route
                path="/course/:id/player"
                element={
              <PrivateRoute allowedRoles={["student"]}>
                <StartCourse/>
              </PrivateRoute>
        }
      />
      <Route
                path="/instructor/submissions/"
                element={
              <PrivateRoute allowedRoles={["instructor"]}>
               <InstructorSubmissionsPage/> 
              </PrivateRoute>
        }
      />
       <Route
                path="/instructor/submissions/:id"
                element={
              <PrivateRoute allowedRoles={["instructor"]}>
               <SubmissionDetailPage/> 
              </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </AuthProvider>
     
    </BrowserRouter>
  );
}

export default App;



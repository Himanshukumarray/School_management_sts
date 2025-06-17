import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import Unauthorized from "./components/Unauthorized";;
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import StudentPage from "./pages/Result";
import TeacherPage from "./pages/Teacher-page";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import AttendancePage from "./pages/AttendancePage";
import TeacherAttendance from "./pages/TeacherAttendancePage";
import StudentLeaveRequestForm from "./pages/StudentLeaveRequestForm";
import FacultyAttendance from "./pages/FacultyAttendance";
import AttendanceSummary from "./pages/AttendanceSummary";
import SyllabusPage from "./pages/Syllabus";
import LibraryIssuePage from "./pages/Library/Libpage";
import Viewbooks from "./pages/Library/Viewbooks";
import AddBookForm from "./pages/Library/Addbooks";
import BookListPage from "./pages/Library/Booklist";
// import StudentForm from "./pages/StudentForm";
import StudentForm from "./pages/StudentForm";
import TeacherForm from "./pages/TeacherForm";
import ProtectedRoute from "./components/ProtectedRoute";
import EmailComposer from "./pages/Dashboard/Mail";

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route element={<AppLayout />}>
          <Route index path="/"  element={
              <ProtectedRoute allowedRoles={["student", "admin" ,"teacher"]}>
                <Home/>
              </ProtectedRoute>
            }/>
          <Route index path="/mail" element={<EmailComposer />} />

          {/* Open to All Roles */}
          <Route path="/profile" element={<UserProfiles />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/blank" element={<Blank />} />

          {/* Student-only or Admin */}
          <Route
            path="/StudentResult"
            element={
              <ProtectedRoute allowedRoles={["student", "admin" ,"teacher"]}>
                <StudentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/StudentLeaveRequestForm"
            element={
              <ProtectedRoute allowedRoles={["student", "admin", "teacher"]}>
                <StudentLeaveRequestForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/SyllabusPage"
            element={
              <ProtectedRoute allowedRoles={["student", "admin" ,"teacher"]}>
                <SyllabusPage />
              </ProtectedRoute>
            }
          />

          {/* Admin-only Routes */}
          <Route
            path="/TeacherPage"
            element={
              <ProtectedRoute allowedRoles={["admin" ,"teacher"]}>
                <TeacherPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/AttendancePage"
            element={
              <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                <AttendancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/TeacherAttendacePage"
            element={
              <ProtectedRoute allowedRoles={["admin" , "teacher"]}>
                <TeacherAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/FacultyAttendance"
            element={
              <ProtectedRoute allowedRoles={["admin" , "teacher"]}>
                <FacultyAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/AttendanceSummary"
            element={
              <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                <AttendanceSummary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/libpage"
            element={
              <ProtectedRoute allowedRoles={["student", "admin", "teacher"]}>
                <LibraryIssuePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/viewbooks"
            element={
              <ProtectedRoute allowedRoles={["student", "admin" , "teacher"]}>
                <Viewbooks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addbook"
            element={
              <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                <AddBookForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student-form"
            element={
              <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                <StudentForm  />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher-form"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <TeacherForm  />
              </ProtectedRoute>
            }
          />
          {/* <Route path="/teacher-form" element={<TeacherForm />} /> */}

          <Route
            path="/booklist"
            element={
              <ProtectedRoute allowedRoles={["student", "admin", "teacher"]}>
                <BookListPage />
              </ProtectedRoute>
            }
          />

          {/* Common Pages */}
          <Route path="/form-elements" element={<FormElements />} />
          <Route path="/basic-tables" element={<BasicTables />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/avatars" element={<Avatars />} />
          <Route path="/badge" element={<Badges />} />
          <Route path="/buttons" element={<Buttons />} />
          <Route path="/images" element={<Images />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/line-chart" element={<LineChart />} />
          <Route path="/bar-chart" element={<BarChart />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/signin" element={<SignIn />} />

        <Route path="/signup" element={<SignUp />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;

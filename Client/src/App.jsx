
import Navbar from "./components/ui/navbar"
import Login from "./pages/login"
import { ThemeProvider } from "./components/ui/theme-provider"
import HeroSection from "./pages/student/HeroSection"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import MainLayout from "./layout/MainLayout"
import Courses from "./pages/student/Courses"
import Mylearning from "./pages/student/Mylearning"
import Myprofile from "./pages/student/Myprofile"
import Sidebar from "./pages/admin/Sidebar"
import Dashboard from "./pages/admin/Dashboard"
import CourseTable from "./pages/admin/course/CourseTable"
import AddCourse from "./pages/admin/course/AddCourse"
import EditCourse from "./pages/admin/course/EditCourse"
import CreateLecture from "./pages/admin/lecture/CreateLecture"
import EditLecture from "./pages/admin/lecture/EditLecture"
import CourseDetail from "./pages/student/CourseDetail"
import CourseProgress from "./pages/student/CourseProgress"
const appRouter = createBrowserRouter([
  {
    path:"/",
    element:<MainLayout/>,
    children:[
      {
        path:'/',
        element:(
        <>
        <HeroSection/>
        <Courses/>

        </>
        ),
      },
      {
        path:"login",
        element:<Login/>
      },
      {
        path:"my-learning",
        element:(
        <>
        <Mylearning/>
        


        </>
        )
      },
      {
        path:"profile",
        element:(
        <>
        <Myprofile/>
        </>
        )
      },
      {
        path:"course-detail/:courseId",
        element:(
        <>
        <CourseDetail/>
        </>
        )
      },
      {
        path:"course-progress/:courseId",
        element:(
          <>
          <CourseProgress/>
          </>
        )
      },
      //admin routes start from here
      {
        path: "admin",
        element: <Sidebar/>,
        children:[
          {
            path:"dashboard",
            element:<Dashboard/>
          },
          {
            path:"courses",
            element:<CourseTable/>,
            
          },
          {
            path:"courses/create",
            element:<AddCourse/>

          },
          {
            path:"courses/:courseId",
            element:<EditCourse/>,
            
          },
          {
            path:"courses/:courseId/lectures",
            element:<CreateLecture/>
          },
          {
            path:"courses/:courseId/lectures/:lectureId",
            element:<EditLecture/>
          }
        ]
      }

    ],
    
  }
])
function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    
       
       <main className="w-full min-h-screen">
        <RouterProvider router={appRouter}/>
      </main>
      
    </ThemeProvider>
     
      
    
  )
}

export default App
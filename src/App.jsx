// npm modules
import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'

// page components
import Signup from './pages/Signup/Signup'
import Login from './pages/Login/Login'
import Landing from './pages/Landing/Landing'
import Profiles from './pages/Profiles/Profiles'

// components
import NavBar from './components/NavBar/NavBar'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import BlogList from './pages/BlogList/BlogList'
import MealList from './pages/MealList/MealList'
import ExerciseList from './pages/ExerciseList/ExerciseList'
import MealDetails from './pages/MealDetails/MealDetails'
import NewMeal from './pages/NewMeal/NewMeal'
import EditMeal from './pages/EditMeal/EditMeal'

// services
import * as authService from './services/authService'
import * as mealService from './services/mealService'
import * as exerciseService from './services/exerciseService'
import * as profileService from './services/profileService'

// styles
import './App.css'

const App = () => {
  const Navigate = useNavigate()
  const [user, setUser] = useState(authService.getUser())
  const [meals, setMeals] = useState([])
  const [exercises, setExercises ] = useState([])
  const [blogs, setBlogs ] =useState([])
  const [profiles, setProfiles] = useState([])

  const handleLogout = () => {
    authService.logout()
    setUser(null)
    Navigate('/')
  }

  const handleSignupOrLogin = () => {
    setUser(authService.getUser())
  }

  const handleAddMeal = async (mealData) => {
    const newMeal = await mealService.create(mealData)
    setMeals([newMeal, ...meals])
    Navigate('/meals')
  }

  const handleUpdateMeal = async (mealData) => {
    const updatedMeal = await mealService.update(mealData)
    setMeals(meals.map((m) => mealData._id === m._id ? updatedMeal : m))
    Navigate('/meals')
  }


  const handleDeleteMeal = async (id) => {
    const deletedMeal = await mealService.deleteMeal(id)
    setMeals(meals.filter(m => m._id !== deletedMeal._id))
    Navigate('/meals')
  }

  useEffect(() => {
    const fetchAllMeals = async () => {
      const data = await mealService.index()
      setMeals(data)
    }
    if (user) fetchAllMeals()
  }, [user])

  useEffect(() => {
    const fetchAllExercises = async () => {
      const data = await exerciseService.index()
      setExercises(data)
    }
    if (user) fetchAllExercises()
  }, [user])


  useEffect(() => {
    const fetchAllProfiles = async () => {
      const data = await profileService.index()
      setProfiles(data)
    }
    if (user) fetchAllProfiles()
  }, [user])

  const handleUpdateMeal = async (mealData) => {
    const updatedMeal = await mealService.update(mealData)
    setMeals(meals.map((m) => mealData._id === m._id ? updatedMeal : m))
    Navigate('/meals')
  }


  const handleDeleteMeal = async (id) => {
    const deletedMeal = await mealService.deleteMeal(id)
    setMeals(meals.filter(m => m._id !== deletedMeal._id))
    Navigate('/meals')
  }



  return (
    <>
      <NavBar user={user} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Landing user={user} />} />
        <Route
          path="/signup"
          element={<Signup handleSignupOrLogin={handleSignupOrLogin} />}
        />
        <Route
          path="/login"
          element={<Login handleSignupOrLogin={handleSignupOrLogin} />}
        />
        <Route
          path="/profiles"
          element={
            <ProtectedRoute user={user}>
              <Profiles profiles={profiles}/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/blogs"
          element={
            <ProtectedRoute user={user}>
              <BlogList />
            </ProtectedRoute>
          }
          />
        <Route 
          path="/meals"
          element={
            <ProtectedRoute user={user}>
              <MealList meals={meals}/>
            </ProtectedRoute>
          }
          />
        <Route 
          path='/exercises'
          element={
          <ProtectedRoute user={user}>
            <ExerciseList exercises={exercises}/>
          </ProtectedRoute>
          }
        />
        <Route 
          path="/meals/:id/edit"
          element={
            <ProtectedRoute user={user}>
              <EditMeal handleUpdateMeal={handleUpdateMeal} />
            </ProtectedRoute>
          }
        />
        <Route 
          path='/meals/:id'
          element={
            <ProtectedRoute user={user}>
              <MealDetails user={user} handleDeleteMeal={handleDeleteMeal} />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/meals/new"
          element={
            <ProtectedRoute user={user}>
              <NewMeal handleAddMeal={handleAddMeal} />
            </ProtectedRoute>
          } 
        />
        </Routes>
    </>
  )
}

export default App

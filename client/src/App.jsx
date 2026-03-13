import { Route, Routes } from 'react-router-dom'
import './App.css'
import AuthLayout from './components/auth/layout'
import AuthLogin from './pages/auth/login'
import AuthRegister from './pages/auth/register'; 
import CheckAuth from './components/common/check-auth';
import UnauthPage from './pages/unauth-page';
import Landingpage from './pages/main-home-page/landing-page';
import MainSearchPage from './pages/main-search-page/main-search-page';
import PetPage from './pages/main-pet-page/Main-pet-page';
import MainAdoptionForm from './pages/main-adoption-form/MainAdoptionForm';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './store/auth-slice';
import { useEffect } from 'react';
import { Skeleton } from './components/ui/skeleton';
import MainAdminPanel from './pages/main-shelter-admin/mainShelterAdmin';
import MainReportStray from './pages/main-report-stray/mainReportStray';
import AboutUs from './pages/main-about-us/MainAboutUs';
import ApplicationStatus from './pages/main-application-status/ApplicationStatus';

function App() {

  const {user,isAuthenticated,isLoading}=useSelector(state=>state.auth)
  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) return <Skeleton className="w-[800] bg-black h-[600px]" />;

  return (
    <>
    <div className="flex flex-col overflow-hidden bg-white">
    <Routes>
      <Route path='/' element={<Landingpage/>}/>
      <Route path='/search' element={<MainSearchPage/>}/>
      <Route path='/pet/:petId' element={<PetPage/>}/>
      <Route path='/aboutUs' element ={<AboutUs/>}/>
      <Route path='/form/:petId' element={
        <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <MainAdoptionForm/>
          </CheckAuth>}/>
      <Route path='/applicationStatus' element={
        <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ApplicationStatus/>
          </CheckAuth>}/>
      
      <Route path='/reportStray' element={
        <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <MainReportStray/>
          </CheckAuth>}/>
      
      <Route path="/shelterAdmin" element={
        <CheckAuth isAuthenticated={isAuthenticated} user={user}>
          <MainAdminPanel/>
        </CheckAuth>
      }></Route>
    </Routes>
    
      <Routes>
        <Route path="/auth" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AuthLayout/>
          </CheckAuth>
        }>
        <Route path="login" element={<AuthLogin/>}/>
        <Route path="register" element={<AuthRegister/>}/>
        </Route>

        <Route path="/unauth-page" element={<UnauthPage/>}/>
      </Routes>
    </div>
    </>
  )
}

export default App

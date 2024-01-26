import "./App.css";
import Footer from "./components/footer";
import Navbar from "./components/navBar";
import HomePage from "./components/homePage";
import About from "./components/about";
import { Route, Routes } from "react-router-dom";
import SignUp from "./components/signUp";
import SignIn from "./components/signIn";
import NotFound from "./common/NotFound";
import SignOut from "./components/signout";
import { useAuth } from "./context/auth.context";
import BusinessNavBar from "./components/businessNavBar";
import { useCallback } from "react";
import AdminNavBar from "./components/adminNavBar";
import MyCards from "./components/myCards";
import ProtectedRoute from "./common/ProtectedRoute";
import SandBox from "./components/SandBox";
import MyFavorites from "./components/myFavorites";
import CardsCreate from "./components/CardsCreate";
import CardsDelete from "./components/cardDelete";
import CardsEdit from "./components/cardsEdit";
import UserEdit from "./components/userEdit";
import ContactUs from "./components/contactUs";

function App() {
  const { user } = useAuth();

  const ConditionedNavBar = useCallback(() => {
    if (user) {
      if (user.isAdmin) return <AdminNavBar />;
      if (user.isBusiness) return <BusinessNavBar />;
    }

    return <Navbar />;
  }, [user]);

  return (
    <div className="app d-flex flex-column min-vh-100">
      <header className="pb-3">
        <ConditionedNavBar />
      </header>

      <main className="flex-fill container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/sign-up" element={<SignUp redirect="/sign-in" />} />
          <Route path="/sign-in" element={<SignIn redirect="/" />} />
          <Route path="/sign-out" element={<SignOut redirect="/" />} />
          <Route
            path="/user-edit"
            element={
              <ProtectedRoute onlyRegularAndBusiness>
                <UserEdit redirect="/" />
              </ProtectedRoute>
            }
          />
          <Route path="/contact-us" element={<ContactUs redirect="/" />} />
          <Route
            path="/my-cards/delete/:id"
            element={
              <ProtectedRoute onlyAdmin>
                <CardsDelete />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-card"
            element={
              <ProtectedRoute>
                <CardsCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-cards/edit/:id"
            element={
              <ProtectedRoute onlyAdmin>
                <CardsEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-favorites"
            element={
              <ProtectedRoute>
                <MyFavorites />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Sand-box"
            element={
              <ProtectedRoute onlyAdmin>
                <SandBox />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-cards"
            element={
              <ProtectedRoute onlyAdmin>
                <MyCards />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default App;

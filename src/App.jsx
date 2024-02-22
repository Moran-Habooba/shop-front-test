import "./App.css";
import { useCallback } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./common/ProtectedRoute";
import NotFound from "./common/NotFound";
import { useAuth } from "./context/auth.context";
import {
  Footer,
  Navbar,
  HomePage,
  About,
  SignUp,
  SignIn,
  SignOut,
  BusinessNavBar,
  AdminNavBar,
  MyCards,
  SandBox,
  MyFavorites,
  CardsCreate,
  CardsDelete,
  CardsEdit,
  UserEdit,
  ContactUs,
  KippahsCategoryPage,
  ShabbatCategoryPage,
  MezuzahCategoryPage,
  HagimCategoryPage,
  SidurimCategoryPage,
  ShoppingCart,
  MyOrders,
  NatlaCategoryPage,
  EmailVerification,
  ResetPassword,
} from "./components";
import TokenProtectedRoute from "./common/tokenProtectedRoute";

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
              <ProtectedRoute onlyBiz>
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
              <ProtectedRoute onlyAdmin>
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
          <Route path="/categories/כיפות" element={<KippahsCategoryPage />} />
          <Route path="/categories/שבת" element={<ShabbatCategoryPage />} />
          <Route path="/categories/מזוזות" element={<MezuzahCategoryPage />} />
          <Route path="/categories/חגים" element={<HagimCategoryPage />} />
          <Route path="/categories/סידורים" element={<SidurimCategoryPage />} />
          <Route path="/categories/נטלות" element={<NatlaCategoryPage />} />
          <Route path="/emailVerification" element={<EmailVerification />} />
          <Route
            path="/resetPassword"
            element={
              <TokenProtectedRoute>
                <ResetPassword />
              </TokenProtectedRoute>
            }
          />
          <Route
            path="/ShoppingCart"
            element={
              // <ProtectedRoute onlyBiz>
              <ShoppingCart />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/my-orders"
            element={
              <ProtectedRoute onlyBiz>
                <MyOrders />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/InventoryManagement"
            element={<InventoryManagement />}
          /> */}
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

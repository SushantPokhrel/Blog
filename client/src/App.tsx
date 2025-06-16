import "./App.css";
import Nav from "./components/Nav";
import { BrowserRouter } from "react-router-dom";
import ScrollToTop from "./Utilities/ScrollToTop";
import AppRoutes from "./routes/AppRoutes";
import AuthContextProvider from "./contexts/AuthContext";
import { PostsProvider } from "./contexts/PostsContext";
import { IndividualPostsProvider } from "./contexts/IndividualPostsContext";
import { SavedPostsProvider } from "./contexts/SavedPostsContext";
function App() {
  console.log(
    "%cHey there, curious developer! 👀\n%cWelcome to the code side of things.",
    "font-size: 18px; font-weight: bold; color: #00C9A7; text-shadow: 1px 1px 1px #000;",
    "font-size: 14px; color: #888; font-style: italic;"
  );
  return (
    <>
      <AuthContextProvider>
        <PostsProvider>
          <IndividualPostsProvider>
            <SavedPostsProvider>
              <BrowserRouter>
                <ScrollToTop />
                <Nav />
                <AppRoutes />
              </BrowserRouter>
            </SavedPostsProvider>
          </IndividualPostsProvider>
        </PostsProvider>
      </AuthContextProvider>
    </>
  );
}

export default App;

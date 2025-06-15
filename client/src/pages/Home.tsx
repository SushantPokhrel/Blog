import { useUserContext } from "../contexts/UserContext";
import NotFound from "../components/NotFound";
import Loader from "../components/Loader";
import Category from "../components/Category";
import Posts from "../components/Posts";

function Home() {
  const { posts, loadingPosts,} = useUserContext();

  if (loadingPosts)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader />
      </div>
    );

  return (
    <div className="wrapper flex flex-col gap-4">
      <Category />
      {posts.length ? <Posts /> : <NotFound children="Write a Post" />}
      
    </div>
  );
}

export default Home;

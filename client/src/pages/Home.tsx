import { useUserContext } from "../contexts/UserContext";
import NotFound from "../components/NotFound";
import Loader from "../components/Loader";
import Category from "../components/Category";
import Posts from "../components/Posts";
import Button from "../components/Button";
function Home() {
  const { posts, loadingPosts } = useUserContext();

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
      <div className="flex justify-center">
        <Button
          onClick={() => alert("Unexpected error occurred")}
          children={"Load more"}
          className="bg-blue-600 hover:bg-blue-700 active:bg-blue-500 text-white font-semibold text-sm px-5 py-2.5 rounded-md"
        />
      </div>
    </div>
  );
}

export default Home;

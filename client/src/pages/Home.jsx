import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiConnector } from "../services/apiConnector";
import { categoriesEndpoints } from "../services/api";
import { fetchPublishedCourses } from "../services/operations/courseAPI";
import CourseCard from "../components/course/CourseCard";
import { toSlug } from "../utils/slug";

const Home = () => {
  const token = useSelector((state) => state.auth.token);
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await apiConnector("GET", categoriesEndpoints.CATEGORIES_API);
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Could not load categories", error);
      }
      setCourses(await fetchPublishedCourses());
      setLoading(false);
    };
    load();
  }, []);

  return (
    <main>
      <section className="px-6 py-16 md:py-24 text-center flex flex-col items-center gap-6 bg-indigo-50">
        <h1 className="text-4xl md:text-5xl font-bold max-w-3xl">
          Build your next skill with Skillora
        </h1>
        <p className="max-w-2xl text-lg text-gray-600">
          Learn from instructors at your own pace, track your progress, and put your
          knowledge into practice.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to={token ? "/dashboard/my-profile" : "/signup"}
            className="rounded bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700"
          >
            {token ? "Go to your dashboard" : "Get started"}
          </Link>
          <a href="#courses" className="rounded border bg-white px-5 py-3 font-medium hover:bg-gray-50">
            Explore courses
          </a>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pt-12">
          <h2 className="text-xl font-semibold mb-4">Browse by category</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/catalog/${toSlug(cat.name)}`}
                className="border rounded-full px-4 py-1 hover:bg-gray-50"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section id="courses" className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-xl font-semibold mb-4">Latest courses</h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : courses.length === 0 ? (
          <p className="text-gray-500">No courses have been published yet</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Home;
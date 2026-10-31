import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiConnector } from "../services/apiConnector";
import { categoriesEndpoints } from "../services/api";
import { fetchPublishedCourses } from "../services/operations/courseAPI";
import CourseCard from "../components/course/CourseCard";
import Spinner from "../components/common/Spinner";

const Home = () => {
  const token = useSelector((state) => state.auth.token);
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await apiConnector("GET", categoriesEndpoints.CATEGORIES_API);
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Could not load categories", error);
      }
      setCourses(await fetchPublishedCourses(24));
      setLoading(false);
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter((course) => {
      const inCategory = activeCategory === "all" || course.category?._id === activeCategory;
      const matches =
        !q ||
        course.courseName.toLowerCase().includes(q) ||
        course.courseDescription.toLowerCase().includes(q);
      return inCategory && matches;
    });
  }, [courses, query, activeCategory]);

  return (
    <main>
      <section className="bg-blue-600 px-6 py-14 text-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold md:text-4xl">Learn new skills online</h1>
          <p className="mt-2 max-w-xl text-blue-100">
            Browse courses from our instructors, enroll and track your progress.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              to={token ? "/dashboard/my-profile" : "/signup"}
              className="rounded-md bg-white px-5 py-2 font-medium text-blue-700 hover:bg-blue-50"
            >
              {token ? "My dashboard" : "Sign up"}
            </Link>
            <a href="#courses" className="rounded-md border border-white px-5 py-2 hover:bg-blue-700">
              Browse courses
            </a>
          </div>
        </div>
      </section>

      <section id="courses" className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold">All Courses</h2>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses"
            aria-label="Search courses"
            className="w-full sm:w-72"
          />
        </div>

        {categories.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {[{ _id: "all", name: "All" }, ...categories].map((cat) => (
              <button
                key={cat._id}
                onClick={() => setActiveCategory(cat._id)}
                className={`rounded-md border px-3 py-1 text-sm ${
                  activeCategory === cat._id ? "border-blue-600 bg-blue-600 text-white" : "bg-white hover:bg-gray-100"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <Spinner />
        ) : courses.length === 0 ? (
          <p className="text-gray-500">No courses have been published yet.</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500">No courses found.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Home;

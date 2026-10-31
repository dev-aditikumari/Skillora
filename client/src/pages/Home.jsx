import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiConnector } from "../services/apiConnector";
import { categoriesEndpoints } from "../services/api";
import { fetchPublishedCourses } from "../services/operations/courseAPI";
import CourseCard from "../components/course/CourseCard";
import { toSlug } from "../utils/slug";
import Spinner from "../components/common/Spinner";

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
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 px-6 py-20 text-center text-white md:py-28">
        <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-16 size-80 rounded-full bg-amber-300/20 blur-3xl" />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6">
          <span className="rounded-full bg-white/15 px-4 py-1 text-sm font-medium backdrop-blur">
            Learn, teach and grow
          </span>
          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
            Build your next skill with Skillora
          </h1>
          <p className="max-w-2xl text-lg text-indigo-100">
            Learn from expert instructors at your own pace, track your progress, and put your
            knowledge into practice.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to={token ? "/dashboard/my-profile" : "/signup"}
              className="rounded-lg bg-white px-6 py-3 font-semibold text-indigo-700 shadow-lg hover:bg-indigo-50"
            >
              {token ? "Go to your dashboard" : "Get started for free"}
            </Link>
            <a
              href="#courses"
              className="rounded-lg border border-white/40 px-6 py-3 font-semibold text-white hover:bg-white/10"
            >
              Explore courses
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-6 pt-12 sm:grid-cols-3">
        {[
          ["Learn at your own pace", "Watch lectures whenever you like and pick up exactly where you left off."],
          ["Track your progress", "Mark lectures complete and see how far you have come in every course."],
          ["Teach what you know", "Create a course, upload your lectures and reach students everywhere."],
        ].map(([title, text]) => (
          <div key={title} className="card p-5">
            <h3 className="font-semibold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-600">{text}</p>
          </div>
        ))}
      </section>

      {categories.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pt-12">
          <h2 className="mb-4 text-2xl font-bold">Browse by category</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/catalog/${toSlug(cat.name)}`}
                className="rounded-full border bg-white px-4 py-1.5 text-sm font-medium text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section id="courses" className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="mb-4 text-2xl font-bold">Latest courses</h2>
        {loading ? (
          <Spinner className="py-8 justify-start" />
        ) : courses.length === 0 ? (
          <div className="card flex flex-col items-center gap-2 border-dashed p-10 text-center">
            <p className="font-semibold">No courses yet</p>
            <p className="text-sm text-slate-500">New courses will appear here as soon as instructors publish them.</p>
          </div>
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
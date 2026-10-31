import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiConnector } from "../services/apiConnector";
import { categoriesEndpoints } from "../services/api";
import { fetchPublishedCourses, fetchPublicStats } from "../services/operations/courseAPI";
import CourseCard from "../components/course/CourseCard";
import Spinner from "../components/common/Spinner";
import { toSlug } from "../utils/slug";

// icon + gradient per category, matched on keywords with a safe fallback
const CATEGORY_STYLES = [
  [/web/i, "🌐", "from-sky-500 to-indigo-500"],
  [/data|ai|machine/i, "📊", "from-violet-500 to-fuchsia-500"],
  [/mobile|app/i, "📱", "from-orange-500 to-rose-500"],
  [/cloud|devops/i, "☁️", "from-cyan-500 to-blue-600"],
  [/design|ui|ux/i, "🎨", "from-pink-500 to-purple-500"],
];
const categoryStyle = (name) =>
  CATEGORY_STYLES.find(([re]) => re.test(name)) || [null, "📚", "from-indigo-500 to-violet-500"];

const STEPS = [
  ["Pick a course", "Browse by category or search for exactly what you want to learn."],
  ["Learn your way", "Watch lectures at your own pace and mark your progress as you go."],
  ["Share your review", "Tell others what you thought and help them choose well."],
];

const Stat = ({ value, label }) => (
  <div className="card px-5 py-4 text-center">
    <p className="text-2xl font-extrabold text-slate-900 md:text-3xl">{value}</p>
    <p className="text-sm text-slate-500">{label}</p>
  </div>
);

const Home = () => {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.profile.user);
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const load = async () => {
      const [cats, list, platform] = await Promise.all([
        apiConnector("GET", categoriesEndpoints.CATEGORIES_API)
          .then((res) => res.data.categories)
          .catch(() => []),
        fetchPublishedCourses(24),
        fetchPublicStats(),
      ]);
      setCategories(cats);
      setCourses(list);
      setStats(platform);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter((course) => {
      const matchesCategory = activeCategory === "all" || course.category?._id === activeCategory;
      const matchesQuery =
        !q ||
        course.courseName.toLowerCase().includes(q) ||
        course.courseDescription.toLowerCase().includes(q) ||
        course.category?.name?.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [courses, query, activeCategory]);

  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 px-6 pb-28 pt-20 text-center text-white md:pb-32 md:pt-28">
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

      {stats && (
        <section className="relative z-10 mx-auto -mt-14 grid max-w-4xl grid-cols-2 gap-3 px-6 md:grid-cols-4">
          <Stat value={stats.courses} label="Courses" />
          <Stat value={stats.students} label="Students" />
          <Stat value={stats.instructors} label="Instructors" />
          <Stat value={stats.categories} label="Categories" />
        </section>
      )}

      {categories.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pt-14">
          <h2 className="mb-5 text-2xl font-bold">Browse by category</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {categories.map((cat) => {
              const [, icon, gradient] = categoryStyle(cat.name);
              return (
                <Link
                  key={cat._id}
                  to={`/catalog/${toSlug(cat.name)}`}
                  className="group card flex flex-col items-start gap-3 p-4 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <span className={`flex size-11 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-xl shadow-sm`}>
                    {icon}
                  </span>
                  <span className="font-semibold leading-tight group-hover:text-indigo-700">{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section id="courses" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-14">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="text-2xl font-bold">Explore courses</h2>
          <div className="relative w-full md:w-80">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses"
              aria-label="Search courses"
              className="w-full !pl-10"
            />
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          </div>
        </div>

        {categories.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {[{ _id: "all", name: "All" }, ...categories].map((cat) => (
              <button
                key={cat._id}
                onClick={() => setActiveCategory(cat._id)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
                  activeCategory === cat._id
                    ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
                    : "bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
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
          <div className="card flex flex-col items-center gap-2 border-dashed p-10 text-center">
            <p className="font-semibold">No courses yet</p>
            <p className="text-sm text-slate-500">New courses will appear here as soon as instructors publish them.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card flex flex-col items-center gap-3 border-dashed p-10 text-center">
            <p className="font-semibold">No courses match your search</p>
            <button
              onClick={() => { setQuery(""); setActiveCategory("all"); }}
              className="btn-secondary"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <h2 className="mb-5 text-center text-2xl font-bold">How Skillora works</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {STEPS.map(([title, text], i) => (
            <div key={title} className="card flex gap-4 p-5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 font-bold text-indigo-700">
                {i + 1}
              </span>
              <div>
                <h3 className="font-semibold text-slate-900">{title}</h3>
                <p className="mt-1 text-sm text-slate-600">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {user?.accountType !== "Instructor" && (
        <section className="mx-auto mt-14 max-w-6xl px-6">
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-900 px-6 py-10 text-center text-white md:flex-row md:justify-between md:text-left">
            <div>
              <h2 className="text-2xl font-bold">Have something to teach?</h2>
              <p className="mt-1 text-indigo-200">Create a course, upload your lectures and reach students everywhere.</p>
            </div>
            <Link to={token ? "/dashboard/my-profile" : "/signup"} className="shrink-0 rounded-lg bg-white px-6 py-3 font-semibold text-indigo-700 hover:bg-indigo-50">
              {token ? "Open dashboard" : "Become an instructor"}
            </Link>
          </div>
        </section>
      )}
    </main>
  );
};

export default Home;

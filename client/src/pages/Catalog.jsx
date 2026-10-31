import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiConnector } from "../services/apiConnector";
import { categoriesEndpoints } from "../services/api";
import CourseCard from "../components/course/CourseCard";
import { plural } from "../utils/plural";
import Spinner from "../components/common/Spinner";

const Catalog = () => {
  const { catalogName } = useParams();
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    const fetchCategoryPage = async () => {
      setLoading(true);
      try {
        const response = await apiConnector("GET", categoriesEndpoints.CATEGORIES_API);
        const matched = response.data.categories.find(
          (category) =>
            category.name.trim().replace(/\s+/g, "-").toLowerCase() === catalogName
        );

        if (!matched) {
          setCategoryData(null);
          return;
        }

        const answer = await apiConnector(
          "POST",
          categoriesEndpoints.CATEGORY_PAGE_DETAILS_API,
          { categoryId: matched._id }
        );
        setCategoryData(answer.data.data.selectedCategory);
      } catch (error) {
        console.error("Could not fetch category page", error);
        setCategoryData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryPage();
  }, [catalogName]);

  if (loading) return <Spinner />;
  if (!categoryData) return <p className="p-6">Category not found</p>;

  const courses = categoryData.courses;
  const q = query.trim().toLowerCase();
  const visible = courses
    .filter((c) => !q || c.courseName.toLowerCase().includes(q) || c.courseDescription.toLowerCase().includes(q))
    .sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "rating") return b.averageRating - a.averageRating;
      if (sort === "popular") return b.students - a.students;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <div>
      <div className="border-b bg-white px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <Link to="/" className="text-sm text-blue-600 hover:underline">Back to all courses</Link>
          <h1 className="mt-2 text-3xl font-bold">{categoryData.name}</h1>
          {categoryData.description && <p className="mt-1 text-gray-600">{categoryData.description}</p>}
          <p className="mt-2 text-sm text-gray-500">{plural(courses.length, "course")}</p>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 p-6">
        {courses.length > 0 && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search in ${categoryData.name}`}
              aria-label="Search courses"
              className="w-full sm:w-80"
            />
            <label className="flex items-center gap-2 text-sm text-gray-600">
              Sort by
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="newest">Newest</option>
                <option value="popular">Most popular</option>
                <option value="rating">Top rated</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
            </label>
          </div>
        )}

        {courses.length === 0 ? (
          <div className="card flex flex-col items-center gap-2 border-dashed p-10 text-center">
            <p className="font-semibold">No courses in this category yet</p>
            <p className="text-sm text-gray-500">Check back soon, or explore another category.</p>
          </div>
        ) : visible.length === 0 ? (
          <p className="text-gray-500">No courses match your search.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;

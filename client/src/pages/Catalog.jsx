import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiConnector } from "../services/apiConnector";
import { categoriesEndpoints } from "../services/api";
import CourseCard from "../components/course/CourseCard";

const Catalog = () => {
  const { catalogName } = useParams();
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p className="p-6">Loading...</p>;
  if (!categoryData) return <p className="p-6">Category not found</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">{categoryData.name}</h1>
        {categoryData.description && (
          <p className="text-gray-600 mt-1">{categoryData.description}</p>
        )}
      </div>

      {categoryData.courses.length === 0 ? (
        <p className="text-gray-500">No courses in this category yet</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryData.courses.map((course) => (
          <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Catalog;
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchInstructorCourses } from "../../services/operations/courseAPI";
import AddCourse from "./AddCourse";

const EditCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourse = async () => {
      const courses = await fetchInstructorCourses();
      const found = courses.find((c) => c._id === courseId);
      if (!found) {
        toast.error("Course not found");
        navigate("/dashboard/my-courses");
        return;
      }
      setCourse(found);
      setLoading(false);
    };
    loadCourse();
  }, [courseId, navigate]);

  if (loading) return <p>Loading...</p>;

  return <AddCourse initialCourse={course} />;
};

export default EditCourse;
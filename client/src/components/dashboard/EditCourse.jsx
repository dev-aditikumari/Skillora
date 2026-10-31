import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchInstructorCourses } from "../../services/operations/courseAPI";
import AddCourse from "./AddCourse";
import Spinner from "../../components/common/Spinner";

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

  if (loading) return <Spinner />;

  return <AddCourse initialCourse={course} />;
};

export default EditCourse;
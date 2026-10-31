import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { fetchCourseDetails } from "../services/operations/courseAPI";
import { fetchAverageRating, fetchAllRatings } from "../services/operations/ratingAPI";
import { buyCourse, enrollFree } from "../services/operations/paymentAPI";
import SyllabusAccordion from "../components/course/SyllabusAccordion";
import InstructorCard from "../components/course/InstructorCard";
import StarRating from "../components/course/StarRating";
import ReviewList from "../components/course/ReviewList";
import Spinner from "../components/common/Spinner";
import { plural } from "../utils/plural";

const CourseDetails = () => {
  const { courseId } = useParams();
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ratingInfo, setRatingInfo] = useState({ averageRating: 0, count: 0 });
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true);
      const result = await fetchCourseDetails(courseId);
      setCourse(result);

      if (result) {
        const [info, list] = await Promise.all([
          fetchAverageRating(courseId),
          fetchAllRatings(courseId),
        ]);
        setRatingInfo(info);
        setReviews(list);
      }

      setLoading(false);
    };
    loadCourse();
  }, [courseId]);

  if (loading) return <Spinner />;
  if (!course) return <p>Course not found</p>;

  const totalLectures = course.courseContent.reduce(
    (sum, section) => sum + section.subSection.length,
    0
  );
  const instructorName =course.instructor? `${course.instructor.firstName} ${course.instructor.lastName}`: "Former instructor";
  const owned = user?.courses?.some((c) => (c._id || c) === course._id);

  const handleBuy = () => {
    if (!token) {
      toast.error("Please log in to buy this course");
      navigate("/login");
      return;
    }
    if (user.accountType !== "Student") {
      toast.error("Only students can buy courses");
      return;
    }
    if (owned) {
      navigate("/dashboard/enrolled-courses");
      return;
    }
    if (course.price === 0) {
      enrollFree(course._id, navigate, dispatch);
      return;
    }
    buyCourse(course._id, user, navigate, dispatch);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 flex flex-col gap-6">
        <h1 className="text-3xl font-bold">{course.courseName}</h1>

        {ratingInfo.count === 0 ? (
          <p className="text-gray-500 text-sm">No ratings yet</p>
        ) : (
          <div className="flex items-center gap-2">
            <StarRating rating={ratingInfo.averageRating} />
            <span className="font-semibold">{ratingInfo.averageRating}</span>
            <span className="text-gray-500 text-sm">
              ({ratingInfo.count} {ratingInfo.count === 1 ? "review" : "reviews"})
            </span>
          </div>
        )}

        <p>{course.courseDescription}</p>

        <p className="text-sm text-gray-600">
          {plural(course.studentsEnrolledCount, "student")} enrolled · {plural(course.courseContent.length, "section")} · {plural(totalLectures, "lecture")}
        </p>
        <p>Created by {instructorName}</p>

        <div className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-2">What you'll learn</h2>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            {course.whatYouWillLearn.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <SyllabusAccordion sections={course.courseContent} />
        <InstructorCard instructor={course.instructor} />
        <ReviewList reviews={reviews} />
      </div>

      <div className="border rounded p-4 h-fit flex flex-col gap-4">
        <img src={course.thumbnail} alt={course.courseName} className="w-full rounded" />
        <p className="text-2xl font-bold">{course.price === 0 ? "Free" : `₹${course.price}`}</p>
        <button onClick={handleBuy} className="bg-indigo-600 text-white px-4 py-2 rounded">
          {owned ? "Go to Course" : course.price === 0 ? "Enroll for Free" : "Buy Now"}
        </button>

        {course.instructions.length > 0 && (
          <div>
            <h3 className="font-semibold mb-1">Requirements</h3>
            <ul className="list-disc pl-5 text-sm flex flex-col gap-1">
              {course.instructions.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
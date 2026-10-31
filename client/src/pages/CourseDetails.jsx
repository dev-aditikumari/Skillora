import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { fetchCourseDetails } from "../services/operations/courseAPI";
import { fetchAverageRating, fetchAllRatings } from "../services/operations/ratingAPI";
import { buyCourse, enrollFree } from "../services/operations/paymentAPI";
import SyllabusAccordion from "../components/course/SyllabusAccordion";
import InstructorCard from "../components/course/InstructorCard";
import StarRating from "../components/course/StarRating";
import ReviewList from "../components/course/ReviewList";
import Avatar from "../components/common/Avatar";
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
    <div>
      <div className="bg-gray-800 px-6 pb-24 pt-10 text-white md:pb-16">
        <div className="mx-auto max-w-5xl md:pr-[22rem]">
          <Link to="/" className="text-sm text-gray-300 hover:text-white">Back to all courses</Link>
          <h1 className="mt-3 text-2xl font-bold leading-tight md:text-4xl">{course.courseName}</h1>
          <p className="mt-3 max-w-2xl text-gray-200">{course.courseDescription}</p>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            {ratingInfo.count === 0 ? (
              <span className="text-gray-300">No ratings yet</span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="font-bold text-amber-300">{ratingInfo.averageRating}</span>
                <StarRating rating={ratingInfo.averageRating} size="text-base" />
                <span className="text-gray-300">({ratingInfo.count === 1 ? "1 review" : `${ratingInfo.count} reviews`})</span>
              </span>
            )}
            <span className="text-gray-300">{plural(course.studentsEnrolledCount, "student")} enrolled</span>
          </div>

          <div className="mt-4 flex items-center gap-3">
            {course.instructor && (
              <Avatar
                src={course.instructor.image}
                firstName={course.instructor.firstName}
                lastName={course.instructor.lastName}
                className="size-8 text-xs"
              />
            )}
            <p className="text-sm text-gray-200">Created by <span className="font-semibold text-white">{instructorName}</span></p>
          </div>
        </div>
      </div>

      <div className="mx-auto -mt-16 grid max-w-5xl gap-8 px-6 pb-4 md:-mt-52 md:grid-cols-3">
        <aside className="md:col-start-3 md:row-start-1">
          <div className="card sticky top-20 flex flex-col gap-4 overflow-hidden p-0">
            <img src={course.thumbnail} alt={course.courseName} className="aspect-video w-full object-cover" />
            <div className="flex flex-col gap-4 p-5">
              <p className="text-2xl font-bold">{course.price === 0 ? "Free" : `₹${course.price}`}</p>
              <button onClick={handleBuy} className="btn-primary w-full">
                {owned ? "Go to Course" : course.price === 0 ? "Enroll for Free" : "Buy Now"}
              </button>
              <ul className="flex flex-col gap-1.5 text-sm text-gray-600">
                <li>{plural(course.courseContent.length, "section")} · {plural(totalLectures, "lecture")}</li>
                <li>Lifetime access</li>
                <li>Works on any device</li>
              </ul>
              {course.instructions.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="mb-1 font-semibold">Requirements</h3>
                  <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-gray-600">
                    {course.instructions.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </aside>

        <div className="flex flex-col gap-6 md:col-span-2 md:col-start-1 md:row-start-1 md:pt-60">
          <div className="card p-5">
            <h2 className="mb-3 text-xl font-semibold">What you'll learn</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {course.whatYouWillLearn.map((item, index) => (
                <li key={index} className="flex gap-2 text-gray-700">
                  <span className="text-green-600">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <SyllabusAccordion sections={course.courseContent} />
          <InstructorCard instructor={course.instructor} />
          <ReviewList reviews={reviews} />
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;

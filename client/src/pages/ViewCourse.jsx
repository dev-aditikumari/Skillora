import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchFullCourse, markLectureComplete } from "../services/operations/courseAPI";
import ReviewModal from "../components/course/ReviewModal";
import Spinner from "../components/common/Spinner";

const ViewCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [completed, setCompleted] = useState([]); // lecture ids (strings)
  const [current, setCurrent] = useState(null); // the lecture being played
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [reviewed, setReviewed] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchFullCourse(courseId);
      if (!data) {
        navigate(`/courses/${courseId}`);
        return;
      }

      const done = data.completedVideos.map(String);
      setCourse(data.course);
      setCompleted(done);

      const all = data.course.courseContent.flatMap((s) => s.subSection);
      const firstUnfinished = all.find((l) => !done.includes(l._id));
      setCurrent(firstUnfinished || all[0] || null);

      setLoading(false);
    };
    load();
  }, [courseId, navigate]);

  if (loading) return <Spinner />;
  if (!course) return null;

  const allLectures = course.courseContent.flatMap((s) => s.subSection);
  const currentIndex = allLectures.findIndex((l) => l._id === current?._id);
  const nextLecture = allLectures[currentIndex + 1];
  const isCurrentDone = current ? completed.includes(current._id) : false;
  const doneCount = allLectures.filter((l) => completed.includes(l._id)).length;
  const percent =
    allLectures.length === 0 ? 0 : Math.round((doneCount / allLectures.length) * 100);

  const handleComplete = async () => {
    if (!current || isCurrentDone || saving) return;

    setSaving(true);
    const result = await markLectureComplete(course._id, current._id);
    setSaving(false);

    if (!result) return; // the API already showed an error toast

    const updated = result.map(String);
    setCompleted(updated);

    if (allLectures.every((l) => updated.includes(l._id))) {
      toast.success("Course completed!");
    }
    if (nextLecture) setCurrent(nextLecture);
  };

  return (
    <div className="flex min-h-screen">
      {/* LEFT: sidebar */}
      <aside className="w-80 border-r p-4 flex flex-col gap-4 overflow-y-auto">
        <button
          onClick={() => navigate("/dashboard/enrolled-courses")}
          className="text-left text-blue-600 hover:underline"
        >
          ← Back to My Courses
        </button>

        <div>
          <p className="font-semibold mb-2">{course.courseName}</p>
          <div className="h-2 bg-gray-200 rounded">
            <div
              className="h-2 bg-blue-600 rounded"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{percent}% complete</p>
        </div>

        {reviewed ? (
          <p className="text-sm text-gray-500">Reviewed ✓</p>
        ) : (
          <button
            onClick={() => setShowReview(true)}
            className="border border-blue-600 text-blue-600 px-3 py-1 rounded hover:bg-blue-50"
          >
            Add Review
          </button>
        )}

        {course.courseContent.map((section) => (
          <div key={section._id}>
            <p className="font-medium mb-1">{section.sectionName}</p>
            {section.subSection.map((lecture) => (
              <button
                key={lecture._id}
                onClick={() => setCurrent(lecture)}
                className={`w-full text-left flex gap-2 items-center p-2 rounded text-sm ${
                  lecture._id === current?._id ? "bg-blue-100" : "hover:bg-gray-100"
                }`}
              >
                <span>{completed.includes(lecture._id) ? "✓" : "○"}</span>
                {lecture.title}
              </button>
            ))}
          </div>
        ))}
      </aside>

      {/* RIGHT: player */}
      <main className="flex-1 p-6 flex flex-col gap-4">
        {!current ? (
          <p>This course has no lectures yet</p>
        ) : (
          <>
            <video
              key={current._id}
              src={current.videoUrl}
              controls
              controlsList="nodownload"
              className="w-full max-h-[70vh] bg-black rounded"
              onEnded={handleComplete}
            />
            <h1 className="text-2xl font-bold">{current.title}</h1>
            <p className="text-gray-600">{current.description}</p>
            <button
              onClick={handleComplete}
              disabled={isCurrentDone || saving}
              className="self-start bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {isCurrentDone ? "Completed ✓" : "Mark as Complete"}
            </button>
          </>
        )}
      </main>

      {showReview && (
        <ReviewModal
          courseId={course._id}
          onClose={() => setShowReview(false)}
          onSubmitted={() => setReviewed(true)}
        />
      )}
    </div>
  );
};

export default ViewCourse;
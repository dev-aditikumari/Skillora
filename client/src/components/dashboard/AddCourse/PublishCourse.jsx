import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { editCourse } from "../../../services/operations/courseAPI";

const PublishCourse = ({ course, onBack }) => {
  const navigate = useNavigate();
  const [publish, setPublish] = useState(course.status === "Published");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const newStatus = publish ? "Published" : "Draft";

    // A published course needs lectures in every section
    if (newStatus === "Published") {
      const hasEmptySection = course.courseContent.some(
        (section) => section.subSection.length === 0
      );
      if (course.courseContent.length === 0 || hasEmptySection) {
        toast.error("Add at least one lecture to every section before publishing");
        return;
      }
    }

    // Nothing changed, so skip the request
    if (newStatus === course.status) {
      navigate("/dashboard/my-courses");
      return;
    }

    setLoading(true);
    const updatedCourse = await editCourse({ courseId: course._id, status: newStatus });
    setLoading(false);

    if (updatedCourse) navigate("/dashboard/my-courses");
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-semibold">Publish Settings</h2>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={publish}
          onChange={(e) => setPublish(e.target.checked)}
          className="w-4 h-4"
        />
        Make this course public
      </label>

      <p className="text-sm text-gray-500">
        {publish
          ? "Students will be able to find and buy this course."
          : "The course stays a draft, and only you can see it."}
      </p>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          disabled={loading}
          className="px-4 py-2 border rounded"
        >
          Back
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default PublishCourse;
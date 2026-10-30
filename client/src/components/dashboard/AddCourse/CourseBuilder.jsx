import { useState } from "react";
import toast from "react-hot-toast";
import { addSection, updateSection, deleteSection, deleteSubSection } from "../../../services/operations/courseAPI";
import LectureForm from "./LectureForm";

const CourseBuilder = ({ course, setCourse,onBack, onNext }) => {
  const [sectionName, setSectionName] = useState("");
  const [editingId, setEditingId] = useState(null); // null = creating, id = renaming
  const [lectureForm, setLectureForm] = useState(null);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setSectionName("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sectionName.trim()) return;

    setLoading(true);
    let updatedCourse;
    if (editingId) {
      updatedCourse = await updateSection({
        sectionName: sectionName.trim(),
        sectionId: editingId,
        courseId: course._id,
      });
    } else {
      updatedCourse = await addSection({
        sectionName: sectionName.trim(),
        courseId: course._id,
      });
    }
    setLoading(false);

    if (updatedCourse) {
      setCourse(updatedCourse);
      resetForm();
    }
  };

  const handleEdit = (section) => {
    setEditingId(section._id);
    setSectionName(section.sectionName);
  };

  const handleDelete = async (sectionId) => {
    if (!window.confirm("Delete this section and all its lectures?")) return;
    const updatedCourse = await deleteSection({ sectionId, courseId: course._id });
    if (updatedCourse) {
      setCourse(updatedCourse);
      if (editingId === sectionId) resetForm();
    }
  };

  const handleNext = () => {
 if (course.courseContent.some((s) => s.subSection.length === 0)) {
  toast.error("Add at least one lecture in every section");
  return;
}

    if (course.courseContent.length === 0) {
      toast.error("Add at least one section");
      return;
    }
    onNext();
  };
const handleDeleteLecture = async (sectionId, subSectionId) => {
  if (!window.confirm("Delete this lecture?")) return;
  const updatedCourse = await deleteSubSection({
    subSectionId,
    sectionId,
    courseId: course._id,
  });
  if (updatedCourse) setCourse(updatedCourse);
};

// 125.4 (seconds, as a string) → "2:05"
const formatDuration = (seconds) => {
  const total = Math.round(Number(seconds));
  if (!total) return "";
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
};

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-semibold">Course Builder</h2>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={sectionName}
          onChange={(e) => setSectionName(e.target.value)}
          placeholder="Section name"
          className="border rounded p-2 flex-1"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {editingId ? "Save" : "Create Section"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
        )}
      </form>

      {course.courseContent.length === 0 ? (
        <p className="text-gray-500">No sections yet</p>
      ) : (
        <div className="flex flex-col gap-3">
          {course.courseContent.map((section) => (
            <div key={section._id} className="border rounded p-3">
              <div className="flex items-center justify-between">
                <p className="font-medium">{section.sectionName}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(section)}
                    className="px-3 py-1 border rounded hover:bg-gray-100"
                  >
                    Rename
                  </button>
                  <button
                    onClick={() => handleDelete(section._id)}
                    className="px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
             <div className="mt-3 pl-4 flex flex-col gap-2">
  {section.subSection.map((lecture) => (
    <div key={lecture._id} className="flex items-center justify-between text-sm">
      <p>
        {lecture.title}
        <span className="text-gray-400 ml-2">{formatDuration(lecture.timeDuration)}</span>
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => setLectureForm({ sectionId: section._id, lecture })}
          className="text-indigo-600 hover:underline"
        >
          Edit
        </button>
        <button
          onClick={() => handleDeleteLecture(section._id, lecture._id)}
          className="text-red-600 hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  ))}

  {lectureForm?.sectionId === section._id ? (
    <LectureForm
      key={lectureForm.lecture?._id || "new"}
      courseId={course._id}
      sectionId={section._id}
      lecture={lectureForm.lecture}
      onDone={(updatedCourse) => {
        setCourse(updatedCourse);
        setLectureForm(null);
      }}
      onCancel={() => setLectureForm(null)}
    />
  ) : (
    <button
      onClick={() => setLectureForm({ sectionId: section._id, lecture: null })}
      className="text-left text-indigo-600 hover:underline text-sm"
    >
      + Add Lecture
    </button>
  )}
</div>
            </div>
          ))}
        </div>
      )}

     <div className="flex justify-between">
  <button onClick={onBack} className="px-4 py-2 border rounded">
    Back
  </button>
  <button onClick={handleNext} className="bg-indigo-600 text-white px-4 py-2 rounded">
    Next
  </button>
</div>
    </div>
  );
};

export default CourseBuilder;
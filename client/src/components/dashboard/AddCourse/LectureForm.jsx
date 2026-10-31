import { useState } from "react";
import toast from "react-hot-toast";
import { addSubSection, updateSubSection } from "../../../services/operations/courseAPI";

const LectureForm = ({ courseId, sectionId, lecture, onDone, onCancel }) => {
  const isEditing = Boolean(lecture);
  const [title, setTitle] = useState(lecture?.title || "");
  const [description, setDescription] = useState(lecture?.description || "");
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEditing && !video) {
      toast.error("Please choose a video");
      return;
    }

    const data = new FormData();
    data.append("courseId", courseId);
    data.append("sectionId", sectionId);
    data.append("title", title.trim());
    data.append("description", description.trim());
    if (video) data.append("videoFile", video);
    if (isEditing) data.append("subSectionId", lecture._id);

    setLoading(true);
    const updatedCourse = isEditing
      ? await updateSubSection(data)
      : await addSubSection(data);
    setLoading(false);

    if (updatedCourse) onDone(updatedCourse);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-3 p-3 bg-gray-50 rounded">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Lecture title"
        required
        className="border rounded p-2"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Lecture description"
        required
        rows={2}
        className="border rounded p-2"
      />
      <div>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files[0])}
        />
        {isEditing && (
          <p className="text-xs text-gray-500 mt-1">Leave empty to keep the current video</p>
        )}
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-1 rounded disabled:opacity-50"
        >
          {loading ? "Uploading..." : isEditing ? "Save" : "Add Lecture"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-1 border rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default LectureForm;
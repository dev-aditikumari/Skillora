import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiConnector } from "../../../services/apiConnector";
import { categoriesEndpoints } from "../../../services/api";
import { createCourse, editCourse } from "../../../services/operations/courseAPI";

// turns "a\nb\n\nc" into ["a", "b", "c"]
const toList = (text) =>
  text.split("\n").map((line) => line.trim()).filter(Boolean);

const inputClass = "border rounded p-2 w-full";

const CourseInfoForm = ({ course, onSaved }) => {
  const isEditing = Boolean(course);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [form, setForm] = useState({
    courseName: course?.courseName || "",
    courseDescription: course?.courseDescription || "",
    price: course?.price ?? "",
    category: course?.category || "",
    tags: course?.tags?.join(", ") || "",
    whatYouWillLearn: course?.whatYouWillLearn?.join("\n") || "",
    instructions: course?.instructions?.join("\n") || "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiConnector("GET", categoriesEndpoints.CATEGORIES_API);
        setCategories(response.data.categories);
      } catch (error) {
        toast.error("Could not load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEditing && !thumbnail) {
      toast.error("Please add a thumbnail");
      return;
    }
    if (toList(form.whatYouWillLearn).length === 0) {
      toast.error("Add at least one thing students will learn");
      return;
    }

    const data = new FormData();
    data.append("courseName", form.courseName);
    data.append("courseDescription", form.courseDescription);
    data.append("price", form.price);
    data.append("category", form.category);
    data.append(
      "tags",
      JSON.stringify(form.tags.split(",").map((t) => t.trim()).filter(Boolean))
    );
    data.append("whatYouWillLearn", JSON.stringify(toList(form.whatYouWillLearn)));
    data.append("instructions", JSON.stringify(toList(form.instructions)));
    if (thumbnail) data.append("thumbnailImage", thumbnail);

    if (isEditing) {
      data.append("courseId", course._id);
    } else {
      data.append("status", "Draft");
    }

    setLoading(true);
    const result = isEditing ? await editCourse(data) : await createCourse(data);
    setLoading(false);

    if (result) onSaved(result);
  };

  const previewSrc = thumbnail ? URL.createObjectURL(thumbnail) : course?.thumbnail;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        Course Title
        <input type="text" name="courseName" value={form.courseName}
          onChange={handleChange} required className={inputClass} />
      </label>

      <label className="flex flex-col gap-1">
        Course Description
        <textarea name="courseDescription" value={form.courseDescription}
          onChange={handleChange} required rows={4} className={inputClass} />
      </label>

      <label className="flex flex-col gap-1">
        Price (₹)
        <input type="number" name="price" min="1" step="1" value={form.price}
          onChange={handleChange} required className={inputClass} />
      </label>

      <label className="flex flex-col gap-1">
        Category
        <select name="category" value={form.category} onChange={handleChange}
          required className={inputClass}>
          <option value="" disabled>Select a category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1">
        Tags
        <input type="text" name="tags" value={form.tags} onChange={handleChange}
          placeholder="react, javascript (comma separated)" required className={inputClass} />
      </label>

      <label className="flex flex-col gap-1">
        What will students learn?
        <textarea name="whatYouWillLearn" value={form.whatYouWillLearn}
          onChange={handleChange} placeholder="One benefit per line"
          required rows={4} className={inputClass} />
      </label>

      <label className="flex flex-col gap-1">
        Requirements / Instructions
        <textarea name="instructions" value={form.instructions}
          onChange={handleChange} placeholder="One requirement per line"
          required rows={3} className={inputClass} />
      </label>

      <div className="flex flex-col gap-2">
        <label htmlFor="thumbnail">Thumbnail</label>
        <input id="thumbnail" type="file" accept="image/*"
          onChange={(e) => setThumbnail(e.target.files[0])} />
        {isEditing && (
          <p className="text-xs text-gray-500">Leave empty to keep the current thumbnail</p>
        )}
        {previewSrc && (
          <img src={previewSrc} alt="Thumbnail preview"
            className="w-48 h-28 object-cover rounded" />
        )}
      </div>

      <button type="submit" disabled={loading}
        className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50">
        {loading ? "Saving..." : isEditing ? "Save & Next" : "Next"}
      </button>
    </form>
  );
};

export default CourseInfoForm;
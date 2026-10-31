import { useState } from "react";
import { plural } from "../../utils/plural";

const formatDuration = (seconds) => {
  const total = Math.round(Number(seconds));
  if (!total) return "";
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
};

const SyllabusAccordion = ({ sections }) => {
  const [openIds, setOpenIds] = useState([]);

  const toggle = (sectionId) => {
    if (openIds.includes(sectionId)) {
      setOpenIds(openIds.filter((id) => id !== sectionId));
    } else {
      setOpenIds([...openIds, sectionId]);
    }
  };

  const allOpen = sections.length > 0 && openIds.length === sections.length;

  const toggleAll = () => {
    if (allOpen) {
      setOpenIds([]);
    } else {
      setOpenIds(sections.map((s) => s._id));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">Course Content</h2>
        <button onClick={toggleAll} className="text-blue-600 text-sm hover:underline">
          {allOpen ? "Collapse all" : "Expand all"}
        </button>
      </div>

      <div className="border rounded divide-y">
        {sections.map((section) => (
          <div key={section._id}>
            <div
              onClick={() => toggle(section._id)}
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
            >
              <p className="font-medium">{section.sectionName}</p>
              <p className="text-sm text-gray-500">{plural(section.subSection.length, "lecture")}</p>
            </div>

            {openIds.includes(section._id) && (
              <div className="px-4 pb-3 flex flex-col gap-3">
                {section.subSection.length === 0 ? (
                  <p className="text-sm text-gray-400">No lectures yet</p>
                ) : (
                  section.subSection.map((lecture) => (
                    <div key={lecture._id} className="flex justify-between gap-4">
                      <div>
                        <p className="text-sm">{lecture.title}</p>
                        <p className="text-xs text-gray-500">{lecture.description}</p>
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatDuration(lecture.timeDuration)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SyllabusAccordion;
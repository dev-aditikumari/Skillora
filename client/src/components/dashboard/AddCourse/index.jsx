import { useState } from "react";
import CourseInfoForm from "./CourseInfoForm";
import CourseBuilder from "./CourseBuilder";
import PublishCourse from "./PublishCourse";

const steps = ["Course Info", "Course Builder", "Publish"];

const AddCourse = ({ initialCourse }) => {
  const [step, setStep] = useState(1);
  const [course, setCourse] = useState(initialCourse || null);

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">
        {initialCourse ? "Edit Course" : "Add Course"}
      </h1>

      <div className="flex gap-6 mb-8">
        {steps.map((label, index) => (
          <div
            key={label}
            className={index + 1 === step ? "font-bold text-blue-600" : "text-gray-400"}
          >
            {index + 1}. {label}
          </div>
        ))}
      </div>

      {step === 1 && (
        <CourseInfoForm
          course={course}
          onSaved={(savedCourse) => {
            setCourse(savedCourse);
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <CourseBuilder
          course={course}
          setCourse={setCourse}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <PublishCourse course={course} onBack={() => setStep(2)} />
      )}
    </div>
  );
};

export default AddCourse;
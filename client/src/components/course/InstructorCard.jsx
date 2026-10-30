const InstructorCard = ({ instructor }) => {
  const name = `${instructor.firstName} ${instructor.lastName}`;
  const about = instructor.additionalDetails?.about;

  return (
    <div className="border rounded p-4">
      <h2 className="text-xl font-semibold mb-3">Instructor</h2>
      <div className="flex gap-4 items-start">
        {instructor.image ? (
          <img
            src={instructor.image}
            alt={name}
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl font-semibold">
            {instructor.firstName[0]}
          </div>
        )}

        <div>
          <p className="font-semibold">{name}</p>
          {about && <p className="text-sm text-gray-600">{about}</p>}
        </div>
      </div>
    </div>
  );
};

export default InstructorCard;
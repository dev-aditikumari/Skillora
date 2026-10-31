import Avatar from "../common/Avatar";

const InstructorCard = ({ instructor }) => {
  const name = `${instructor.firstName} ${instructor.lastName}`;
  const about = instructor.additionalDetails?.about;

  return (
    <div className="card p-5">
      <h2 className="text-xl font-semibold mb-3">Instructor</h2>
      <div className="flex gap-4 items-start">
        <Avatar src={instructor.image} firstName={instructor.firstName} lastName={instructor.lastName} className="size-16 text-xl" />

        <div>
          <p className="font-semibold">{name}</p>
          {about && <p className="text-sm text-gray-600">{about}</p>}
        </div>
      </div>
    </div>
  );
};

export default InstructorCard;
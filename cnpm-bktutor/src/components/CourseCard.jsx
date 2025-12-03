export default function CourseCard({ course, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white p-4 rounded-lg shadow hover:shadow-lg cursor-pointer transition"
    >
      <h3 className="text-lg font-semibold">{course.name}</h3>
      <p className="text-gray-600 text-sm">{course.description}</p>
      <div className="mt-4 flex justify-between text-sm">
        <span className="text-blue-600">Instructor: {course.instructor}</span>
        <span className="text-green-600">{course.students} students</span>
      </div>
    </div>
  );
}
import CustomImageTag from "@components/ui/CustomTag/CustomImage";
import LoadingSkeleton from "@components/ui/Loading/LoadingSkeleton";
import { useGetSingleProjectsQuery } from "@redux/features/admin/projectApi";
import { useParams } from "react-router-dom";

// Sample project data
const projects = [
  {
    id: 2,
    title: "Project Beta",
    author: "Jane Smith",
    logo: "https://via.placeholder.com/50",
    featureList: ["Feature A", "Feature B"],
    startDate: "2024-02-01",
    endDate: "2024-08-01",
    extended: [],
    clientName: "XYZ Ltd",
    clientEmail: "client@xyz.com",
    description: "Description of Project Beta",
    status: "Completed",
    isDelete: false,
  },
];

function ProjectLandingPage() {
  const { id } = useParams();
  const { data, isLoading } = useGetSingleProjectsQuery(id);

  if (isLoading) {
    return <LoadingSkeleton />;
  }
  const project = data?.data || {};
  console.log("🚀 ~ ProjectLandingPage ~ project:", project);
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-12">
          Projects Overview
        </h1>

        <div className="grid grid-cols-1 gap-8">
          <div
            key={project._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden"
          >
            <div className="p-6">
              {/* Project Logo */}
              <div className="flex items-center justify-center mb-4">
                <CustomImageTag
                  src={project.logo}
                  alt="Project Logo"
                  className="w-16 h-16 rounded-full"
                />
              </div>

              {/* Project Title */}
              <h2 className="text-xl font-semibold text-gray-800 text-center">
                {project.title}
              </h2>

              {/* Project Author */}
              <p className="text-gray-600 text-center mb-4">
                Author: {project?.author?.details?.name?.firstName}
              </p>

              {/* Feature List */}
              <div className="mb-4">
                <h3 className="text-gray-700 font-bold mb-2">Features:</h3>
                <ul className="list-disc list-inside text-gray-600">
                  {project.featureList.map((feature, index) => (
                    <li key={index}>{feature?.title}</li>
                  ))}
                </ul>
              </div>

              {/* Start and End Date */}
              <div className="mb-4">
                <h3 className="text-gray-700 font-bold mb-2">Dates:</h3>
                <p className="text-gray-600">
                  Start Date: {new Date(project.start).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  End Date: {new Date(project.end).toLocaleDateString()}
                </p>
              </div>

              {/* Client Information */}
              <div className="mb-4">
                <h3 className="text-gray-700 font-bold mb-2">Client:</h3>
                <p className="text-gray-600">Name: {project.clientName}</p>
                <p className="text-gray-600">Email: {project.clientEmail}</p>
              </div>

              {/* Description */}
              <div className="mb-4">
                <h3 className="text-gray-700 font-bold mb-2">Description:</h3>
                <p className="text-gray-600">{project.description}</p>
              </div>

              {/* Status */}
              <div className="text-center">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    project.status === "Active"
                      ? "bg-green-200 text-green-800"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {project.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectLandingPage;
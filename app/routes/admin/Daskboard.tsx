import { useQuery } from "@tanstack/react-query";
import { getAllUsersRequest } from "~/api/user";
import { getAllToursRequest } from "~/api/tour";
import { getAllBooksRequest } from "~/api/book";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Daskboard = () => {
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsersRequest,
  });

  const { data: tours = [], isLoading: toursLoading } = useQuery({
    queryKey: ["tours"],
    queryFn: getAllToursRequest,
  });

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: getAllBooksRequest,
  });

  const isLoading = usersLoading || toursLoading || bookingsLoading;

  const chartData = [
    { name: "Users", count: users.length },
    { name: "Tours", count: tours.length },
    { name: "Bookings", count: bookings.length },
  ];

  return (
    <div className="p-8 bg-gradient-to-r from-purple-100 via-gray-50 to-purple-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold text-purple-800 mb-10 text-center drop-shadow-lg">
          Dashboard
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-2xl text-gray-600 animate-pulse">
              Loading data...
            </p>
          </div>
        ) : (
          <>
            {/* Statistics Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-gradient-to-br from-purple-200 to-purple-400 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow">
                <h2 className="text-lg font-semibold text-gray-800">
                  Total Users
                </h2>
                <p className="text-4xl font-extrabold text-white">
                  {users.length}
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-200 to-blue-400 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow">
                <h2 className="text-lg font-semibold text-gray-800">
                  Total Tours
                </h2>
                <p className="text-4xl font-extrabold text-white">
                  {tours.length}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-200 to-green-400 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow">
                <h2 className="text-lg font-semibold text-gray-800">
                  Total Bookings
                </h2>
                <p className="text-4xl font-extrabold text-white">
                  {bookings.length}
                </p>
              </div>
            </div>

            {/* Bar Chart Section */}
            <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Overview Chart
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#4b5563", fontSize: 14 }}
                  />
                  <YAxis tick={{ fill: "#4b5563", fontSize: 14 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#f9fafb",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#4b5563", fontWeight: "bold" }}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Recent Activity
              </h2>
              <ul className="space-y-6">
                {bookings.slice(0, 5).map((booking, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <span className="text-gray-700">
                      <strong>User {booking.username}</strong> booked a tour
                      with ID <strong>{booking.tourId}</strong>
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(booking.bookingDate).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Daskboard;

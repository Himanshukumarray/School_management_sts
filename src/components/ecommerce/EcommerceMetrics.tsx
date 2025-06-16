import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";

export default function UserMetrics() {
  const userName = "Rahul"; // You can later replace this with props or API data

  return (
    <div>
      {/* Welcome Message */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Welcome back, {sessionStorage.getItem("userName")}!
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Here's a quick overview of your attendance and user activity.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
        {/* Users Metric */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
                Users
              </span>
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                3,782
              </h4>
            </div>
            <Badge color="success">
              <ArrowUpIcon />
              11.01%
            </Badge>
          </div>
        </div>

        {/* Attendance IDs Metric */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Attendance IDs
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                5,359
              </h4>
            </div>
            <Badge color="error">
              <ArrowDownIcon />
              9.05%
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

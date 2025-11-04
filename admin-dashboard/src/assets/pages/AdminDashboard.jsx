import React, { useState, useEffect } from "react";

/**
 * AdminDashboard (React)
 * - Simple admin UI that fetches pending/approved students & drivers from the Render backend
 * - Allows Approve / Reject / Delete actions by calling the corresponding backend endpoints
 *
 * NOTE: This is a client-side admin UI (likely served from a browser). In production:
 *  - Protect these endpoints with authentication (admin JWT)
 *  - Restrict the dashboard (login + role check)
 */

const AdminDashboard = () => {
  // UI state: which main tab is active ("students" or "drivers")
  const [activeTab, setActiveTab] = useState("students");

  // Data state: arrays for pending & approved students/drivers
  const [pendingStudents, setPendingStudents] = useState([]);
  const [approvedStudents, setApprovedStudents] = useState([]);
  const [pendingDrivers, setPendingDrivers] = useState([]);
  const [approvedDrivers, setApprovedDrivers] = useState([]);

  // Loading indicator while fetching dashboard data
  const [loading, setLoading] = useState(true);

  // Backend base URL (Render)
  const BACKEND_URL = "https://rydy-backend.onrender.com/api";

  /**
   * fetchData
   * - Fetches all four endpoints in parallel with Promise.all
   * - Parses JSON and sets state
   * - Basic error handling included
   */
  const fetchData = async () => {
    setLoading(true);
    try {
      // Run all requests in parallel for speed
      const [
        pendingStudentsRes,
        approvedStudentsRes,
        pendingDriversRes,
        approvedDriversRes,
      ] = await Promise.all([
        fetch(`${BACKEND_URL}/students/pending`),
        fetch(`${BACKEND_URL}/students/approved`),
        fetch(`${BACKEND_URL}/drivers/pending`),
        fetch(`${BACKEND_URL}/drivers/approved`),
      ]);

      // Check status of each response; if any failed, throw to go to catch block
      if (
        !pendingStudentsRes.ok ||
        !approvedStudentsRes.ok ||
        !pendingDriversRes.ok ||
        !approvedDriversRes.ok
      ) {
        throw new Error("One or more endpoints failed to fetch");
      }

      // Parse all JSON bodies in parallel
      const [
        pendingStudentsData,
        approvedStudentsData,
        pendingDriversData,
        approvedDriversData,
      ] = await Promise.all([
        pendingStudentsRes.json(),
        approvedStudentsRes.json(),
        pendingDriversRes.json(),
        approvedDriversRes.json(),
      ]);

      // Save to state
      setPendingStudents(pendingStudentsData);
      setApprovedStudents(approvedStudentsData);
      setPendingDrivers(pendingDriversData);
      setApprovedDrivers(approvedDriversData);
    } catch (err) {
      // Friendly error message and console logging for debugging
      console.error("❌ Fetch error:", err);
      alert("Failed to load dashboard data. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data once on mount
  useEffect(() => {
    fetchData();
  }, []);

  /**
   * handleApprove
   * - type: "students" or "drivers"
   * - id: document id to approve
   * - calls PATCH /{type}/approve/{id}
   */
  const handleApprove = async (type, id) => {
    try {
      const res = await fetch(`${BACKEND_URL}/${type}/approve/${id}`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Approval failed");
      alert("✅ Approved successfully");
      fetchData(); // refresh after change
    } catch (err) {
      console.error(err);
      alert("Failed to approve.");
    }
  };

  /**
   * handleReject
   * - Confirm with browser window before sending DELETE to /{type}/reject/{id}
   * - Only call after user confirmation
   */
  const handleReject = async (type, id) => {
    if (!window.confirm("Reject this user?")) return;
    try {
      const res = await fetch(`${BACKEND_URL}/${type}/reject/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Rejection failed");
      alert("❌ Rejected successfully");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to reject.");
    }
  };

  /**
   * handleDelete
   * - Delete an approved account permanently (admin action)
   */
  const handleDelete = async (type, id) => {
    if (!window.confirm("Delete this account permanently?")) return;
    try {
      const res = await fetch(`${BACKEND_URL}/${type}/delete/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Deletion failed");
      alert("🗑️ Account deleted successfully");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete account.");
    }
  };

  /**
   * renderTable
   * - Reusable HTML table renderer used for students or drivers
   * - list: array of items
   * - type: "students" or "drivers" (used to build different columns/fields)
   * - isApproved: boolean - if true, show Delete button; if false show Approve/Reject
   */
  const renderTable = (list, type, isApproved) => (
    <table style={styles.table}>
      <thead>
        <tr style={styles.tableHeader}>
          <th style={styles.th}>Name</th>

          {/* Students show University columns; Drivers show Age and NIC */}
          {type === "students" ? (
            <>
              <th style={styles.th}>University</th>
              <th style={styles.th}>University ID</th>
            </>
          ) : (
            <>
              <th style={styles.th}>Age</th>
              <th style={styles.th}>NIC</th>
            </>
          )}

          <th style={styles.th}>Actions</th>
        </tr>
      </thead>

      <tbody>
        {/* If no items, show friendly message row */}
        {list.length === 0 ? (
          <tr>
            <td colSpan="5" style={styles.noData}>
              No {isApproved ? "approved" : "pending"} {type}.
            </td>
          </tr>
        ) : (
          // Map each item to a table row
          list.map((item) => (
            <tr key={item._id} style={styles.row}>
              <td style={styles.td}>{item.name}</td>

              {type === "students" ? (
                <>
                  <td style={styles.td}>{item.universityName}</td>
                  <td style={styles.td}>{item.universityId}</td>
                </>
              ) : (
                <>
                  <td style={styles.td}>{item.age}</td>
                  <td style={styles.td}>{item.nic}</td>
                </>
              )}

              <td style={styles.td}>
                {/* If this is a pending user, show Approve & Reject */}
                {!isApproved ? (
                  <>
                    <button
                      style={styles.approveBtn}
                      onClick={() => handleApprove(type, item._id)}
                    >
                      ✅ Approve
                    </button>
                    <button
                      style={styles.rejectBtn}
                      onClick={() => handleReject(type, item._id)}
                    >
                      ❌ Reject
                    </button>
                  </>
                ) : (
                  // If already approved, allow Delete
                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(type, item._id)}
                  >
                    🗑️ Delete
                  </button>
                )}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );

  // Loading UI while data fetch is in progress
  if (loading) return <h3 style={{ textAlign: "center" }}>Loading dashboard...</h3>;

  // Main Dashboard UI
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Admin Dashboard — Rydy 💜</h1>

      {/* Tabs to toggle between Students and Drivers views */}
      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab("students")}
          style={{
            ...styles.tabButton,
            backgroundColor: activeTab === "students" ? "#6A1B9A" : "#ddd",
            color: activeTab === "students" ? "#fff" : "#333",
          }}
        >
          🎓 Students
        </button>

        <button
          onClick={() => setActiveTab("drivers")}
          style={{
            ...styles.tabButton,
            backgroundColor: activeTab === "drivers" ? "#6A1B9A" : "#ddd",
            color: activeTab === "drivers" ? "#fff" : "#333",
          }}
        >
          🚗 Drivers
        </button>
      </div>

      {/* Depending on selected tab, render relevant tables */}
      {activeTab === "students" ? (
        <>
          <h2 style={styles.subheading}>Pending Students</h2>
          {renderTable(pendingStudents, "students", false)}
          <h2 style={styles.subheading}>Approved Students</h2>
          {renderTable(approvedStudents, "students", true)}
        </>
      ) : (
        <>
          <h2 style={styles.subheading}>Pending Drivers</h2>
          {renderTable(pendingDrivers, "drivers", false)}
          <h2 style={styles.subheading}>Approved Drivers</h2>
          {renderTable(approvedDrivers, "drivers", true)}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;

/* Inline styles used by this small admin UI.
   Keeping them in JS makes it easy to paste the whole component into a small app.
*/
const styles = {
  container: {
    padding: "30px",
    backgroundColor: "#f7f0ff",
    minHeight: "100vh",
  },
  heading: {
    textAlign: "center",
    color: "#6A1B9A",
    fontWeight: "800",
    fontSize: "28px",
    marginBottom: "30px",
  },
  tabs: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "30px",
    gap: "10px",
  },
  tabButton: {
    padding: "10px 25px",
    border: "none",
    borderRadius: "25px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "600",
  },
  subheading: {
    color: "#6A1B9A",
    fontSize: "20px",
    marginTop: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
    background: "#fff",
    borderRadius: "10px",
    overflow: "hidden",
  },
  tableHeader: { background: "#ead9ff" },
  th: {
    padding: "10px",
    textAlign: "left",
    color: "#6A1B9A",
    fontWeight: "700",
  },
  td: { padding: "10px", borderBottom: "1px solid #eee", color: "#333" },
  noData: { textAlign: "center", padding: "20px", color: "#6A1B9A" },
  row: { backgroundColor: "#fff" },
  approveBtn: {
    backgroundColor: "#6A1B9A",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    marginRight: "8px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  rejectBtn: {
    backgroundColor: "#e57373",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  deleteBtn: {
    backgroundColor: "#b71c1c",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

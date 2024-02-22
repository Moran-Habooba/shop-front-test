import React, { useEffect, useState } from "react";
import {
  ReplaceUserStatus,
  deleteUser,
  getAllUsers,
} from "../services/usersService";

import "../components/styls/sandBox.css";
import CardManagement from "./CardManagement";
import CategoriesManagement from "./categoriesManagement";
import PageHeader from "../common/pageHeader";
import InventoryManagement from "./InventoryManagement";
import SummaryStats from "./SummaryStats ";
const SandBox = () => {
  const [users, setUsers] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // const handleChangeStatus = (id, currentStatus) => {
  //   const newStatus = currentStatus === "Regular" ? "Business" : "Regular";
  //   ReplaceUserStatus(id, newStatus).then(() => {
  //     setUsers(
  //       users.map((user) => {
  //         if (user._id === id) {
  //           return {
  //             ...user,
  //             isBusiness: newStatus === "Business",
  //             isAdmin: user.isAdmin,
  //           };
  //         }
  //         return user;
  //       })
  //     );
  //   });
  // };
  const handleChangeStatus = (id) => {
    const newStatus = selectedStatus[id];
    ReplaceUserStatus(id, newStatus)
      .then((response) => {
        if (response && response.status === 200) {
          setUsers(
            users.map((user) => {
              if (user._id === id) {
                return {
                  ...user,
                  isBusiness: newStatus === "Business",
                  isAdmin: newStatus === "Admin",
                };
              }
              return user;
            })
          );
        } else {
          console.error("Failed to update user status");
        }
      })
      .catch((error) => {
        console.error("Error updating user status:", error);
      });
  };

  const handleDeleteUser = (id) => {
    deleteUser(id).then(() => {
      setUsers(users.filter((user) => user._id !== id));
    });
  };

  // const formatName = (nameObj) => {
  //   return `${nameObj.first_name} ${
  //     nameObj.middle ? nameObj.middle + " " : ""
  //   }${nameObj.last}`;
  // };
  const formatName = (first_name, last_name) => {
    return `${first_name} ${last_name}`;
  };

  const getStatus = (user) => {
    if (user.isAdmin) {
      return "Admin";
    } else if (user.isBusiness) {
      return "Business";
    } else {
      return "Regular";
    }
  };
  const handleStatusSelection = (userId, newStatus) => {
    setSelectedStatus({ ...selectedStatus, [userId]: newStatus });
  };

  return (
    <div className="gears">
      <i id="gear1" className="bi bi-gear-fill spin fs-1"></i>
      <i id="gear2" className="bi bi-gear-fill spin-back fs-1 "></i>
      <PageHeader
        title={"ניהול"}
        description={
          "ברוכים הבאים לדף ניהול החנות. דף זה נועד לספק שליטה ופיקוח על נתוני  " +
          "המשתמשים/מוצרים/הזמנות /קטגוריות בתוך המערכת. ממשק זה מאפשר לך " +
          "לשנות את סטטוס המשתמשים ולהסיר אותם לפי הצורך ,להוסיף/להסיר קטגוריות  " +
          " ועוד. דף זה נועד לייעל את המשימות הניהוליות שלך, להבטיח ניהול יעיל ואפקטיבי של החנות שלך . "
        }
      />
      <SummaryStats />
      <InventoryManagement />

      <h1 className="text-center">ניהול משתמשים</h1>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th> מזהה ID </th>
            <th>שם</th>
            <th>סטטוס</th>
            <th>עריכת סטטוס משתמש / מחיקת משתמש</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td data-label="מספר ID">{user._id}</td>
              <td data-label="שם משתמש ">
                {formatName(user.first_name, user.last_name)}
              </td>
              <td data-label="סוג משתמש ">{getStatus(user)}</td>
              <td>
                <>
                  <div
                    onChange={(e) =>
                      handleStatusSelection(user._id, e.target.value)
                    }
                    className="mb-3"
                  >
                    <input
                      type="radio"
                      value="Regular"
                      name={`status-${user._id}`}
                      checked={selectedStatus[user._id] === "Regular"}
                      onChange={(e) =>
                        handleStatusSelection(user._id, e.target.value)
                      }
                    />
                    אורח
                    <input
                      type="radio"
                      value="Business"
                      name={`status-${user._id}`}
                      checked={selectedStatus[user._id] === "Business"}
                      onChange={(e) =>
                        handleStatusSelection(user._id, e.target.value)
                      }
                      className="ms-2 me-2"
                    />
                    רשום
                    <input
                      type="radio"
                      value="Admin"
                      name={`status-${user._id}`}
                      checked={selectedStatus[user._id] === "Admin"}
                      onChange={(e) =>
                        handleStatusSelection(user._id, e.target.value)
                      }
                      className="me-2 mt-2"
                    />
                    אדמין
                  </div>

                  <button
                    className="btn btn-info  ms-2 "
                    onClick={() => handleChangeStatus(user._id)}
                  >
                    שנה סטטוס
                  </button>

                  <button
                    className="btn btn-danger me-2 "
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    מחיקה
                  </button>
                </>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <CardManagement />
      <CategoriesManagement />
    </div>
  );
};

export default SandBox;

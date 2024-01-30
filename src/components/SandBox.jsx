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
    <div>
      <PageHeader
        title={"ניהול"}
        description={
          "Welcome to our User and Card Management page. This page is designed to " +
          "provide control and oversight over user and card data within the system. This interface " +
          "enables you to change users status , and remove them  as necessary " +
          " See the cards created and edit their Business number. " +
          "This page is designed to streamline " +
          "your administrative tasks, ensuring efficient and effective management " +
          "of user accounts and cards."
        }
      />
      <h1>ניהול משתמשים</h1>
      {/* <h4 className="text-danger mb-5 mt-1">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        Note Only non-admin users can be changed or deleted
      </h4> */}
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
              <td>{user._id}</td>
              <td>{formatName(user.first_name, user.last_name)}</td>
              <td>{getStatus(user)}</td>
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

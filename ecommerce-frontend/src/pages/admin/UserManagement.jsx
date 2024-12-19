import React, { useState, useEffect } from "react";
import { FaSearch, FaEdit, FaTrashAlt, FaSave, FaTimes } from "react-icons/fa";
import adminService from "../../services/adminService";
import "./UserManagement.scss";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 25;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await adminService.getUserList();
        setUsers(data);
        setFilteredUsers(data);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar usuarios:", err.message);
        setError("No se pudieron cargar los usuarios.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (!term) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(term.toLowerCase()) ||
        user.email.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilteredUsers(users);
    setCurrentPage(1);
  };

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setUpdatedUser(user);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setUpdatedUser({});
  };

  const handleSaveEdit = async () => {
    try {
      await adminService.updateUser(updatedUser.id, updatedUser);
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
      setFilteredUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
      setEditingUser(null);
      setUpdatedUser({});
      alert("Usuario actualizado exitosamente.");
    } catch (err) {
      console.error("Error al actualizar usuario:", err.message);
      alert("No se pudo actualizar el usuario.");
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        await adminService.deleteUser(userId);
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        setFilteredUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== userId)
        );
        alert("Usuario eliminado exitosamente.");
      } catch (err) {
        console.error("Error al eliminar usuario:", err.message);
        alert("No se pudo eliminar el usuario.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({ ...prev, [name]: value }));
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="container user-management my-5">
      <h1 className="text-center mb-4 text-primary">Gestión de Usuarios</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="search-bar mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre o correo electrónico..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <button
            className="btn btn-secondary"
            onClick={clearSearch}
            disabled={!searchTerm}
          >
            <FaTimes /> Limpiar
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center">Cargando usuarios...</p>
      ) : currentUsers.length === 0 ? (
        <p className="text-center">No se encontraron usuarios.</p>
      ) : (
        <>
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>
                    {editingUser === user.id ? (
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={updatedUser.name}
                        onChange={handleChange}
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td>
                    {editingUser === user.id ? (
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={updatedUser.email}
                        onChange={handleChange}
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td>
                    {editingUser === user.id ? (
                      <select
                        className="form-select"
                        name="role"
                        value={updatedUser.role}
                        onChange={handleChange}
                      >
                        <option value="user">Usuario</option>
                        <option value="admin">Administrador</option>
                      </select>
                    ) : (
                      user.role
                    )}
                  </td>
                  <td>
                    {editingUser === user.id ? (
                      <>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={handleSaveEdit}
                        >
                          <FaSave /> Guardar
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={handleCancelEdit}
                        >
                          <FaTimes /> Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn-info btn-sm me-2"
                          onClick={() => handleEdit(user)}
                        >
                          <FaEdit /> Editar
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(user.id)}
                        >
                          <FaTrashAlt /> Eliminar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination d-flex justify-content-center mt-4">
            {[...Array(totalPages).keys()].map((number) => (
              <button
                key={number + 1}
                className={`btn btn-outline-primary me-2 ${
                  currentPage === number + 1 ? "active" : ""
                }`}
                onClick={() => paginate(number + 1)}
              >
                {number + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UserManagement;
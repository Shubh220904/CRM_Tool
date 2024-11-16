import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Tooltip,
  TablePagination,
  TableSortLabel,
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ContactTable = () => {
  const [contacts, setContacts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("first_name");

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/contacts", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/contacts/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchContacts(); // Refresh the contact list
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortContacts = (contacts) => {
    return contacts.sort((a, b) => {
      if (orderBy === "first_name" || orderBy === "last_name" || orderBy === "email") {
        const aVal = a[orderBy].toLowerCase();
        const bVal = b[orderBy].toLowerCase();
        if (aVal < bVal) return order === "asc" ? -1 : 1;
        if (aVal > bVal) return order === "asc" ? 1 : -1;
        return 0;
      }
      return 0;
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page changes
  };

  const sortedContacts = sortContacts(contacts);

  return (
    <Paper sx={{ boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" sx={{ margin: 2 }}>
        Contact List
      </Typography>
      <TableContainer>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>
                <TableSortLabel
                  active={orderBy === "first_name"}
                  direction={orderBy === "first_name" ? order : "asc"}
                  onClick={() => handleRequestSort("first_name")}
                >
                  First Name
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                <TableSortLabel
                  active={orderBy === "last_name"}
                  direction={orderBy === "last_name" ? order : "asc"}
                  onClick={() => handleRequestSort("last_name")}
                >
                  Last Name
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Company</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Job Title</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedContacts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((contact) => (
                <TableRow key={contact.id} sx={{ "&:hover": { backgroundColor: "#f0f0f0" } }}>
                  <TableCell>{contact.first_name}</TableCell>
                  <TableCell>{contact.last_name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell>{contact.company}</TableCell>
                  <TableCell>{contact.job_title}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit" arrow>
                      <IconButton component={Link} to={`/edit/${contact.id}`} color="primary">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete" arrow>
                      <IconButton color="secondary" onClick={() => handleDelete(contact.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={contacts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default ContactTable;

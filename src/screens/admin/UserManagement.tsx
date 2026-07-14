"use client";

import { useMemo, useRef, useState } from "react";
import { useDirectory, type NewUserInput } from "../../context/DirectoryContext";
import type { DirectoryUser } from "../../data/directory";
import { downloadCsv, parseCsv, toCsv } from "../../utils/csv";
import "./UserManagement.css";

const IMPORT_HEADERS = ["Name", "Email", "Role"];

const emptyForm: NewUserInput = { name: "", email: "", role: "" };

export default function UserManagement() {
  const dir = useDirectory();
  const fileRef = useRef<HTMLInputElement>(null);

  const [showDeleted, setShowDeleted] = useState(false);
  const [editing, setEditing] = useState<DirectoryUser | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<NewUserInput>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const visibleUsers = useMemo(
    () => dir.users.filter((u) => (showDeleted ? true : !u.deleted)),
    [dir.users, showDeleted]
  );

  const openCreate = () => {
    setForm(emptyForm);
    setEditing(null);
    setCreating(true);
    setError(null);
  };

  const openEdit = (user: DirectoryUser) => {
    setForm({ name: user.name, email: user.email, role: user.role });
    setEditing(user);
    setCreating(false);
    setError(null);
  };

  const closeModal = () => {
    setCreating(false);
    setEditing(null);
    setError(null);
  };

  const submitForm = () => {
    if (!form.name.trim()) return setError("Name is required.");
    if (!form.email.trim()) return setError("Email is required.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim()))
      return setError("Enter a valid email address.");

    const dupe = dir.users.find(
      (u) =>
        u.email.trim().toLowerCase() === form.email.trim().toLowerCase() &&
        u.id !== editing?.id
    );
    if (dupe) return setError("Another user already uses this email.");

    if (editing) {
      dir.updateUser(editing.id, form);
      flash(`Updated ${form.name}.`);
    } else {
      dir.createUser(form);
      flash(`Created ${form.name}.`);
    }
    closeModal();
  };

  const flash = (msg: string) => {
    setNotice(msg);
    window.setTimeout(() => setNotice((n) => (n === msg ? null : n)), 3500);
  };

  const handleDelete = (user: DirectoryUser) => {
    if (window.confirm(`Soft delete ${user.name}? They will be deactivated and removed from the org chart, but the record is retained.`)) {
      dir.softDeleteUser(user.id);
      flash(`${user.name} soft-deleted.`);
    }
  };

  const exportTemplate = () => {
    downloadCsv("user-import-template.csv", toCsv(IMPORT_HEADERS, []));
    flash("Downloaded import template.");
  };

  const exportCurrent = () => {
    const headers = [...IMPORT_HEADERS, "Company", "Department", "Position", "Status"];
    const rows = dir.users.map((u) => {
      const org = dir.getOrgInfo(u.id);
      return [u.name, u.email, u.role, org.company, org.department, org.position, u.deleted ? "Deleted" : "Active"];
    });
    downloadCsv("user-data-export.csv", toCsv(headers, rows));
    flash(`Exported ${rows.length} users.`);
  };

  const onImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const parsed = parseCsv(String(reader.result));
        const rows: NewUserInput[] = parsed.map((r) => ({
          name: r.Name ?? r.name ?? "",
          email: r.Email ?? r.email ?? "",
          role: r.Role ?? r.role ?? "",
        }));
        const valid = rows.filter((r) => r.email.trim());
        if (valid.length === 0) {
          flash("No rows with an email found. Use the template columns: Name, Email, Role.");
        } else {
          const { created, updated } = await dir.importUsers(valid);
          flash(`Imported: ${created} created, ${updated} updated.`);
        }
      } catch {
        flash("Could not parse the file. Please use the CSV template.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="mock-content">
      <header className="mock-header">
        <h1>User Management</h1>
        <p>
          Create and maintain user records. Company, Department and Position are synced in real time
          from the Org Chart Builder and cannot be edited here.
        </p>
      </header>

      {notice && <div className="um-notice">{notice}</div>}

      <div className="um-toolbar">
        <button className="um-btn um-btn-primary" onClick={openCreate}>+ Create User</button>
        <button className="um-btn" onClick={exportTemplate}>⬇ Export Template</button>
        <button className="um-btn" onClick={exportCurrent}>⬇ Export Current Data</button>
        <button className="um-btn" onClick={() => fileRef.current?.click()}>⬆ Import (Excel/CSV)</button>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,.xls,.xlsx,text/csv"
          hidden
          onChange={onImportFile}
        />
        <label className="um-show-deleted">
          <input
            type="checkbox"
            checked={showDeleted}
            onChange={(e) => setShowDeleted(e.target.checked)}
          />
          Show deleted
        </label>
      </div>

      <div className="mock-table-wrap">
        <table className="mock-table um-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Department</th>
              <th>Position</th>
              <th>Role</th>
              <th>Status</th>
              <th className="um-actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleUsers.map((u) => {
              const org = dir.getOrgInfo(u.id);
              return (
                <tr key={u.id} className={u.deleted ? "um-row-deleted" : ""}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td className="um-synced">{org.company}</td>
                  <td className="um-synced">{org.department}</td>
                  <td className="um-synced">{org.position}</td>
                  <td>{u.role || "—"}</td>
                  <td>
                    <span className={`status-badge ${u.deleted ? "off" : "on"}`}>
                      {u.deleted ? "Deleted" : "Active"}
                    </span>
                  </td>
                  <td className="um-actions-col">
                    {u.deleted ? (
                      <button className="um-link" onClick={() => dir.restoreUser(u.id)}>Restore</button>
                    ) : (
                      <>
                        <button className="um-link" onClick={() => openEdit(u)}>Update</button>
                        <button className="um-link um-link-danger" onClick={() => handleDelete(u)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
            {visibleUsers.length === 0 && (
              <tr>
                <td colSpan={8} className="um-empty-cell">No users to show.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {(creating || editing) && (
        <div className="um-modal-overlay" onClick={closeModal}>
          <div className="um-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editing ? "Update User" : "Create User"}</h2>

            <label className="um-field">
              <span>Name</span>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Full name"
              />
            </label>

            <label className="um-field">
              <span>Email</span>
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="name@contoso.com"
              />
            </label>

            <label className="um-field">
              <span>Role <em>(RBAC to be implemented later)</em></span>
              <input
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="e.g. HR Manager"
              />
            </label>

            <div className="um-field um-field-readonly">
              <span>Company · Department · Position</span>
              <div className="um-synced-box">
                {editing ? (
                  (() => {
                    const org = dir.getOrgInfo(editing.id);
                    return `${org.company} · ${org.department} · ${org.position}`;
                  })()
                ) : (
                  "Assign in the Org Chart Builder after creating the user"
                )}
                <span className="um-sync-tag">🔒 synced from Org Chart</span>
              </div>
            </div>

            {error && <div className="um-error">{error}</div>}

            <div className="um-modal-actions">
              <button className="um-btn" onClick={closeModal}>Cancel</button>
              <button className="um-btn um-btn-primary" onClick={submitForm}>
                {editing ? "Save Changes" : "Create User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

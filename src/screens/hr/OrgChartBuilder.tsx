"use client";

import { useMemo, useState } from "react";
import { useDirectory } from "../../context/DirectoryContext";
import type { Department } from "../../data/directory";
import "./OrgChartBuilder.css";

const DRAG_TYPE = "application/x-poc-user";

export default function OrgChartBuilder() {
  const dir = useDirectory();
  const [newCompany, setNewCompany] = useState("");
  const [paletteOver, setPaletteOver] = useState(false);

  const activeUsers = useMemo(
    () => dir.users.filter((u) => !u.deleted),
    [dir.users]
  );
  const assignedIds = useMemo(
    () => new Set(dir.assignments.map((a) => a.userId)),
    [dir.assignments]
  );
  const availableUsers = activeUsers.filter((u) => !assignedIds.has(u.id));

  const addCompany = () => {
    const name = newCompany.trim();
    if (!name) return;
    dir.addCompany(name);
    setNewCompany("");
  };

  const onDropToPalette = (e: React.DragEvent) => {
    e.preventDefault();
    setPaletteOver(false);
    const userId = e.dataTransfer.getData(DRAG_TYPE);
    if (userId) dir.unassignUser(userId);
  };

  return (
    <div className="mock-content">
      <header className="mock-header">
        <h1>Org Chart Builder</h1>
        <p>
          Build the org concretely as <strong>Company → Department → People</strong>. Labels are free
          text — the system cares about the hierarchy, not the names. Drag a person from the panel
          onto a department to place them.
        </p>
      </header>

      <div className="oc-layout">
        {/* People palette */}
        <aside
          className={`oc-palette ${paletteOver ? "oc-drop-active" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setPaletteOver(true);
          }}
          onDragLeave={() => setPaletteOver(false)}
          onDrop={onDropToPalette}
        >
          <div className="oc-palette-head">
            <h3>People</h3>
            <span className="oc-count">{availableUsers.length} unassigned</span>
          </div>
          <p className="oc-palette-hint">
            Drag onto a department to assign. Drag back here to remove from the chart.
          </p>
          <div className="oc-people-list">
            {availableUsers.map((u) => (
              <div
                key={u.id}
                className="oc-person"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData(DRAG_TYPE, u.id);
                  e.dataTransfer.effectAllowed = "move";
                }}
              >
                <span className="oc-person-avatar">{initials(u.name)}</span>
                <div className="oc-person-meta">
                  <div className="oc-person-name">{u.name}</div>
                  <div className="oc-person-role">{u.role || "No role"}</div>
                </div>
              </div>
            ))}
            {availableUsers.length === 0 && (
              <div className="oc-palette-empty">
                Everyone is placed. Create users in Administration → User Management to add more.
              </div>
            )}
          </div>
        </aside>

        {/* Chart */}
        <section className="oc-chart">
          {dir.companies.map((company) => (
            <CompanyCard key={company.id} companyId={company.id} companyName={company.name} />
          ))}

          <div className="oc-add-company">
            <input
              value={newCompany}
              placeholder="New company name…"
              onChange={(e) => setNewCompany(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCompany()}
            />
            <button className="oc-btn oc-btn-primary" onClick={addCompany}>+ Add Company</button>
          </div>
        </section>
      </div>
    </div>
  );
}

function CompanyCard({ companyId, companyName }: { companyId: string; companyName: string }) {
  const dir = useDirectory();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(companyName);
  const [addingDept, setAddingDept] = useState(false);
  const [newDept, setNewDept] = useState("");

  const rootDepts = dir.departments.filter(
    (d) => d.companyId === companyId && d.parentId === null
  );

  const saveName = () => {
    if (name.trim()) dir.renameCompany(companyId, name);
    else setName(companyName);
    setEditing(false);
  };

  const addDept = () => {
    if (newDept.trim()) dir.addDepartment(companyId, null, newDept);
    setNewDept("");
    setAddingDept(false);
  };

  return (
    <div className="oc-company">
      <div className="oc-company-head">
        <span className="oc-company-icon">🏢</span>
        {editing ? (
          <input
            className="oc-inline-input"
            value={name}
            autoFocus
            onChange={(e) => setName(e.target.value)}
            onBlur={saveName}
            onKeyDown={(e) => e.key === "Enter" && saveName()}
          />
        ) : (
          <span className="oc-company-name" onDoubleClick={() => setEditing(true)}>
            {companyName}
          </span>
        )}
        <div className="oc-node-actions">
          <button className="oc-icon-btn" title="Rename" onClick={() => setEditing(true)}>✏️</button>
          <button className="oc-icon-btn" title="Add department" onClick={() => setAddingDept(true)}>➕</button>
          <button
            className="oc-icon-btn oc-danger"
            title="Delete company"
            onClick={() => {
              if (window.confirm(`Delete "${companyName}" and all its departments? People will be unassigned.`))
                dir.deleteCompany(companyId);
            }}
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="oc-tree">
        {rootDepts.map((d) => (
          <DepartmentNode key={d.id} dept={d} depth={0} />
        ))}
        {rootDepts.length === 0 && !addingDept && (
          <div className="oc-tree-empty">No departments yet. Use ➕ to add one.</div>
        )}
        {addingDept && (
          <div className="oc-add-dept">
            <input
              value={newDept}
              autoFocus
              placeholder="Department name…"
              onChange={(e) => setNewDept(e.target.value)}
              onBlur={addDept}
              onKeyDown={(e) => e.key === "Enter" && addDept()}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function DepartmentNode({ dept, depth }: { dept: Department; depth: number }) {
  const dir = useDirectory();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(dept.name);
  const [addingChild, setAddingChild] = useState(false);
  const [newChild, setNewChild] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const children = dir.departments.filter((d) => d.parentId === dept.id);
  const members = dir.assignments.filter((a) => a.departmentId === dept.id);

  const saveName = () => {
    if (name.trim()) dir.renameDepartment(dept.id, name);
    else setName(dept.name);
    setEditing(false);
  };

  const addChild = () => {
    if (newChild.trim()) dir.addDepartment(dept.companyId, dept.id, newChild);
    setNewChild("");
    setAddingChild(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const userId = e.dataTransfer.getData(DRAG_TYPE);
    if (userId) dir.assignUser(userId, dept.id);
  };

  return (
    <div className="oc-node" style={{ "--depth": depth } as React.CSSProperties}>
      <div
        className={`oc-node-box ${dragOver ? "oc-drop-active" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        <div className="oc-node-row">
          <span className="oc-node-icon">📁</span>
          {editing ? (
            <input
              className="oc-inline-input"
              value={name}
              autoFocus
              onChange={(e) => setName(e.target.value)}
              onBlur={saveName}
              onKeyDown={(e) => e.key === "Enter" && saveName()}
            />
          ) : (
            <span className="oc-node-name" onDoubleClick={() => setEditing(true)}>
              {dept.name}
            </span>
          )}
          <div className="oc-node-actions">
            <button className="oc-icon-btn" title="Rename" onClick={() => setEditing(true)}>✏️</button>
            <button className="oc-icon-btn" title="Add sub-department" onClick={() => setAddingChild(true)}>➕</button>
            <button
              className="oc-icon-btn oc-danger"
              title="Delete department"
              onClick={() => {
                if (window.confirm(`Delete "${dept.name}" and its sub-departments? People will be unassigned.`))
                  dir.deleteDepartment(dept.id);
              }}
            >
              🗑️
            </button>
          </div>
        </div>

        <div className="oc-members">
          {members.map((m) => {
            const user = dir.users.find((u) => u.id === m.userId);
            if (!user) return null;
            return (
              <div
                key={m.userId}
                className="oc-member"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData(DRAG_TYPE, m.userId);
                  e.dataTransfer.effectAllowed = "move";
                }}
              >
                <span className="oc-person-avatar sm">{initials(user.name)}</span>
                <div className="oc-member-meta">
                  <div className="oc-member-name">{user.name}</div>
                  <button
                    className="oc-position"
                    title="Set position"
                    onClick={() => {
                      const p = window.prompt(`Position for ${user.name}:`, m.position);
                      if (p !== null) dir.updatePosition(m.userId, p.trim());
                    }}
                  >
                    {m.position || "＋ set position"}
                  </button>
                </div>
                <button
                  className="oc-member-remove"
                  title="Remove from chart"
                  onClick={() => dir.unassignUser(m.userId)}
                >
                  ×
                </button>
              </div>
            );
          })}
          {members.length === 0 && (
            <div className="oc-drop-hint">Drop a person here</div>
          )}
        </div>
      </div>

      {(children.length > 0 || addingChild) && (
        <div className="oc-children">
          {children.map((c) => (
            <DepartmentNode key={c.id} dept={c} depth={depth + 1} />
          ))}
          {addingChild && (
            <div className="oc-add-dept">
              <input
                value={newChild}
                autoFocus
                placeholder="Sub-department name…"
                onChange={(e) => setNewChild(e.target.value)}
                onBlur={addChild}
                onKeyDown={(e) => e.key === "Enter" && addChild()}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

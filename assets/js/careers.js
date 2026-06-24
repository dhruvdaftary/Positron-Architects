/* ===========================================================
   POSITRON ARCHITECTS — Careers data source
   ===========================================================
   Job listings are pulled live from a Google Sheet — nothing is
   hard-coded on this page, so you manage roles entirely from
   Sheets without touching any code.

   SETUP (one-time):
   1. Create a Google Sheet with these column headers in row 1:
        Title | Location | Department | Type | Summary | Description | Requirements | ApplyLink | Active

      - Requirements: separate multiple bullet points with a pipe  |
        e.g.  B.Arch or equivalent | 5+ years experience | Knowledge of AutoCAD & Revit
      - Active: write "yes" to show the role, "no" to hide it without deleting it.
      - ApplyLink: optional — a mailto: link or a Google Form URL.
        Leave blank and it will default to the Contact page.

   2. File → Share → "Anyone with the link" → Viewer.

   3. Copy the Sheet ID from the URL:
        https://docs.google.com/spreadsheets/d/  >>>SHEET_ID<<<  /edit
      Paste it into SHEET_ID below.

   4. If your tab isn't named "Sheet1", update SHEET_NAME too.

   The page re-fetches the sheet on every load, so adding, editing
   or removing a row in Sheets is reflected on the live site the
   next time someone opens or refreshes the Careers page.
   =========================================================== */

var SHEET_ID = "1ErM4lfZ9-5jdyn5I-4kikwICUvzOsINgoL3ynUbVTnI";
var SHEET_NAME = "Sheet1";

var CSV_URL =
  "https://docs.google.com/spreadsheets/d/" +
  SHEET_ID +
  "/gviz/tq?tqx=out:csv&sheet=" +
  encodeURIComponent(SHEET_NAME);

/* ---------- Minimal CSV parser (handles quoted commas) ---------- */
function parseCSV(text) {
  var rows = [];
  var row = [];
  var field = "";
  var inQuotes = false;

  for (var i = 0; i < text.length; i++) {
    var c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
      } else if (c === ",") {
        row.push(field);
        field = "";
      } else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else {
        field += c;
      }
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter(function (r) {
    return r.some(function (cell) { return cell.trim() !== ""; });
  });
}

function rowsToJobs(rows) {
  if (!rows.length) return [];
  var headers = rows[0].map(function (h) { return h.trim(); });
  var jobs = [];
  for (var i = 1; i < rows.length; i++) {
    var obj = {};
    headers.forEach(function (h, idx) {
      obj[h] = (rows[i][idx] || "").trim();
    });
    jobs.push(obj);
  }
  return jobs;
}

function isActive(job) {
  var v = (job.Active || "").toLowerCase();
  return v === "yes" || v === "true" || v === "y" || v === "1";
}

function escapeHtml(str) {
  return String(str || "").replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
  });
}

function jobCardHtml(job, idx) {
  return (
    '<div class="job" data-job-idx="' + idx + '">' +
    "<div>" +
    "<h3>" + escapeHtml(job.Title) + "</h3>" +
    '<div class="loc-tag">' + escapeHtml(job.Location) + " · " + escapeHtml(job.Type) + "</div>" +
    "</div>" +
    '<span class="dept">' + escapeHtml(job.Department) + "</span>" +
    '<span class="btn ghost">View role →</span>' +
    "</div>"
  );
}

function jobModalHtml(job) {
  var reqs = (job.Requirements || "")
    .split("|")
    .map(function (s) { return s.trim(); })
    .filter(Boolean);

  var applyHref = job.ApplyLink && job.ApplyLink.trim()
    ? job.ApplyLink.trim()
    : "contact.html?role=" + encodeURIComponent(job.Title || "general");

  var reqHtml = reqs.length
    ? '<ul class="modal-list">' + reqs.map(function (r) { return "<li>" + escapeHtml(r) + "</li>"; }).join("") + "</ul>"
    : "";

  return (
    '<div class="modal-body" style="padding-top:36px;">' +
    '<span class="sheet-no">' + escapeHtml(job.Department || "ROLE") + "</span>" +
    "<h2>" + escapeHtml(job.Title) + "</h2>" +
    '<div class="modal-loc">' + escapeHtml(job.Location) + "</div>" +
    '<div class="modal-meta-row">' +
    '<div class="m"><span class="k">Type</span><span class="v">' + escapeHtml(job.Type) + "</span></div>" +
    '<div class="m"><span class="k">Department</span><span class="v">' + escapeHtml(job.Department) + "</span></div>" +
    "</div>" +
    '<p class="modal-desc">' + escapeHtml(job.Description || job.Summary) + "</p>" +
    reqHtml +
    '<div class="modal-cta"><a class="btn solid" href="' + applyHref + '" target="_blank" >Apply for this role →</a></div>' +
    "</div>"
  );
}

/* ---------- Empty state (also used to absorb any error silently) ---------- */
function showEmptyState(reason) {
  var container = document.getElementById("jobs-container");
  if (!container) return;
  container.innerHTML =
    '<div class="job-empty-state" style="border:1px dashed var(--line);border-radius:var(--radius);padding:40px 28px;text-align:center;">' +
    '<p style="color:var(--navy);font-size:17px;font-weight:600;">No open positions available at the moment.</p>' +
    '<p style="color:var(--charcoal);font-size:14.5px;margin-top:8px;">Please check back later, or send your portfolio anyway.</p>' +
    '</div>';
  if (reason) console.info("[careers] showing empty state — reason:", reason);
}

function renderJobs(jobs) {
  var container = document.getElementById("jobs-container");
  if (!container) return;

  var active = jobs.filter(isActive);

  if (!active.length) {
    showEmptyState();
    return;
  }

  container.innerHTML = active.map(jobCardHtml).join("");

  container.querySelectorAll(".job").forEach(function (el, idx) {
    el.addEventListener("click", function () {
      window.openModal(jobModalHtml(active[idx]));
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  var container = document.getElementById("jobs-container");
  if (!container) return;

  if (SHEET_ID === "PASTE_YOUR_GOOGLE_SHEET_ID_HERE") {
    showEmptyState("SHEET_ID not configured yet — set it in assets/js/careers.js");
    return;
  }

  fetch(CSV_URL)
    .then(function (res) {
      if (!res.ok) throw new Error("HTTP_" + res.status);
      return res.text();
    })
    .then(function (text) {
      var rows = parseCSV(text);
      var jobs = rowsToJobs(rows);
      renderJobs(jobs);
    })
    .catch(function (err) {
      // Technical detail goes to the console only — visitors never see
      // sheet IDs, HTTP statuses or sharing-permission errors.
      console.error("[careers] sheet load failed — visitor sees 'no open positions'. Details:", err);
      showEmptyState(err && err.message);
    });
});
